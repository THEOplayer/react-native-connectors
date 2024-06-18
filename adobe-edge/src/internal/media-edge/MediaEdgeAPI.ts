import type { paths } from './MediaEdge';
import createClient, { type ClientMethod } from 'openapi-fetch';
import type { MediaType } from 'openapi-typescript-helpers';
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
import { buildUserAgent, sanitisePlayhead } from '../../utils/Utils';

// eslint-disable-next-line @typescript-eslint/ban-types
type PostRequestType<Paths extends {}, Media extends MediaType = MediaType> = ClientMethod<Paths, 'post', Media>;

// eslint-disable-next-line @typescript-eslint/ban-types
interface MediaEdgeClient<Paths extends {}, Media extends MediaType = MediaType> {
  /** Call a POST endpoint */
  POST: PostRequestType<Paths, Media>;
}

const TAG = "AdobeEdge";

export class MediaEdgeAPI {
  private readonly _client: MediaEdgeClient<paths, 'application/json'>;
  private readonly _configId: string;
  private _debugSessionId: string | undefined;
  private _sessionId: string | undefined;
  private _hasSessionFailed: boolean;
  private _eventQueue: (() => Promise<void>)[] = [];

  constructor(baseUrl: string, configId: string, userAgent?: string, debugSessionId?: string) {
    this._configId = configId;
    this._debugSessionId = debugSessionId;
    this._hasSessionFailed = false;
    this._client = createClient<paths, 'application/json'>({
      baseUrl,
      headers: { 'User-Agent': userAgent || buildUserAgent() },
    });
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

  private createClientParams() {
    const params = {
      query: {
        configId: this._configId,
      }  as { configId: string; debugSessionID?: string },
    };
    if (this._debugSessionId) {
      params.query.debugSessionID = this._debugSessionId;
    }
    return params;
  }

  async startSession(sessionDetails: AdobeSessionDetails, customMetadata?: AdobeCustomMetadataDetails[], qoeDataDetails?: AdobeQoeDataDetails) {
    try {
      const result = await this._client.POST('/sessionStart', {
        params: this.createClientParams(),
        body: {
          events: [
            {
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
            },
          ],
        },
      });

      // @ts-ignore
      const error = result.error || result.data.errors;
      if (error) {
        // noinspection ExceptionCaughtLocallyJS
        throw Error(error);
      }
      // @ts-ignore
      this._sessionId = result.data?.handle?.find((h: { type: string }) => {
        return h.type === 'media-analytics:new-session';
      })?.payload?.[0]?.sessionId;

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
      const result = await this._client.POST(path, {
        params: this.createClientParams(),
        body: {
          events: [
            {
              xdm: {
                eventType: pathToEventTypeMap[path],
                timestamp: new Date().toISOString(),
                mediaCollection: {
                  ...mediaDetails,
                  playhead: sanitisePlayhead(mediaDetails.playhead),
                  sessionID: this._sessionId,
                },
              },
            },
          ],
        },
      });
      // @ts-ignore
      const error = result.error || result.data.errors;
      if (error) {
        console.error(TAG, `Failed to send event. ${JSON.stringify(error)}`);
      }
    } catch (e) {
      console.error(TAG, `Failed to send event: ${JSON.stringify(e)}`);
    }
  }
}
