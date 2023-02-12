import type { Ad, AdBreak, AdEvent, GoogleImaAd, THEOplayer } from 'react-native-theoplayer';
import { AdAnalytics, Constants, ConvivaMetadata, VideoAnalytics } from '@convivainc/conviva-js-coresdk';
import { calculateCurrentAdBreakInfo, collectAdMetadata } from '../../utils/Utils';
import { PlayerEventType } from "react-native-theoplayer";

export class CsaiAdReporter {
  private readonly player: THEOplayer;
  private readonly convivaVideoAnalytics: VideoAnalytics;
  private readonly convivaAdAnalytics: AdAnalytics;
  private readonly metadata: ConvivaMetadata;

  private currentAdBreak: AdBreak | undefined;

  constructor(
    player: THEOplayer,
    videoAnalytics: VideoAnalytics,
    adAnalytics: AdAnalytics,
    metadata: ConvivaMetadata
  ) {
    this.player = player;
    this.convivaVideoAnalytics = videoAnalytics;
    this.convivaAdAnalytics = adAnalytics;
    this.metadata = metadata;
    this.addEventListeners();
  }

  private readonly onAdBreakBegin = (event: any) => {
    this.currentAdBreak = event.ad as AdBreak;
    this.convivaVideoAnalytics.reportAdBreakStarted(
      Constants.AdType.CLIENT_SIDE,
      Constants.AdPlayer.CONTENT,
      calculateCurrentAdBreakInfo(this.currentAdBreak)
    );
  };

  private readonly onAdBreakEnd = () => {
    this.convivaVideoAnalytics.reportAdBreakEnded();
    this.currentAdBreak = undefined;
  };

  private readonly onAdBegin = (event: any) => {
    const currentAd = event.ad as Ad;
    if (currentAd.type !== 'linear') {
      return;
    }
    const adMetadata = collectAdMetadata(currentAd, this.metadata);
    this.convivaAdAnalytics.setAdInfo(adMetadata);
    this.convivaAdAnalytics.reportAdLoaded(adMetadata);
    this.convivaAdAnalytics.reportAdStarted(adMetadata);
    this.convivaAdAnalytics.reportAdMetric(
      Constants.Playback.RESOLUTION,
      // TODO
      // this.player.videoWidth,
      0,
      // TODO
      // this.player.videoHeight
      0
    );
    this.convivaAdAnalytics.reportAdMetric(Constants.Playback.BITRATE, (currentAd as GoogleImaAd).bitrate || 0);
  };

  private readonly onAdEnd = (event: any) => {
    const currentAd = event.ad as Ad;
    if (currentAd.type !== 'linear') {
      return;
    }
    this.convivaAdAnalytics.reportAdEnded();
  };

  private readonly onAdSkip = () => {
    if (!this.currentAdBreak) {
      return;
    }
    this.convivaAdAnalytics.reportAdMetric(Constants.Playback.PLAYER_STATE, Constants.PlayerState.STOPPED);
  };

  private readonly onAdBuffering = () => {
    if (!this.currentAdBreak) {
      return;
    }
    this.convivaAdAnalytics.reportAdMetric(Constants.Playback.PLAYER_STATE, Constants.PlayerState.BUFFERING);
  };

  private readonly onAdError = (event: any) => {
    this.convivaAdAnalytics.reportAdFailed(event.message || 'Ad Request Failed');
  };

  private readonly onPlay = () => {
    if (!this.currentAdBreak) {
      return;
    }
    this.convivaAdAnalytics.reportAdMetric(Constants.Playback.PLAYER_STATE, Constants.PlayerState.PLAYING);
  };


  private readonly onPlaying = () => {
    if (!this.currentAdBreak) {
      return;
    }
    this.convivaAdAnalytics.reportAdMetric(Constants.Playback.PLAYER_STATE, Constants.PlayerState.PLAYING);
  };

  private readonly onPause = () => {
    if (!this.currentAdBreak) {
      return;
    }
    this.convivaAdAnalytics.reportAdMetric(Constants.Playback.PLAYER_STATE, Constants.PlayerState.PAUSED);
  };

  private readonly onAdEvent = (event: AdEvent) => {
    if (!this.currentAdBreak) {
      return;
    }
    switch (event.subType) {
      case 'adbreakbegin':
        this.onAdBreakBegin(event);
        break;
      case 'adbreakend':
        this.onAdBreakEnd();
        break;
      case 'adbegin':
        this.onAdBegin(event)
        break;
      case 'adend':
        this.onAdEnd(event);
        break;
      case 'adskip':
        this.onAdSkip();
        break;
      case 'adbuffering':
        this.onAdBuffering();
        break;
      case 'aderror':
        this.onAdError(event);
        break;
    }
  };

  private addEventListeners(): void {
    this.player.addEventListener(PlayerEventType.PLAY, this.onPlay);
    this.player.addEventListener(PlayerEventType.PLAYING, this.onPlaying);
    this.player.addEventListener(PlayerEventType.PAUSE, this.onPause);
    if (this.player.ads === undefined) {
      // should not happen
      return;
    }
    this.player.addEventListener(PlayerEventType.AD_EVENT, this.onAdEvent);
  }

  private removeEventListeners(): void {
    this.player.removeEventListener(PlayerEventType.PLAY, this.onPlay);
    this.player.removeEventListener(PlayerEventType.PLAYING, this.onPlaying);
    this.player.removeEventListener(PlayerEventType.PAUSE, this.onPause);
    this.player.removeEventListener(PlayerEventType.AD_EVENT, this.onAdEvent);
  }

  destroy(): void {
    this.removeEventListeners();
  }
}
