import type { THEOplayer } from 'react-native-theoplayer';
import { AnalyticsConfig } from '../api/AnalyticsConfig';
import { ChromelessPlayer } from 'theoplayer';
import { CustomData, SourceMetadata } from '@theoplayer/react-native-analytics-bitmovin';
import { DefaultMetadata } from '../api/DefaultMetadata';
import { CustomDataValues, THEOplayerAdapter } from 'bitmovin-analytics';
import { buildWebConfigFromDefaultMetadata, buildWebConfigFromSourceMetadata, buildWebSourceMetadata } from './web/BitmovinAdapterWeb';
import { SsaiApi } from '../api/SsaiApi';
import { BitmovinSsaiAdapterWeb } from './web/BitmovinSsaiAdapterWeb';

const BITMOVIN_ANALYTICS_AUGMENTED_MARKER = '__bitmovinAnalyticsHasBeenSetup';

export class BitmovinConnectorAdapter {
  private readonly _integration: THEOplayerAdapter;
  private readonly _ssai: BitmovinSsaiAdapterWeb;

  constructor(player: THEOplayer, config: AnalyticsConfig, defaultMetadata?: DefaultMetadata) {
    const webConfig = buildWebConfigFromDefaultMetadata(config, defaultMetadata);
    this._integration = new THEOplayerAdapter(webConfig, player.nativeHandle as ChromelessPlayer);
    this._ssai = new BitmovinSsaiAdapterWeb(this._integration.ssai);
  }

  updateSourceMetadata(sourceMetadata: SourceMetadata): void {
    this._integration.sourceChange(buildWebConfigFromSourceMetadata(sourceMetadata));
  }

  updateCustomData(customData: CustomData): void {
    // Any new customData values will be merged with the existing ones, so only the fields that are included in the customData parameter will be updated.
    this._integration.setCustomData(customData as CustomDataValues);
  }

  programChange(sourceMetadata: SourceMetadata): void {
    this._integration.programChange(buildWebSourceMetadata(sourceMetadata));
  }

  sendCustomDataEvent(customData: CustomData): void {
    this._integration.setCustomDataOnce(customData);
  }

  get ssai(): SsaiApi {
    return this._integration.ssai;
  }

  destroy() {
    /**
     * We can safely disable the BITMOVIN_ANALYTICS_AUGMENTED_MARKER here to avoid duplicate connectors being attached to the same player instance,
     * because we know either the collector or both player and collector were destroyed here.
     * This is needed because when using <StrictMode> in React, mount effects will trigger twice in development mode.
     */
    const container = document.querySelector('.theoplayer-container');
    if (container) {
      container[BITMOVIN_ANALYTICS_AUGMENTED_MARKER] = false;
    }
  }
}
