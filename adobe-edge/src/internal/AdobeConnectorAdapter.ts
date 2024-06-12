import type {
  Ad,
  AdBreak,
  AdEvent,
  ErrorEvent,
  LoadedMetadataEvent,
  MediaTrackEvent,
  TextTrackCue,
  TextTrackEvent,
  THEOplayer,
} from 'react-native-theoplayer';
import { AdEventType, MediaTrackEventType, PlayerEventType, TextTrackEventType } from 'react-native-theoplayer';
import {
  calculateAdvertisingPodDetails,
  calculateAdvertisingDetails,
  calculateChapterDetails,
  sanitiseContentLength
} from '../utils/Utils';
import { Platform } from 'react-native';
import { MediaEdgeAPI } from './media-edge/MediaEdgeAPI';
import type { AdobeCustomMetadataDetails, AdobeErrorDetails } from '@theoplayer/react-native-analytics-adobe-edge';
import { ContentType } from '../api/details/AdobeSessionDetails';
import { ErrorSource } from '../api/details/AdobeErrorDetails';

const TAG = 'AdobeConnector';
const CONTENT_PING_INTERVAL = 10000;
const AD_PING_INTERVAL = 1000;

export class AdobeConnectorAdapter {
  private player: THEOplayer;

  /** Timer handling the ping event request */
  private pingInterval: ReturnType<typeof setInterval> | undefined;

  /** Whether we are in a current session or not */
  private sessionInProgress = false;

  private adBreakPodIndex = 0;

  private adPodPosition = 1;

  private isPlayingAd = false;

  private customMetadata: AdobeCustomMetadataDetails[] = [];

  private currentChapter: TextTrackCue | undefined;

  private debug = false;

  private mediaApi: MediaEdgeAPI;

  constructor(player: THEOplayer,
              baseUrl: string,
              configId: string,
              userAgent?: string,
              debug = false,
              debugSessionId: string | undefined = undefined) {
    this.player = player;
    this.mediaApi = new MediaEdgeAPI(baseUrl, configId, userAgent, debugSessionId);
    this.debug = debug;
    this.addEventListeners();
    this.logDebug('Initialized connector');
  }

  setDebug(debug: boolean) {
    this.debug = debug;
  }

  setDebugSessionId(id: string | undefined) {
    this.mediaApi.setDebugSessionId(id);
  }

  updateMetadata(metadata: AdobeCustomMetadataDetails[]): void {
    this.customMetadata = [...this.customMetadata, ...metadata];
  }

  setError(errorDetails: AdobeErrorDetails): void {
    void this.mediaApi.error(this.player.currentTime, errorDetails);
  }

  async stopAndStartNewSession(metadata?: AdobeCustomMetadataDetails[]): Promise<void> {
    await this.maybeEndSession();
    if (metadata !== undefined) {
      this.updateMetadata(metadata);
    }
    await this.maybeStartSession();

    if (this.player.paused) {
      this.onPause();
    } else {
      this.onPlaying();
    }
  }

  private addEventListeners(): void {
    this.player.addEventListener(PlayerEventType.PLAYING, this.onPlaying);
    this.player.addEventListener(PlayerEventType.PAUSE, this.onPause);
    this.player.addEventListener(PlayerEventType.ENDED, this.onEnded);
    this.player.addEventListener(PlayerEventType.WAITING, this.onWaiting);
    this.player.addEventListener(PlayerEventType.SOURCE_CHANGE, this.onSourceChange);
    this.player.addEventListener(PlayerEventType.TEXT_TRACK, this.onTextTrackEvent);
    this.player.addEventListener(PlayerEventType.MEDIA_TRACK, this.onMediaTrackEvent);
    this.player.addEventListener(PlayerEventType.LOADED_METADATA, this.onLoadedMetadata);
    this.player.addEventListener(PlayerEventType.ERROR, this.onError);

    this.player.addEventListener(PlayerEventType.AD_EVENT, this.onAdEvent);

    if (Platform.OS === 'web') {
      window.addEventListener('beforeunload', this.onBeforeUnload);
    }
  }

  private removeEventListeners(): void {
    this.player.removeEventListener(PlayerEventType.PLAYING, this.onPlaying);
    this.player.removeEventListener(PlayerEventType.PAUSE, this.onPause);
    this.player.removeEventListener(PlayerEventType.ENDED, this.onEnded);
    this.player.removeEventListener(PlayerEventType.WAITING, this.onWaiting);
    this.player.removeEventListener(PlayerEventType.SOURCE_CHANGE, this.onSourceChange);
    this.player.removeEventListener(PlayerEventType.TEXT_TRACK, this.onTextTrackEvent);
    this.player.removeEventListener(PlayerEventType.MEDIA_TRACK, this.onMediaTrackEvent);
    this.player.removeEventListener(PlayerEventType.LOADED_METADATA, this.onLoadedMetadata);
    this.player.removeEventListener(PlayerEventType.ERROR, this.onError);

    this.player.removeEventListener(PlayerEventType.AD_EVENT, this.onAdEvent);

    if (Platform.OS === 'web') {
      window.removeEventListener('beforeunload', this.onBeforeUnload);
    }
  }

  private onLoadedMetadata = (e: LoadedMetadataEvent) => {
    this.logDebug('onLoadedMetadata');

    // NOTE: In case of a pre-roll ad:
    // - on Android & iOS, the onLoadedMetadata is sent *after* a pre-roll has finished;
    // - on Web, onLoadedMetadata is sent twice, once before the pre-roll, where player.duration is still NaN,
    //   and again after the pre-roll with a correct duration.
    void this.maybeStartSession(e.duration);
  };

  private onPlaying = () => {
    this.logDebug('onPlaying');
    void this.mediaApi.play(this.player.currentTime);
  };

  private onPause = () => {
    this.logDebug('onPause');
    void this.mediaApi.pause(this.player.currentTime);
  };

  private onWaiting = () => {
    this.logDebug('onWaiting');
    void this.mediaApi.bufferStart(this.player.currentTime);
  };

  private onEnded = async () => {
    this.logDebug('onEnded');
    await this.mediaApi.sessionComplete(this.player.currentTime);
    this.reset();
  };

  private onSourceChange = () => {
    this.logDebug('onSourceChange');
    void this.maybeEndSession();
  };

  private onMediaTrackEvent = (event: MediaTrackEvent) => {
    if (event.subType === MediaTrackEventType.ACTIVE_QUALITY_CHANGED) {
      const quality = Array.isArray(event.qualities) ? event.qualities[0] : event.qualities;
      void this.mediaApi.bitrateChange(this.player.currentTime, {
        bitrate: quality?.bandwidth ?? 0,
      });
    }
  };

  private onTextTrackEvent = (event: TextTrackEvent) => {
    const track = this.player.textTracks.find((track) => track.uid === event.trackUid);
    if (track !== undefined && track.kind === 'chapters') {
      switch (event.subType) {
        case TextTrackEventType.ENTER_CUE: {
          const chapterCue = event.cue;
          if (this.currentChapter && this.currentChapter.endTime !== chapterCue.startTime) {
            this.mediaApi.chapterSkip(this.player.currentTime);
          }
          const chapterDetails = calculateChapterDetails(chapterCue);
          this.mediaApi.chapterStart(this.player.currentTime, chapterDetails, this.customMetadata);
          this.currentChapter = chapterCue;
          break;
        }
        case TextTrackEventType.EXIT_CUE: {
          this.mediaApi.chapterComplete(this.player.currentTime);
          break;
        }
      }
    }
  };

  private onError = (error: ErrorEvent) => {
    void this.mediaApi.error(this.player.currentTime, {
      name: error.error.errorCode,
      source: ErrorSource.PLAYER,
    });
  };

  private onAdEvent = (event: AdEvent) => {
    switch (event.subType) {
      case AdEventType.AD_BREAK_BEGIN: {
        this.isPlayingAd = true;
        this.startPinger(AD_PING_INTERVAL);
        const adBreak = event.ad as AdBreak;
        const podDetails = calculateAdvertisingPodDetails(adBreak, this.adBreakPodIndex);
        void this.mediaApi.adBreakStart(this.player.currentTime, podDetails);
        if (podDetails.index > this.adBreakPodIndex) {
          this.adBreakPodIndex++;
        }
        break;
      }
      case AdEventType.AD_BREAK_END: {
        this.isPlayingAd = false;
        this.adPodPosition = 1;
        this.startPinger(CONTENT_PING_INTERVAL);
        void this.mediaApi.adBreakComplete(this.player.currentTime);
        break;
      }
      case AdEventType.AD_BEGIN: {
        const ad = event.ad as Ad;
        const adDetails = calculateAdvertisingDetails(ad, this.adPodPosition);
        void this.mediaApi.adStart(this.player.currentTime, adDetails, this.customMetadata);
        this.adPodPosition++;
        break;
      }
      case AdEventType.AD_END: {
        void this.mediaApi.adComplete(this.player.currentTime);
        break;
      }
      case AdEventType.AD_SKIP: {
        void this.mediaApi.adSkip(this.player.currentTime);
        break;
      }
    }
  };

  private onBeforeUnload = () => {
    void this.maybeEndSession();
  };

  private async maybeEndSession(): Promise<void> {
    this.logDebug(`maybeEndSession`);
    if (this.mediaApi.hasSessionStarted()) {
      await this.mediaApi.sessionEnd(this.player.currentTime);
    }
    this.reset();
    return Promise.resolve();
  }

  /**
   * Start a new session, but only if:
   * - no existing session has is in progress;
   * - the player has a valid source;
   * - no ad is playing, otherwise the ad's media duration will be picked up;
   * - the player's content media duration is known.
   *
   * @param mediaLengthMsec
   * @private
   */
  private async maybeStartSession(mediaLengthMsec?: number): Promise<void> {
    const mediaLength = this.getContentLength(mediaLengthMsec);
    const hasValidSource = this.player.source !== undefined;
    const hasValidDuration = isValidDuration(mediaLength);
    const isPlayingAd = await this.player.ads.playing();

    this.logDebug(
      `maybeStartSession -`,
      `mediaLength: ${mediaLength},`,
      `hasValidSource: ${hasValidSource},`,
      `hasValidDuration: ${hasValidDuration},`,
      `isPlayingAd: ${isPlayingAd}`,
    );

    if (this.sessionInProgress || !hasValidSource || !hasValidDuration || isPlayingAd) {
      this.logDebug('maybeStartSession - NOT started');
      return;
    }

    const sessionDetails = {
      ID: 'N/A',
      name: this.player?.source?.metadata?.title ?? 'N/A',
      channel: 'N/A',
      contentType: this.getContentType(),
      playerName: 'THEOplayer',
      length: mediaLength,
    };

    await this.mediaApi.startSession(sessionDetails, this.customMetadata);
    if (!this.mediaApi.hasSessionStarted()) {
      return;
    }

    this.sessionInProgress = true;
    this.logDebug('maybeStartSession - STARTED', `sessionId: ${this.mediaApi.sessionId}`);

    if (!this.isPlayingAd) {
      this.startPinger(CONTENT_PING_INTERVAL);
    } else {
      this.startPinger(AD_PING_INTERVAL);
    }
  }

  private startPinger(interval: number): void {
    if (this.pingInterval !== undefined) {
      clearInterval(this.pingInterval);
    }
    this.pingInterval = setInterval(() => {
      void this.mediaApi.ping(this.player.currentTime);
    }, interval);
  }

  private getContentLength(mediaLengthMsec?: number): number {
    return sanitiseContentLength(mediaLengthMsec !== undefined ? mediaLengthMsec : this.player.duration);
  }

  private getContentType(): ContentType {
    return this.player.duration === Infinity ? ContentType.LIVE : ContentType.VOD;
  }

  reset(): void {
    this.logDebug('reset');
    this.mediaApi.reset();
    this.adBreakPodIndex = 0;
    this.adPodPosition = 1;
    this.isPlayingAd = false;
    this.sessionInProgress = false;
    clearInterval(this.pingInterval);
    this.pingInterval = undefined;
    this.currentChapter = undefined;
  }

  async destroy(): Promise<void> {
    await this.maybeEndSession();
    this.removeEventListeners();
  }

  private logDebug(message?: any, ...optionalParams: any[]) {
    if (this.debug) {
      console.debug(TAG, message, ...optionalParams);
    }
  }
}

function isValidDuration(v: number | undefined): boolean {
  return v !== undefined && !Number.isNaN(v);
}
