import type { paths } from './MediaEdge';
import type {
  AdobeAdvertisingDetails,
  AdobeAdvertisingPodDetails,
  AdobeChapterDetails,
  AdobeCustomMetadataDetails,
  AdobeErrorDetails,
  AdobeMediaDetails,
  AdobeQoeDataDetails,
  AdobeSessionDetails,
} from '@theoplayer/react-native-analytics-adobe-edge';
import { pathToEventTypeMap } from './PathToEventTypeMap';
import type { AdobePlayerStateData } from '../../api/details/AdobePlayerStateData';
import { sanitisePlayhead } from '../../utils/Utils';
import { createInstance } from '@adobe/alloy';

const TAG = 'AdobeEdge';

export class MediaEdgeAPI {
  // eslint-disable-next-line @typescript-eslint/ban-types
  private readonly _alloyClient: Function;

  private _debugSessionId: string | undefined;
  private _sessionId: string | undefined;
  private _hasSessionFailed: boolean;
  private _eventQueue: (() => Promise<void>)[] = [];

  constructor(edgeBasePath: string, datastreamId: string, orgId: string, debugEnabled?: boolean, debugSessionId?: string) {
    this._debugSessionId = debugSessionId;
    this._hasSessionFailed = false;
    this._alloyClient = createInstance({ name: 'alloy' });
    this._alloyClient('configure', {
      /**
       * The datastreamId property is a string that determines which datastream in Adobe Experience Platform you want
       * to send data to.
       * https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/configure/datastreamid
       */
      datastreamId,

      /**
       * The orgId property is a string that tells Adobe which organization that data is sent to. This property is
       * required for all data sent using the Web SDK.
       * https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/configure/orgid
       */
      orgId,

      /**
       * The edgeBasePath property alters the destination path when you interact with Adobe services.
       * https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/configure/edgebasepath
       */
      edgeBasePath,

      /**
       * The debugEnabled property allows you to enable or disable debugging using Web SDK code.
       * https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/configure/debugenabled
       */
      debugEnabled: debugEnabled ?? false,

      /**
       *
       * https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/configure/streamingmedia
       */
      streamingMedia: {
        channel: 'Video channel',
        playerName: 'THEOplayer',
      },
    });
  }

  setDebug(debug: boolean) {
    this._alloyClient('setDebug', { enabled: debug });
  }

  setDebugSessionId(id: string | undefined) {
    this._debugSessionId = id;
  }

  get sessionId(): string | undefined {
    return this._sessionId;
  }

  hasSessionStarted(): boolean {
    return !!this._sessionId;
  }

  hasSessionFailed(): boolean {
    return this._hasSessionFailed;
  }

  reset() {
    this._sessionId = undefined;
    this._hasSessionFailed = false;
    this._eventQueue = [];
  }

  async play(playhead: number | undefined, qoeDataDetails?: AdobeQoeDataDetails) {
    return this.maybeQueueEvent('/play', { playhead, qoeDataDetails });
  }

  async pause(playhead: number | undefined, qoeDataDetails?: AdobeQoeDataDetails) {
    return this.maybeQueueEvent('/pauseStart', { playhead, qoeDataDetails });
  }

  async error(playhead: number | undefined, errorDetails: AdobeErrorDetails, qoeDataDetails?: AdobeQoeDataDetails) {
    return this.maybeQueueEvent('/error', { playhead, qoeDataDetails, errorDetails });
  }

  async ping(playhead: number | undefined, qoeDataDetails?: AdobeQoeDataDetails) {
    // Only send pings if the session has started, never queue them.
    if (this.hasSessionStarted()) {
      void this.postEvent('/ping', { playhead, qoeDataDetails });
    }
  }

  async bufferStart(playhead: number | undefined, qoeDataDetails?: AdobeQoeDataDetails) {
    return this.maybeQueueEvent('/bufferStart', { playhead, qoeDataDetails });
  }

  async sessionComplete(playhead: number | undefined, qoeDataDetails?: AdobeQoeDataDetails) {
    return this.maybeQueueEvent('/sessionComplete', { playhead, qoeDataDetails });
  }

  async sessionEnd(playhead: number | undefined, qoeDataDetails?: AdobeQoeDataDetails) {
    await this.maybeQueueEvent('/sessionEnd', { playhead, qoeDataDetails });
    this._sessionId = undefined;
  }

  async statesUpdate(
    playhead: number | undefined,
    statesStart?: AdobePlayerStateData[],
    statesEnd?: AdobePlayerStateData[],
    qoeDataDetails?: AdobeQoeDataDetails,
  ) {
    return this.maybeQueueEvent('/statesUpdate', {
      playhead,
      qoeDataDetails,
      statesStart,
      statesEnd,
    });
  }

  async bitrateChange(playhead: number | undefined, qoeDataDetails: AdobeQoeDataDetails) {
    return this.maybeQueueEvent('/bitrateChange', { playhead, qoeDataDetails });
  }

  async chapterSkip(playhead: number | undefined, qoeDataDetails?: AdobeQoeDataDetails) {
    return this.maybeQueueEvent('/chapterSkip', { playhead, qoeDataDetails });
  }

  async chapterStart(
    playhead: number | undefined,
    chapterDetails: AdobeChapterDetails,
    customMetadata?: AdobeCustomMetadataDetails[],
    qoeDataDetails?: AdobeQoeDataDetails,
  ) {
    return this.maybeQueueEvent('/chapterStart', { playhead, chapterDetails, customMetadata, qoeDataDetails });
  }

  async chapterComplete(playhead: number | undefined, qoeDataDetails?: AdobeQoeDataDetails) {
    return this.maybeQueueEvent('/chapterComplete', { playhead, qoeDataDetails });
  }

  async adBreakStart(playhead: number, advertisingPodDetails: AdobeAdvertisingPodDetails, qoeDataDetails?: AdobeQoeDataDetails) {
    return this.maybeQueueEvent('/adBreakStart', {
      playhead,
      qoeDataDetails,
      advertisingPodDetails,
    });
  }

  async adBreakComplete(playhead: number | undefined, qoeDataDetails?: AdobeQoeDataDetails) {
    return this.maybeQueueEvent('/adBreakComplete', { playhead, qoeDataDetails });
  }

  async adStart(
    playhead: number,
    advertisingDetails: AdobeAdvertisingDetails,
    customMetadata?: AdobeCustomMetadataDetails[],
    qoeDataDetails?: AdobeQoeDataDetails,
  ) {
    return this.maybeQueueEvent('/adStart', {
      playhead,
      qoeDataDetails,
      advertisingDetails,
      customMetadata,
    });
  }

  async adSkip(playhead: number | undefined, qoeDataDetails?: AdobeQoeDataDetails) {
    return this.maybeQueueEvent('/adSkip', { playhead, qoeDataDetails });
  }

  async adComplete(playhead: number | undefined, qoeDataDetails?: AdobeQoeDataDetails) {
    return this.maybeQueueEvent('/adComplete', { playhead, qoeDataDetails });
  }

  /**
   * https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/createmediasession
   */
  async startSession(sessionDetails: AdobeSessionDetails, customMetadata?: AdobeCustomMetadataDetails[], qoeDataDetails?: AdobeQoeDataDetails) {
    try {
      const result = await this._alloyClient('createMediaSession', {
        xdm: {
          eventType: pathToEventTypeMap['/sessionStart'],
          timestamp: new Date().toISOString(),
          mediaCollection: {
            playhead: 0,
            sessionDetails,
            qoeDataDetails,
            customMetadata,
          },
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

  async maybeQueueEvent(path: keyof paths, mediaDetails: AdobeMediaDetails) {
    // Do not bother queueing the event in case starting the session has failed
    if (this.hasSessionFailed()) {
      return;
    }
    const doPostEvent = () => {
      return this.postEvent(path, mediaDetails);
    };

    // If the session has already started, do not queue but send it directly.
    if (!this.hasSessionStarted()) {
      this._eventQueue.push(doPostEvent);
    } else {
      return doPostEvent();
    }
  }

  async postEvent(path: keyof paths, mediaDetails: AdobeMediaDetails) {
    // Make sure we are positing data with a valid sessionID.
    if (!this._sessionId) {
      console.error(TAG, 'Invalid sessionID');
      return;
    }

    try {
      const eventType = pathToEventTypeMap[path];
      /**
       * https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/sendmediaevent
       */
      this._alloyClient('sendMediaEvent', {
        xdm: {
          eventType,
          mediaCollection: {
            ...mediaDetails,
            playhead: sanitisePlayhead(mediaDetails.playhead),
            sessionID: this._sessionId,
          },
        },
      });
    } catch (e) {
      console.error(TAG, `Failed to send event: ${JSON.stringify(e)}`);
    }
  }
}
