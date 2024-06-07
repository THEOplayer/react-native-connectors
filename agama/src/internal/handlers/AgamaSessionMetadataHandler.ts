import { AgamaClient, AgamaSessionMetadata } from '../AgamaClient';
import { AbstractAgamaHandler } from './AbstractAgamaHandler';
import { PlayerEventType, THEOplayer } from 'react-native-theoplayer';
import type { AgamaSourceConfiguration } from '../../api/AgamaSourceConfiguration';
import type { AgamaMetrics } from '../metrics/AgamaMetrics';
import { AgamaMetricsEventType, AgamaMetricsManifestResponseEvent } from '../metrics/AgamaMetrics';

/**
 * AgamaSessionMetadataHandler handles the following session-related attributes:
 * - amount of video qualities (AgamaSessionMetadata.NUMBER_OF_CONTENT_PROFILES_);
 * - asset manifest/playlist URI (AgamaSessionMetadata.MANIFEST_URI_);
 * - asset duration (gamaSessionMetadata.ASSET_DURATION_).
 */
export class AgamaSessionMetadataHandler extends AbstractAgamaHandler {
  private _metricsAgamaMetrics: AgamaMetrics;

  constructor(player: THEOplayer, agamaClient: AgamaClient, metrics: AgamaMetrics) {
    super(player, agamaClient);
    this._metricsAgamaMetrics = metrics;
  }

  startReporting_(): void {
    super.startReporting_();
    this.reportNumberOfContentProfiles_();
    this.attachReportingListeners_();
  }

  unload_(): void {
    this.removeReportingListeners_();
    super.unload_();
  }

  private attachReportingListeners_(): void {
    this._player.addEventListener(PlayerEventType.MEDIA_TRACK_LIST, this.reportNumberOfContentProfiles_);
    this._player.addEventListener(PlayerEventType.DURATION_CHANGE, this.handleDurationChange_);
    this._metricsAgamaMetrics.addEventListener(AgamaMetricsEventType.MANIFEST_RESPONSE_, this.handleManifestResponse_);
  }

  private removeReportingListeners_(): void {
    this._player.removeEventListener(PlayerEventType.MEDIA_TRACK_LIST, this.reportNumberOfContentProfiles_);
    this._metricsAgamaMetrics.removeEventListener(AgamaMetricsEventType.MANIFEST_RESPONSE_, this.handleManifestResponse_);
    this._player.removeEventListener(PlayerEventType.DURATION_CHANGE, this.handleDurationChange_);
  }

  reportInitialSessionMetadata_(agamaSourceConfig: AgamaSourceConfiguration): void {
    if (agamaSourceConfig.serviceName) {
      this.reportSessionMetadata_(AgamaSessionMetadata.SERVICE_NAME_, agamaSourceConfig.serviceName);
    }
    if (agamaSourceConfig.cdn) {
      this.reportSessionMetadata_(AgamaSessionMetadata.CDN_, agamaSourceConfig.cdn);
    }
    if (agamaSourceConfig.contentTitle) {
      this.reportSessionMetadata_(AgamaSessionMetadata.CONTENT_TITLE_, agamaSourceConfig.contentTitle);
    }
    if (agamaSourceConfig.contentType) {
      this.reportSessionMetadata_(AgamaSessionMetadata.CONTENT_TYPE_, agamaSourceConfig.contentType);
    }
    if (agamaSourceConfig.contentDescription) {
      this.reportSessionMetadata_(AgamaSessionMetadata.CONTENT_DESCRIPTION_, agamaSourceConfig.contentDescription);
    }
  }

  private readonly handleDurationChange_ = (): void => {
    if (this.isVod_()) {
      this.reportSessionMetadata_(AgamaSessionMetadata.ASSET_DURATION_, Math.round(this._player.duration));
    }
  };

  private readonly handleManifestResponse_ = (response: AgamaMetricsManifestResponseEvent): void => {
    this.reportSessionMetadata_(AgamaSessionMetadata.MANIFEST_URI_, response.uri);
  };

  private readonly reportNumberOfContentProfiles_ = (): void => {
    const activeVideoTrack = this._player.videoTracks.find((track) => track.uid === this._player.selectedVideoTrack);
    if (activeVideoTrack) {
      this.reportSessionMetadata_(AgamaSessionMetadata.NUMBER_OF_CONTENT_PROFILES_, activeVideoTrack.qualities.length);
    }
  };

  private reportSessionMetadata_(state: AgamaSessionMetadata, metadata: string | number): void {
    if (this._isReporting) {
      this._agamaClient.setSessionMetadata_(state, metadata);
    }
  }
}
