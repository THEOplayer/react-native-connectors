import {
  AdobeCustomMetadataDetails,
  AdobeErrorDetails,
  AdobeIdentityMap,
  AdobeMediaDetails,
  AdobeQoeDataDetails,
  AdobeSessionDetails,
  ContentType,
  ErrorSource,
} from '@theoplayer/react-native-analytics-adobe-edge';
import type { AdobePlayerStateData } from '../../api/details/AdobePlayerStateData';
import {
  calculateAdvertisingDetails,
  calculateAdvertisingPodDetails,
  calculateChapterDetails,
  isValidDuration,
  sanitiseConfig,
  sanitiseContentLength,
  sanitisePlayhead,
} from './Utils';
import { createInstance } from '@adobe/alloy';
import { AdobeEdgeWebConfig } from '../../api/AdobeEdgeWebConfig';
import {
  type TextTrackCue,
  TextTrack,
  type ChromelessPlayer,
  AdEvent,
  ErrorEvent,
  AddTrackEvent,
  TextTrackEnterCueEvent,
  RemoveTrackEvent,
  MediaTrack,
  QualityEvent,
  AdBreakEvent,
} from 'theoplayer';
import { EventType } from './EventType';

const TAG = 'AdobeConnector';

// eslint-disable-next-line @typescript-eslint/ban-types
type AlloyClient = Function;

/**
 * Alloy globally stores clients by name. We are allowed create clients with the same config only once.
 */
interface ClientDescription {
  datastreamId: string;
  orgId: string;
  client: AlloyClient;
}
const createdClients: ClientDescription[] = [];

/**
 * The MediaEdgeAPI class is responsible for communicating media events to Adobe Experience Platform.
 *
 * Event handling for manually-tracked sessions is used. In this mode you need to pass the sessionID to the media event,
 * along with the playhead value (integer value). You could also pass the Quality of Experience data details, if needed.
 *
 * {@link https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/js-overview}
 * {@link https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/configure/streamingmedia}
 */
export class AdobeEdgeHandler {
  private _player: ChromelessPlayer;
  private _sessionId: string | undefined;
  private _hasSessionFailed: boolean;

  /** Whether we are in a current session or not */
  private _sessionInProgress = false;
  private _adBreakPodIndex = 0;
  private _adPodPosition = 1;
  private _customMetadata: AdobeCustomMetadataDetails[] = [];
  private _customIdentityMap: AdobeIdentityMap | undefined;
  private _currentChapter: TextTrackCue | undefined;
  private _eventQueue: (() => Promise<void>)[] = [];
  private _debug = false;
  private readonly _alloyClient: AlloyClient;

  constructor(player: ChromelessPlayer, config: AdobeEdgeWebConfig, customIdentityMap?: AdobeIdentityMap) {
    this._player = player;
    this._hasSessionFailed = false;
    this._customIdentityMap = customIdentityMap;
    const sanitisedConfig = sanitiseConfig(config);
    const { datastreamId, orgId, debugEnabled } = sanitisedConfig;

    this.addEventListeners();

    this._alloyClient = findAlloyClient(datastreamId, orgId);
    if (!this._alloyClient) {
      this._alloyClient = createInstance({
        name: 'alloy',
        monitors: [
          {
            // Optionally configure callbacks.
            // onInstanceConfigured: function (data: any) {},
          },
        ],
      });
      this._alloyClient('configure', sanitisedConfig);

      // Store created client to prevent creating duplicates.
      createdClients.push({ datastreamId, orgId, client: this._alloyClient });
    }
    this.setDebug(debugEnabled);
  }

  async stopAndStartNewSession(metadata?: AdobeCustomMetadataDetails[]): Promise<void> {
    await this.maybeEndSession();
    if (metadata !== undefined) {
      this.updateMetadata(metadata);
    }
    await this.maybeStartSession();

    if (this._player.paused) {
      this.onPause();
    } else {
      this.onPlaying();
    }
  }

  updateMetadata(metadata: AdobeCustomMetadataDetails[]): void {
    this._customMetadata = [...this._customMetadata, ...metadata];
  }

  setCustomIdentityMap(customIdentityMap: AdobeIdentityMap): void {
    this._customIdentityMap = customIdentityMap;
  }

  private addEventListeners(): void {
    this._player.addEventListener('playing', this.onPlaying);
    this._player.addEventListener('pause', this.onPause);
    this._player.addEventListener('ended', this.onEnded);
    this._player.addEventListener('waiting', this.onWaiting);
    this._player.addEventListener('sourcechange', this.onSourceChange);
    this._player.textTracks.addEventListener('addtrack', this.onAddTextTrack);
    this._player.textTracks.addEventListener('removetrack', this.onRemoveTextTrack);
    this._player.videoTracks.addEventListener('addtrack', this.onAddVideoTrack);
    this._player.videoTracks.addEventListener('removetrack', this.onRemoveVideoTrack);
    this._player.addEventListener('loadedmetadata', this.onLoadedMetadata);
    this._player.addEventListener('error', this.onError);
    this._player.ads?.addEventListener('adbreakbegin', this.onAdBreakBegin);
    this._player.ads?.addEventListener('adbegin', this.onAdBegin);
    this._player.ads?.addEventListener('adend', this.onAdEnd);
    this._player.ads?.addEventListener('adskip', this.onAdSkip);
    this._player.ads?.addEventListener('adbreakend', this.onAdBreakEnd);
    window.addEventListener('beforeunload', this.onBeforeUnload);
  }

  private removeEventListeners(): void {
    this._player.removeEventListener('playing', this.onPlaying);
    this._player.removeEventListener('pause', this.onPause);
    this._player.removeEventListener('ended', this.onEnded);
    this._player.removeEventListener('waiting', this.onWaiting);
    this._player.removeEventListener('sourcechange', this.onSourceChange);
    this._player.textTracks.removeEventListener('addtrack', this.onAddTextTrack);
    this._player.textTracks.removeEventListener('removetrack', this.onRemoveTextTrack);
    this._player.videoTracks.removeEventListener('addtrack', this.onAddVideoTrack);
    this._player.videoTracks.removeEventListener('removetrack', this.onRemoveVideoTrack);
    this._player.removeEventListener('loadedmetadata', this.onLoadedMetadata);
    this._player.removeEventListener('error', this.onError);
    this._player.ads?.removeEventListener('adbreakbegin', this.onAdBreakBegin);
    this._player.ads?.removeEventListener('adbegin', this.onAdBegin);
    this._player.ads?.removeEventListener('adend', this.onAdEnd);
    this._player.ads?.removeEventListener('adskip', this.onAdSkip);
    this._player.ads?.removeEventListener('adbreakend', this.onAdBreakEnd);
    window.removeEventListener('beforeunload', this.onBeforeUnload);
  }

  private onLoadedMetadata = () => {
    this.logDebug('onLoadedMetadata');

    // NOTE: In case of a pre-roll ad:
    // - on Android & iOS, the onLoadedMetadata is sent *after* a pre-roll has finished;
    // - on Web, onLoadedMetadata is sent twice, once before the pre-roll, where player.duration is still NaN,
    //   and again after the pre-roll with a correct duration.
    void this.maybeStartSession(this._player.duration);
  };

  private onPlaying = () => {
    this.logDebug('onPlaying');
    void this.queueOrSendEvent(EventType.play, { playhead: this._player.currentTime });
  };

  private onPause = () => {
    this.logDebug('onPause');
    void this.queueOrSendEvent(EventType.pauseStart, { playhead: this._player.currentTime });
  };

  private onWaiting = () => {
    this.logDebug('onWaiting');
    void this.queueOrSendEvent(EventType.bufferStart, { playhead: this._player.currentTime });
  };

  private onEnded = async () => {
    this.logDebug('onEnded');
    void this.queueOrSendEvent(EventType.sessionComplete, { playhead: this._player.currentTime });
    this.reset();
  };

  private onSourceChange = () => {
    this.logDebug('onSourceChange');
    void this.maybeEndSession();
  };

  private onAddVideoTrack = (event: AddTrackEvent) => {
    (event.track as MediaTrack).addEventListener('activequalitychanged', this.onActiveQualityChanged);
  };

  private onRemoveVideoTrack = (event: RemoveTrackEvent) => {
    (event.track as MediaTrack).removeEventListener('activequalitychanged', this.onActiveQualityChanged);
  };

  private onActiveQualityChanged = (event: QualityEvent<'activequalitychanged'>) => {
    void this.queueOrSendEvent(EventType.bitrateChange, {
      playhead: this._player.currentTime,
      qoeDataDetails: {
        bitrate: event.quality?.bandwidth ?? 0,
      },
    });
  };

  private onAddTextTrack = (event: AddTrackEvent) => {
    const track = event.track as TextTrack;
    if (track.kind === 'chapters') {
      track.addEventListener('entercue', this.onEnterCue);
      track.addEventListener('exitcue', this.onExitCue);
    }
  };

  private onRemoveTextTrack = (event: RemoveTrackEvent) => {
    const track = event.track as TextTrack;
    if (track.kind === 'chapters') {
      track.removeEventListener('entercue', this.onEnterCue);
      track.removeEventListener('exitcue', this.onExitCue);
    }
  };

  private onEnterCue = (event: TextTrackEnterCueEvent) => {
    const chapterCue = event.cue;
    if (this._currentChapter && this._currentChapter.endTime !== chapterCue.startTime) {
      void this.queueOrSendEvent(EventType.chapterSkip, { playhead: this._player.currentTime });
    }
    void this.queueOrSendEvent(EventType.chapterStart, {
      playhead: this._player.currentTime,
      chapterDetails: calculateChapterDetails(chapterCue),
      customMetadata: this._customMetadata,
    });
    this._currentChapter = chapterCue;
  };

  private onExitCue = () => {
    void this.queueOrSendEvent(EventType.chapterComplete, { playhead: this._player.currentTime });
  };

  private onError = (error: ErrorEvent) => {
    void this.setError({
      name: error.errorObject.name,
      source: ErrorSource.PLAYER,
    });
  };

  private onAdBreakBegin = (event: AdBreakEvent<'adbreakbegin'>) => {
    const podDetails = calculateAdvertisingPodDetails(event.adBreak, this._adBreakPodIndex);
    void this.queueOrSendEvent(EventType.adBreakStart, {
      playhead: this._player.currentTime,
      advertisingPodDetails: podDetails,
    });
    if (podDetails.index > this._adBreakPodIndex) {
      this._adBreakPodIndex++;
    }
  };

  private onAdBegin = (event: AdEvent<'adbegin'>) => {
    void this.queueOrSendEvent(EventType.adStart, {
      playhead: this._player.currentTime,
      advertisingDetails: calculateAdvertisingDetails(event.ad, this._adPodPosition),
      customMetadata: this._customMetadata,
    });
    this._adPodPosition++;
  };

  private onAdEnd = () => {
    void this.queueOrSendEvent(EventType.adComplete, { playhead: this._player.currentTime });
  };

  private onAdSkip = () => {
    void this.queueOrSendEvent(EventType.adSkip, { playhead: this._player.currentTime });
  };

  private onAdBreakEnd = () => {
    this._adPodPosition = 1;
    void this.queueOrSendEvent(EventType.adBreakComplete, { playhead: this._player.currentTime });
  };

  private onBeforeUnload = () => {
    void this.maybeEndSession();
  };

  private async maybeEndSession(): Promise<void> {
    this.logDebug(`maybeEndSession`);
    if (this.hasSessionStarted()) {
      await this.queueOrSendEvent(EventType.sessionEnd, { playhead: this._player.currentTime });
      this._sessionId = undefined;
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
   * @param mediaLengthSec
   * @private
   */
  private async maybeStartSession(mediaLengthSec?: number): Promise<void> {
    const mediaLength = this.getContentLength(mediaLengthSec);
    const hasValidSource = this._player.source !== undefined;
    const hasValidDuration = isValidDuration(mediaLength);
    const isPlayingAd = this._player.ads?.playing ?? false;

    this.logDebug(
      `maybeStartSession -`,
      `mediaLength: ${mediaLength},`,
      `hasValidSource: ${hasValidSource},`,
      `hasValidDuration: ${hasValidDuration},`,
      `isPlayingAd: ${isPlayingAd}`,
    );

    if (this._sessionInProgress || !hasValidSource || !hasValidDuration || isPlayingAd) {
      this.logDebug('maybeStartSession - NOT started');
      return;
    }

    const sessionDetails = {
      ID: 'N/A',
      name: this._player?.source?.metadata?.title ?? 'N/A',
      channel: 'N/A',
      contentType: this.getContentType(),
      playerName: 'THEOplayer',
      length: mediaLength,
    };

    await this.startSession(sessionDetails, this._customMetadata);
    if (!this.hasSessionStarted()) {
      return;
    }

    this._sessionInProgress = true;
    this.logDebug('maybeStartSession - STARTED', `sessionId: ${this.sessionId}`);
  }

  private getContentLength(mediaLengthSec?: number): number {
    return sanitiseContentLength(mediaLengthSec !== undefined ? mediaLengthSec : this._player.duration);
  }

  private getContentType(): ContentType {
    return this._player.duration === Infinity ? ContentType.LIVE : ContentType.VOD;
  }

  reset(): void {
    this.logDebug('reset');
    this._adBreakPodIndex = 0;
    this._adPodPosition = 1;
    this._sessionInProgress = false;
    this._currentChapter = undefined;
    this._sessionId = undefined;
    this._hasSessionFailed = false;
    this._eventQueue = [];
  }

  async destroy(): Promise<void> {
    await this.maybeEndSession();
    this.removeEventListeners();
  }

  setDebug(debug: boolean) {
    this._debug = debug;
    this._alloyClient('setDebug', { enabled: debug });
  }

  get sessionId(): string | undefined {
    return this._sessionId;
  }

  hasSessionStarted(): boolean {
    return this._sessionId !== undefined;
  }

  hasSessionFailed(): boolean {
    return this._hasSessionFailed;
  }

  async setError(errorDetails: AdobeErrorDetails, qoeDataDetails?: AdobeQoeDataDetails) {
    return this.queueOrSendEvent(EventType.error, { playhead: this._player.currentTime, qoeDataDetails, errorDetails });
  }

  async statesUpdate(
    playhead: number | undefined,
    statesStart?: AdobePlayerStateData[],
    statesEnd?: AdobePlayerStateData[],
    qoeDataDetails?: AdobeQoeDataDetails,
  ) {
    return this.queueOrSendEvent(EventType.statesUpdate, {
      playhead,
      qoeDataDetails,
      statesStart,
      statesEnd,
    });
  }

  /**
   * Start a manually-tracked media sessions.
   *
   * {@link https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/createmediasession}
   */
  async startSession(sessionDetails: AdobeSessionDetails, customMetadata?: AdobeCustomMetadataDetails[], qoeDataDetails?: AdobeQoeDataDetails) {
    try {
      const result = await this._alloyClient('createMediaSession', {
        xdm: {
          eventType: EventType.sessionStart,
          timestamp: new Date().toISOString(),
          mediaCollection: {
            playhead: 0,
            sessionDetails,
            qoeDataDetails,
            customMetadata,
          },
          identityMap: this._customIdentityMap,
        },
      });

      this._sessionId = result.sessionId;

      // empty queue
      if (this._sessionId && this._eventQueue.length !== 0) {
        this._eventQueue.forEach((doPostEvent) => doPostEvent());
        this._eventQueue = [];
      }
    } catch (e) {
      console.error(TAG, `Failed to start session. ${JSON.stringify(e)}`);
      this._hasSessionFailed = true;
    }
  }

  async queueOrSendEvent(eventType: EventType, mediaDetails: AdobeMediaDetails) {
    // Do not bother queueing the event in case starting the session has failed
    if (this.hasSessionFailed()) {
      return;
    }
    const doPostEvent = () => {
      return this.sendMediaEvent(eventType, mediaDetails);
    };

    // If the session has already started, do not queue but send it directly.
    if (!this.hasSessionStarted()) {
      this._eventQueue.push(doPostEvent);
    } else {
      return doPostEvent();
    }
  }

  /**
   * Use the sendMediaEvent command to track media playbacks, pauses, completions, player state updates, and other
   * related events.
   * {@link https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/sendmediaevent}
   */
  private async sendMediaEvent(eventType: EventType, mediaDetails: AdobeMediaDetails) {
    // Make sure we are positing data with a valid sessionID.
    if (!this._sessionId) {
      console.error(TAG, 'Invalid sessionID');
      return;
    }

    try {
      this._alloyClient('sendMediaEvent', {
        xdm: {
          eventType,
          mediaCollection: {
            ...mediaDetails,
            playhead: sanitisePlayhead(mediaDetails.playhead),
            sessionID: this._sessionId,
          },
          identityMap: this._customIdentityMap,
        },
      });
    } catch (e) {
      console.error(TAG, `Failed to send event: ${JSON.stringify(e)}`);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private logDebug(message?: any, ...optionalParams: any[]) {
    if (this._debug) {
      console.debug(TAG, message, ...optionalParams);
    }
  }
}

function findAlloyClient(datastreamId: string, orgId: string): AlloyClient | undefined {
  return createdClients.find((client) => client.datastreamId === datastreamId && client.orgId === orgId)?.client;
}
