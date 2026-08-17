/* eslint-disable @typescript-eslint/no-explicit-any */
import { AdobeIdentityMap, AdobeMetadata } from '@theoplayer/react-native-analytics-adobe-edge';
import { idToInt, isValidDuration, sanitiseChapterId, sanitiseConfig, sanitiseContentLength, sanitiseNumber, sanitisePlayhead } from './Utils';
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
  VideoQuality,
} from 'theoplayer';
import { EventType } from './EventType';
import AlloyClient, { Media, MediaTracker } from './Media';

const TAG = 'AdobeConnector';

const PROP_PLAYHEAD = 'playhead';
const PROP_ERROR_ID = 'errorId';
const PROP_NA = 'NA';

/**
 * Number of times a session start is attempted before giving up.
 */
const MAX_SESSION_START_ATTEMPTS = 3;

/**
 * Base delay between session start attempts. Doubles with every attempt.
 */
const SESSION_START_RETRY_DELAY_MS = 1000;

/**
 * Maximum number of events queued while waiting for a session start to be confirmed. The oldest events are dropped first.
 */
const MAX_EVENT_QUEUE_SIZE = 500;

/**
 * Alloy globally stores clients by name. We are allowed create clients with the same config only once.
 */
interface ClientDescription {
  datastreamId: string;
  orgId: string;
  client: AlloyClient;
}

type EventInfo = { [key: string]: any };
type EventMetadata = { [key: string]: string };

interface QueuedEvent {
  type: EventType;
  info: EventInfo;
  metadata: EventMetadata;
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
class AdobeEdgeHandler {
  private _player: ChromelessPlayer;

  /** Whether we are in a current session or not */
  private _sessionInProgress = false;

  /** Whether a session start request is in flight (including retries) */
  private _sessionStarting = false;

  /** Whether session start was abandoned after exhausting all retries; events are dropped until a new start is attempted */
  private _sessionStartAbandoned = false;

  /** Generation of the session whose playback ended while its start was still in flight; it is completed before it is ended */
  private _completeOnConfirmGeneration: number | undefined;

  /** Whether the handler was destroyed; no new sessions are started afterwards */
  private _destroyed = false;

  /** Incremented on every session start/reset, used to invalidate in-flight starts */
  private _sessionGeneration = 0;
  private _sessionStartRetryTimer: ReturnType<typeof setTimeout> | undefined;
  private _adBreakPodIndex = 0;
  private _adPodPosition = 1;
  private _customMetadata: EventMetadata = {};
  private _customIdentityMap: AdobeIdentityMap | undefined;
  private _currentChapter: TextTrackCue | undefined;
  private _eventQueue: QueuedEvent[] = [];
  private _debug = false;
  private readonly _alloyClient: AlloyClient | undefined;
  private _media: Media | undefined;

  /** Tracker of the session that is currently starting or in progress. Each session gets its own instance. */
  private _tracker: MediaTracker | undefined;

  /** Resolves once the events sent on the current tracker were dispatched, so it is not destroyed too early. */
  private _pendingEvents: Promise<unknown> = Promise.resolve();

  constructor(player: ChromelessPlayer, config: AdobeEdgeWebConfig, customIdentityMap?: AdobeIdentityMap) {
    this._player = player;
    this._customIdentityMap = customIdentityMap;
    const sanitisedConfig = sanitiseConfig(config);
    const { datastreamId, orgId, debugEnabled } = sanitisedConfig;

    this.addEventListeners();

    this._alloyClient = findAlloyClient(datastreamId, orgId);
    if (!this._alloyClient) {
      this._alloyClient = createInstance({
        name: 'alloy',
        /**
         * Optional event callbacks for debugging purposes.
         */
        monitors: [
          {
            // onBeforeLog: (arg0: any) => void;
            // onInstanceCreated: (arg0: any) => void;
            // onInstanceConfigured: (arg0: any) => void;
            // onBeforeCommand: (arg0: any) => void;
            // onCommandResolved: (arg0: any) => void;
            // onCommandRejected: (arg0: any) => void;
            // onBeforeNetworkRequest: (arg0: any) => void;
            // onNetworkResponse: (arg0: any) => void;
            // onNetworkError: (arg0: any) => void;
            // onContentHiding: (arg0: any) => void;
            // onContentRendering: (arg0: any) => void;
          },
        ],
      });
      this._alloyClient('configure', sanitisedConfig);

      // Store created client to prevent creating duplicates.
      createdClients.push({ datastreamId, orgId, client: this._alloyClient });
    }

    /**
     * Acquire Media Analytics APIs & tracker.
     * https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/getmediaanalyticstracker
     */
    this._alloyClient('getMediaAnalyticsTracker', {})
      .then((result: any) => {
        if (this._destroyed) {
          return;
        }
        this._media = result;

        // The player may have dispatched loadedmetadata before the tracker was ready.
        this.maybeStartSession();
      })
      .catch((error: unknown) => {
        this.logDebug('getMediaAnalyticsTracker failed', error);
      });

    this.setDebug(debugEnabled || false);
  }

  updateMetadata(metadata: AdobeMetadata) {
    this._customMetadata = { ...this._customMetadata, ...metadata };
  }

  setCustomIdentityMap(customIdentityMap: AdobeIdentityMap) {
    this._customIdentityMap = customIdentityMap;
  }

  setError(errorId: string) {
    this.queueOrSendEvent(EventType.error, { [PROP_ERROR_ID]: errorId });
  }

  stopAndStartNewSession(metadata?: AdobeMetadata) {
    this.maybeEndSession();
    if (metadata) {
      this.updateMetadata(metadata);
    }
    this.maybeStartSession();
    if (this._player.paused) {
      this.handlePause();
    } else {
      this.handlePlaying();
    }
  }

  private addEventListeners() {
    this._player.addEventListener('playing', this.handlePlaying);
    this._player.addEventListener('pause', this.handlePause);
    this._player.addEventListener('ended', this.handleEnded);
    this._player.addEventListener('waiting', this.handleWaiting);
    this._player.addEventListener('seeking', this.handleSeeking);
    this._player.addEventListener('seeked', this.handleSeeked);
    this._player.addEventListener('timeupdate', this.handleTimeUpdate);
    this._player.addEventListener('sourcechange', this.handleSourceChange);
    this._player.textTracks.addEventListener('addtrack', this.handleAddTextTrack);
    this._player.textTracks.addEventListener('removetrack', this.handleRemoveTextTrack);
    this._player.videoTracks.addEventListener('addtrack', this.handleAddVideoTrack);
    this._player.videoTracks.addEventListener('removetrack', this.handleRemoveVideoTrack);
    this._player.addEventListener('loadedmetadata', this.onLoadedMetadata);
    this._player.addEventListener('error', this.handleError);
    this._player.ads?.addEventListener('adbreakbegin', this.handleAdBreakBegin);
    this._player.ads?.addEventListener('adbreakend', this.handleAdBreakEnd);
    this._player.ads?.addEventListener('adbegin', this.handleAdBegin);
    this._player.ads?.addEventListener('adend', this.handleAdEnd);
    this._player.ads?.addEventListener('adskip', this.handleAdSkip);
    window.addEventListener('beforeunload', this.onBeforeUnload);
  }

  private removeEventListeners() {
    this._player.removeEventListener('playing', this.handlePlaying);
    this._player.removeEventListener('pause', this.handlePause);
    this._player.removeEventListener('ended', this.handleEnded);
    this._player.removeEventListener('waiting', this.handleWaiting);
    this._player.removeEventListener('seeking', this.handleSeeking);
    this._player.removeEventListener('seeked', this.handleSeeked);
    this._player.removeEventListener('timeupdate', this.handleTimeUpdate);
    this._player.removeEventListener('sourcechange', this.handleSourceChange);
    this._player.textTracks.removeEventListener('addtrack', this.handleAddTextTrack);
    this._player.textTracks.removeEventListener('removetrack', this.handleRemoveTextTrack);
    this._player.videoTracks.removeEventListener('addtrack', this.handleAddVideoTrack);
    this._player.videoTracks.removeEventListener('removetrack', this.handleRemoveVideoTrack);
    this._player.removeEventListener('loadedmetadata', this.onLoadedMetadata);
    this._player.removeEventListener('error', this.handleError);
    this._player.ads?.removeEventListener('adbreakbegin', this.handleAdBreakBegin);
    this._player.ads?.removeEventListener('adbreakend', this.handleAdBreakEnd);
    this._player.ads?.removeEventListener('adbegin', this.handleAdBegin);
    this._player.ads?.removeEventListener('adend', this.handleAdEnd);
    this._player.ads?.removeEventListener('adskip', this.handleAdSkip);
    window.removeEventListener('beforeunload', this.onBeforeUnload);
  }

  /**
   * Send an event on the given tracker, defaulting to the tracker of the current session.
   *
   * @returns a promise that resolves once the event was dispatched (or failed).
   */
  private sendEvent(
    eventType: EventType,
    info: EventInfo,
    metadata: EventMetadata,
    tracker: MediaTracker | undefined = this._tracker,
  ): Promise<unknown> {
    if (eventType === EventType.updatePlayhead) {
      tracker?.updatePlayhead(info[PROP_PLAYHEAD]);
      return Promise.resolve();
    }
    let result: Promise<any> | undefined;
    switch (eventType) {
      case EventType.error:
        result = tracker?.trackError(info[PROP_ERROR_ID] || PROP_NA);
        break;
      case EventType.sessionComplete:
        result = tracker?.trackComplete();
        break;
      case EventType.sessionEnd:
        result = tracker?.trackSessionEnd();
        break;
      case EventType.play:
        result = tracker?.trackPlay();
        break;
      case EventType.pauseStart:
        result = tracker?.trackPause();
        break;
      default:
        result = tracker?.trackEvent(eventType, info, metadata);
        break;
    }
    // Tracker methods return promises; catch rejections to avoid unhandled promise rejections.
    const dispatched = Promise.resolve(result).catch((error: unknown) => {
      this.logDebug(`sendEvent(${eventType}) failed`, error);
    });
    if (tracker === this._tracker) {
      this._pendingEvents = this._pendingEvents.then(() => dispatched);
    }
    return dispatched;
  }

  private queueOrSendEvent(type: EventType, info: EventInfo = {}, metadata: EventMetadata = {}) {
    const extendedInfo = { ...info, [PROP_PLAYHEAD]: sanitisePlayhead(this._player.currentTime, this._player.duration) };
    if (this._sessionInProgress) {
      this.sendEvent(type, extendedInfo, metadata);
    } else if (!this._sessionStartAbandoned) {
      if (this._eventQueue.length >= MAX_EVENT_QUEUE_SIZE) {
        this._eventQueue.shift();
      }
      this._eventQueue.push({ type, info: extendedInfo, metadata });
    }
  }

  private handlePlaying = () => {
    this.logDebug('onPlaying');
    this.queueOrSendEvent(EventType.play);
  };

  private handlePause = () => {
    this.logDebug('onPause');
    this.queueOrSendEvent(EventType.pauseStart);
  };

  private handleTimeUpdate = () => {
    this.queueOrSendEvent(EventType.updatePlayhead);
  };

  private handleWaiting = () => {
    this.logDebug('onWaiting');
    this.queueOrSendEvent(EventType.bufferStart);
  };

  private handleSeeking = () => {
    this.logDebug('onSeeking');
    this.queueOrSendEvent(EventType.seekStart);
  };

  private handleSeeked = () => {
    this.logDebug('onSeeked');
    this.queueOrSendEvent(EventType.seekEnd);
  };

  private handleEnded = () => {
    this.logDebug('onEnded');
    this.queueOrSendEvent(EventType.sessionComplete);
    // The session may still be starting, in which case the queued completion is dropped by reset().
    // Remember which session it was, so only that one is completed once the edge network confirms it.
    const completeOnConfirmGeneration = this._sessionStarting && !this._sessionInProgress ? this._sessionGeneration : undefined;
    this.reset();
    this._completeOnConfirmGeneration = completeOnConfirmGeneration;
  };

  private handleSourceChange = () => {
    this.logDebug('onSourceChange');
    this.maybeEndSession();
  };

  private handleQualityChanged = (event: QualityEvent<'activequalitychanged'>) => {
    const quality = event.quality as VideoQuality;
    void this.queueOrSendEvent(EventType.bitrateChange, {
      qoeDataDetails: this._media?.createQoEObject(sanitiseNumber(quality?.bandwidth), 0, sanitiseNumber(quality?.frameRate), 0),
    });
  };

  private handleAddTextTrack = (event: AddTrackEvent) => {
    const track = event.track as TextTrack;
    if (track.kind === 'chapters') {
      track.addEventListener('entercue', this.handleEnterCue);
      track.addEventListener('exitcue', this.handleExitCue);
    }
  };

  private handleRemoveTextTrack = (event: RemoveTrackEvent) => {
    const track = event.track as TextTrack;
    if (track.kind === 'chapters') {
      track.removeEventListener('entercue', this.handleEnterCue);
      track.removeEventListener('exitcue', this.handleExitCue);
    }
  };

  private handleAddVideoTrack = (event: AddTrackEvent) => {
    (event.track as MediaTrack).addEventListener('activequalitychanged', this.handleQualityChanged);
  };

  private handleRemoveVideoTrack = (event: RemoveTrackEvent) => {
    (event.track as MediaTrack).removeEventListener('activequalitychanged', this.handleQualityChanged);
  };

  private handleEnterCue = (event: TextTrackEnterCueEvent) => {
    const chapterCue = event.cue;
    if (this._currentChapter && this._currentChapter.endTime !== chapterCue.startTime) {
      this.queueOrSendEvent(EventType.chapterSkip);
    }
    this.queueOrSendEvent(
      EventType.chapterStart,
      this._media?.createChapterObject(
        sanitiseChapterId(chapterCue.id),
        idToInt(chapterCue.id, 1),
        Math.trunc(chapterCue.endTime),
        Math.trunc(chapterCue.endTime - chapterCue.startTime),
      ),
    );
    this._currentChapter = chapterCue;
  };

  private handleExitCue = () => {
    this.queueOrSendEvent(EventType.chapterComplete);
  };

  private handleError = (error: ErrorEvent) => {
    this.setError(error.errorObject.code.toString());
  };

  private handleAdBreakBegin = (event: AdBreakEvent<'adbreakbegin'>) => {
    this.logDebug('onAdBreakBegin');
    const currentAdBreakTimeOffset = event.adBreak.timeOffset;
    let position: number;
    // The pod position should start at 1.
    if (currentAdBreakTimeOffset <= 0) {
      position = 1;
    } else {
      position = this._adBreakPodIndex + 1;
    }
    this.queueOrSendEvent(EventType.adBreakStart, this._media?.createAdBreakObject(PROP_NA, position, currentAdBreakTimeOffset));
    if (position > this._adBreakPodIndex) {
      this._adBreakPodIndex++;
    }
  };

  private handleAdBreakEnd = () => {
    this.logDebug('onAdBreakEnd');
    this._adPodPosition = 1;
    this.queueOrSendEvent(EventType.adBreakComplete);
  };

  private handleAdBegin = (event: AdEvent<'adbegin'>) => {
    this.logDebug('onAdBegin');
    this.queueOrSendEvent(
      EventType.adStart,
      this._media?.createAdObject(PROP_NA, PROP_NA, this._adPodPosition, event.ad.duration ? Math.trunc(event.ad.duration) : 0),
    );
    this._adPodPosition++;
  };

  private handleAdEnd = () => {
    this.logDebug('onAdEnd');
    this.queueOrSendEvent(EventType.adComplete);
  };

  private handleAdSkip = () => {
    this.logDebug('onAdSkip');
    this.queueOrSendEvent(EventType.adSkip);
  };

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
  private maybeStartSession(mediaLengthSec?: number) {
    const mediaLength = this.getContentLength(mediaLengthSec);
    const hasValidSource = this._player.source !== undefined;
    const hasValidDuration = isValidDuration(mediaLength);
    const isPlayingAd = this._player.ads?.playing;

    this.logDebug(
      `maybeStartSession -`,
      `mediaLength: ${mediaLength},`,
      `hasValidSource: ${hasValidSource},`,
      `hasValidDuration: ${hasValidDuration},`,
      `isPlayingAd: ${isPlayingAd}`,
    );

    if (this._destroyed) {
      this.logDebug('maybeStartSession - NOT started: handler destroyed');
      return;
    }

    if (this._sessionInProgress || this._sessionStarting) {
      this.logDebug('maybeStartSession - NOT started: already in progress or starting');
      return;
    }

    if (isPlayingAd) {
      this.logDebug('maybeStartSession - NOT started: playing ad');
      return;
    }

    if (!hasValidSource || !hasValidDuration) {
      this.logDebug(`maybeStartSession - NOT started: invalid ${hasValidSource ? 'duration' : 'source'}`);
      return;
    }

    if (!this._media) {
      // The media APIs are acquired asynchronously; maybeStartSession is retried once they resolve.
      this.logDebug('maybeStartSession - NOT started: media tracker not yet available');
      return;
    }

    this.startSession(mediaLength, 0);
  }

  /**
   * Start a new media session on the edge network.
   *
   * The session is only marked as 'in progress' once the edge network confirms it
   * (i.e. the returned promise resolves with a sessionId). Until then, events keep
   * queueing. If the session start fails, it is retried a limited number of times.
   *
   * Every attempt uses its own tracker instance, so a session whose start is confirmed after it was
   * superseded can still be ended without touching the session that replaced it.
   */
  private startSession(mediaLength: number, attempt: number, sessionMetadata?: EventMetadata) {
    const media = this._media;
    if (!media) {
      return;
    }
    let tracker: MediaTracker;
    try {
      tracker = media.getInstance();
    } catch (error) {
      // Leave the handler untouched, so a later loadedmetadata can still start a session.
      this.logDebug('startSession - could not create a tracker', error);
      return;
    }
    this._tracker = tracker;
    this._pendingEvents = Promise.resolve();
    const generation = ++this._sessionGeneration;
    this._sessionStarting = true;
    this._sessionStartAbandoned = false;

    // Take a snapshot of the custom metadata on the first attempt, so retries report the same metadata.
    let customMetadata = sessionMetadata;
    if (customMetadata === undefined) {
      customMetadata = this._customMetadata;
      // Clear used custom metadata to avoid accidentally reusing it for the next session.
      this._customMetadata = {};
    }

    // Allow overriding metadata with custom metadata set via updateMetadata().
    const mergedMetadata = {
      ...this._player?.source?.metadata,
      ...customMetadata,
    };
    let sessionStartPromise: Promise<any> | undefined;
    try {
      sessionStartPromise = tracker.trackSessionStart(
        media.createMediaObject(
          mergedMetadata.friendlyName || mergedMetadata.title || PROP_NA,
          mergedMetadata.name || mergedMetadata.id || PROP_NA,
          mediaLength,
          this.getContentType(),
          media.MediaType.Video,
        ),
        customMetadata,
      );
    } catch (error) {
      // A synchronous failure must not leave the handler stuck in 'starting' forever.
      this.logDebug('startSession - failed', error);
      this.discardTracker(tracker);
      this.retryStartSession(generation, mediaLength, attempt, customMetadata);
      return;
    }

    Promise.resolve(sessionStartPromise)
      .then((result?: { sessionId?: string }) => {
        if (generation !== this._sessionGeneration) {
          // The session was ended or superseded while the start request was in flight. Close it on its
          // own tracker, so it is not left open on the edge network.
          let closed: Promise<unknown> = Promise.resolve();
          if (result?.sessionId) {
            if (this._completeOnConfirmGeneration === generation) {
              this._completeOnConfirmGeneration = undefined;
              closed = this.sendEvent(EventType.sessionComplete, {}, {}, tracker);
            }
            closed = closed.then(() => this.sendEvent(EventType.sessionEnd, {}, {}, tracker));
          }
          this.discardTracker(tracker, closed);
          return;
        }
        if (result?.sessionId) {
          this._sessionStarting = false;
          this._sessionInProgress = true;

          // Post any queued events now that the session has started.
          this._eventQueue.forEach((event) => this.sendEvent(event.type, event.info, event.metadata));
          this._eventQueue = [];

          this.logDebug('startSession - started');
        } else {
          this.logDebug('startSession - no sessionId in response');
          this.discardTracker(tracker);
          this.retryStartSession(generation, mediaLength, attempt, customMetadata);
        }
      })
      .catch((error: unknown) => {
        this.discardTracker(tracker);
        if (generation !== this._sessionGeneration) {
          return;
        }
        this.logDebug('startSession - failed', error);
        this.retryStartSession(generation, mediaLength, attempt, customMetadata);
      });
  }

  /**
   * Destroy a tracker instance that will not be used again, and forget it if it is still the current one.
   *
   * Destroying resets the tracker's internal state, which pending events still need to build their
   * payload, so it is postponed until those events were dispatched.
   */
  private discardTracker(tracker: MediaTracker, pendingEvents: Promise<unknown> = Promise.resolve()) {
    if (this._tracker === tracker) {
      this._tracker = undefined;
      this._pendingEvents = Promise.resolve();
    }
    pendingEvents.then(() => tracker.destroy()).catch(() => tracker.destroy());
  }

  private retryStartSession(generation: number, mediaLength: number, attempt: number, sessionMetadata: EventMetadata) {
    if (attempt + 1 < MAX_SESSION_START_ATTEMPTS) {
      const delay = SESSION_START_RETRY_DELAY_MS * 2 ** attempt;
      this.logDebug(`retryStartSession - retrying in ${delay}ms (attempt ${attempt + 2}/${MAX_SESSION_START_ATTEMPTS})`);
      this._sessionStartRetryTimer = setTimeout(() => {
        this._sessionStartRetryTimer = undefined;
        if (generation !== this._sessionGeneration) {
          return;
        }
        this.startSession(mediaLength, attempt + 1, sessionMetadata);
      }, delay);
    } else {
      // Give up: drop queued events and stay idle, so a later sourcechange or
      // stopAndStartNewSession can start a fresh session. Until then, events are
      // dropped instead of queued to avoid unbounded queue growth.
      this.logDebug('retryStartSession - giving up');
      this._sessionStarting = false;
      this._sessionStartAbandoned = true;
      this._eventQueue = [];
      // Restore the unused metadata snapshot so a later session start can still report it.
      this._customMetadata = { ...sessionMetadata, ...this._customMetadata };
    }
  }

  private onLoadedMetadata = () => {
    this.logDebug('onLoadedMetadata');

    // NOTE: In case of a pre-roll ad:
    // - on Android & iOS, the onLoadedMetadata is sent *after* a pre-roll has finished;
    // - on Web, onLoadedMetadata is sent twice, once before the pre-roll, where player.duration is still NaN,
    //   and again after the pre-roll with a correct duration.
    this.maybeStartSession(this._player.duration);
  };

  private onBeforeUnload = () => {
    this.maybeEndSession();
  };

  private maybeEndSession() {
    this.logDebug(`maybeEndSession`);
    if (this._sessionInProgress) {
      this.queueOrSendEvent(EventType.sessionEnd);
    }
    this.reset();
  }

  private getContentLength(mediaLengthSec?: number): number {
    return sanitiseContentLength(mediaLengthSec !== undefined ? mediaLengthSec : this._player.duration);
  }

  private getContentType(): string {
    return this._player.duration === Infinity ? 'Live' : 'VOD';
  }

  reset() {
    this.logDebug('reset');
    // Invalidate any in-flight session start and cancel pending retries.
    const wasStarting = this._sessionStarting;
    this._sessionGeneration++;
    this._sessionStarting = false;
    this._sessionStartAbandoned = false;
    this._completeOnConfirmGeneration = undefined;
    if (this._sessionStartRetryTimer) {
      clearTimeout(this._sessionStartRetryTimer);
      this._sessionStartRetryTimer = undefined;
    }
    if (this._tracker) {
      // A start that is still in flight owns its tracker: it needs it to end the session once confirmed.
      if (wasStarting) {
        this._tracker = undefined;
        this._pendingEvents = Promise.resolve();
      } else {
        this.discardTracker(this._tracker, this._pendingEvents);
      }
    }
    this._eventQueue = [];
    this._adBreakPodIndex = 0;
    this._adPodPosition = 1;
    this._sessionInProgress = false;
    this._currentChapter = undefined;
  }

  destroy() {
    this.maybeEndSession();
    this.removeEventListeners();
    this._destroyed = true;
  }

  setDebug(debug: boolean) {
    this._debug = debug;
    this._alloyClient?.('setDebug', { enabled: debug });
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

export { AdobeEdgeHandler };
