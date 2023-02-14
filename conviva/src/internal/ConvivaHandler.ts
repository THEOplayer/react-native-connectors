import { AdAnalytics, Analytics, Constants, ConvivaMetadata, VideoAnalytics } from '@convivainc/conviva-js-coresdk';
import {
  calculateBufferLength,
  calculateConvivaOptions,
  collectContentMetadata,
  collectDeviceMetadata,
  collectPlayerInfo
} from './utils/Utils';
import { CsaiAdReporter } from './ads/CsaiAdReporter';
import type { SourceDescription, THEOplayer, VideoQuality } from "react-native-theoplayer";
import { findMediaTrackByUid, PlayerEventType } from "react-native-theoplayer";
import { CONVIVA_CALLBACK_FUNCTIONS } from "./ConvivaCallbackFunctions";
import type { ConvivaConfiguration } from "../api/ConvivaConfiguration";

export class ConvivaHandler {
  private readonly player: THEOplayer;
  private readonly convivaMetadata: ConvivaMetadata;
  private readonly convivaConfig: ConvivaConfiguration;

  private readonly convivaVideoAnalytics: VideoAnalytics;
  private readonly convivaAdAnalytics: AdAnalytics;

  private readonly adReporter: CsaiAdReporter | undefined;

  private currentSource: SourceDescription | undefined;
  private playbackRequested = false;

  constructor(player: THEOplayer, convivaMetaData: ConvivaMetadata, config: ConvivaConfiguration) {
    this.player = player;
    this.convivaMetadata = convivaMetaData;
    this.convivaConfig = config;
    this.currentSource = player.source;

    Analytics.setDeviceMetadata(collectDeviceMetadata());
    Analytics.init(
      this.convivaConfig.customerKey,
      CONVIVA_CALLBACK_FUNCTIONS,
      calculateConvivaOptions(this.convivaConfig)
    );
    // This object will be used throughout the entire application lifecycle to report video related events.
    this.convivaVideoAnalytics = Analytics.buildVideoAnalytics();
    this.convivaVideoAnalytics.setPlayerInfo(collectPlayerInfo());
    this.convivaVideoAnalytics.setCallback(this.convivaCallback);

    // This object will be used throughout the entire application lifecycle to report ad related events.
    this.convivaAdAnalytics = Analytics.buildAdAnalytics(this.convivaVideoAnalytics);

    if (player.ads !== undefined) {
      this.adReporter = new CsaiAdReporter(
        this.player,
        this.convivaVideoAnalytics,
        this.convivaAdAnalytics,
        this.convivaMetadata
      );
    }

    this.addEventListeners();
  }

  setContentInfo(metadata: ConvivaMetadata): void {
    this.convivaVideoAnalytics.setContentInfo(metadata);
  }

  setAdInfo(metadata: ConvivaMetadata): void {
    this.convivaAdAnalytics.setAdInfo(metadata);
  }

  private addEventListeners(): void {
    this.player.addEventListener(PlayerEventType.PLAY, this.onPlay);
    this.player.addEventListener(PlayerEventType.PLAYING, this.onPlaying);
    this.player.addEventListener(PlayerEventType.PAUSE, this.onPause);
    // this.player.addEventListener('emptied', this.onEmptied);
    this.player.addEventListener(PlayerEventType.WAITING, this.onWaiting);
    this.player.addEventListener(PlayerEventType.SEEKING, this.onSeeking);
    this.player.addEventListener(PlayerEventType.SEEKED, this.onSeeked);
    this.player.addEventListener(PlayerEventType.ERROR, this.onError);
    this.player.addEventListener(PlayerEventType.SEGMENT_NOT_FOUND, this.onSegmentNotFound);
    this.player.addEventListener(PlayerEventType.SOURCE_CHANGE, this.onSourceChange);
    this.player.addEventListener(PlayerEventType.ENDED, this.onEnded);
    this.player.addEventListener(PlayerEventType.DURATION_CHANGE, this.onDurationChange);
    // this.player.addEventListener('destroy', this.onDestroy);

    // this.player.network.addEventListener('offline', this.onNetworkOffline);
  }

  private removeEventListeners(): void {
    this.player.removeEventListener(PlayerEventType.PLAY, this.onPlay);
    this.player.removeEventListener(PlayerEventType.PLAYING, this.onPlaying);
    this.player.removeEventListener(PlayerEventType.PAUSE, this.onPause);
    // this.player.removeEventListener('emptied', this.onEmptied);
    this.player.removeEventListener(PlayerEventType.WAITING, this.onWaiting);
    this.player.removeEventListener(PlayerEventType.SEEKING, this.onSeeking);
    this.player.removeEventListener(PlayerEventType.SEEKED, this.onSeeked);
    this.player.removeEventListener(PlayerEventType.ERROR, this.onError);
    this.player.removeEventListener(PlayerEventType.SEGMENT_NOT_FOUND, this.onSegmentNotFound);
    this.player.removeEventListener(PlayerEventType.SOURCE_CHANGE, this.onSourceChange);
    this.player.removeEventListener(PlayerEventType.ENDED, this.onEnded);
    this.player.removeEventListener(PlayerEventType.DURATION_CHANGE, this.onDurationChange);
    // this.player.removeEventListener('destroy', this.onDestroy);

    // this.player.network.removeEventListener('offline', this.onNetworkOffline);
  }

  private convivaCallback = () => {
    const currentTime = this.player.currentTime * 1000;
    this.convivaVideoAnalytics.reportPlaybackMetric(Constants.Playback.PLAY_HEAD_TIME, currentTime);
    this.convivaVideoAnalytics.reportPlaybackMetric(
      Constants.Playback.BUFFER_LENGTH,
      calculateBufferLength(this.player)
    );

    if (this.player.selectedVideoTrack !== undefined) {
      const activeQuality = findMediaTrackByUid(this.player.videoTracks, this.player.selectedVideoTrack)?.activeQuality as VideoQuality;
      if (activeQuality) {
        this.convivaVideoAnalytics.reportPlaybackMetric(Constants.Playback.BITRATE, activeQuality.bandwidth / 1000);
        this.convivaVideoAnalytics.reportPlaybackMetric(Constants.Playback.RENDERED_FRAMERATE, activeQuality.frameRate);
        this.convivaVideoAnalytics.reportPlaybackMetric(Constants.Playback.RESOLUTION, activeQuality.width, activeQuality.height);
      }
    }
  };

  private readonly onPlay = () => {
    this.maybeReportPlaybackRequested();
  };

  private maybeReportPlaybackRequested() {
    if (!this.playbackRequested) {
      this.playbackRequested = true;
      this.convivaVideoAnalytics.reportPlaybackRequested(
        collectContentMetadata(this.player, this.convivaMetadata)
      );
    }
  }

  private maybeReportPlaybackEnded() {
    if (this.playbackRequested) {
      this.convivaVideoAnalytics.reportPlaybackEnded();
      this.playbackRequested = false;
    }
  }

  private readonly onPlaying = () => {
    this.convivaVideoAnalytics.reportPlaybackMetric(Constants.Playback.PLAYER_STATE, Constants.PlayerState.PLAYING);
  };

  private readonly onPause = () => {
    this.convivaVideoAnalytics.reportPlaybackMetric(Constants.Playback.PLAYER_STATE, Constants.PlayerState.PAUSED);
  };

  // private readonly onEmptied = () => {
  //   this.convivaVideoAnalytics.reportPlaybackMetric(
  //     Constants.Playback.PLAYER_STATE,
  //     Constants.PlayerState.BUFFERING
  //   );
  // };

  private readonly onWaiting = () => {
    this.convivaVideoAnalytics.reportPlaybackMetric(
      Constants.Playback.PLAYER_STATE,
      Constants.PlayerState.BUFFERING
    );
  };

  private readonly onSeeking = () => {
    this.convivaVideoAnalytics.reportPlaybackMetric(Constants.Playback.SEEK_STARTED);
  };

  private readonly onSeeked = () => {
    this.convivaVideoAnalytics.reportPlaybackMetric(Constants.Playback.SEEK_ENDED);
  };

  private readonly onError = () => {
    this.convivaVideoAnalytics.reportPlaybackFailed('Fatal error occured');
  };

  private readonly onSegmentNotFound = () => {
    this.convivaVideoAnalytics.reportPlaybackError(
      'A Video Playback Failure has occurred: Segment not found',
      Constants.ErrorSeverity.FATAL
    );
  };

  // private readonly onNetworkOffline = () => {
  //   this.convivaVideoAnalytics.reportPlaybackError(
  //     'A Video Playback Failure has occurred: Waiting for the manifest to come back online',
  //     Constants.ErrorSeverity.FATAL
  //   );
  // };

  private readonly onSourceChange = () => {
    if (this.player.source === this.currentSource) {
      return;
    }
    this.maybeReportPlaybackEnded();
    this.reset(true);
    this.currentSource = this.player.source;
  };

  private readonly onEnded = () => {
    this.convivaVideoAnalytics.reportPlaybackMetric(Constants.Playback.PLAYER_STATE, Constants.PlayerState.STOPPED);
    this.maybeReportPlaybackEnded();
    this.reset(false);
  };

  private readonly onDurationChange = () => {
    const contentInfo: ConvivaMetadata = {};
    const duration = this.player.duration;
    if (duration === Infinity) {
      contentInfo[Constants.IS_LIVE] = Constants.StreamType.LIVE;
    } else {
      contentInfo[Constants.IS_LIVE] = Constants.StreamType.VOD;
      contentInfo[Constants.DURATION] = duration;
    }
    this.convivaVideoAnalytics.setContentInfo(contentInfo);
  };

  // private readonly onDestroy = () => {
  //   this.destroy();
  // };

  private reset(resetSource = true): void {
    if (resetSource) {
      this.currentSource = undefined;
    }
    this.playbackRequested = false;
  }

  destroy(): void {
    this.maybeReportPlaybackEnded();
    this.removeEventListeners();
    this.adReporter?.destroy();
    this.convivaAdAnalytics.release();
    this.convivaVideoAnalytics.release();
    Analytics.release();
  }
}
