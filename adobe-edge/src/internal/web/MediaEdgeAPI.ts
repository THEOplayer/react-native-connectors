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
import { sanitisePlayhead } from './Utils';
import { createInstance } from '@adobe/alloy';
import { AdobeEdgeWebConfig } from '../../api/AdobeEdgeWebConfig';

const TAG = 'AdobeEdge';

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
export class MediaEdgeAPI {
  private _sessionId: string | undefined;
  private _hasSessionFailed: boolean;
  private _eventQueue: (() => Promise<void>)[] = [];
  private readonly _alloyClient: AlloyClient;

  constructor(config: AdobeEdgeWebConfig) {
    this._hasSessionFailed = false;
    const sanitisedConfig = sanitiseConfig(config);
    const { datastreamId, orgId, debugEnabled } = sanitisedConfig;

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

  /**
   * The appendIdentityToUrl command allows you to add a user identifier to the URL as a query string.
   * {@link https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/appendidentitytourl}
   */
  appendIdentityToUrl(url: string) {
    this._alloyClient('appendIdentityToUrl', { url });
  }

  setDebug(debug: boolean) {
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
      void this.sendMediaEvent('/ping', { playhead, qoeDataDetails });
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
   * Start a manually-tracked media sessions.
   *
   * {@link }https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/createmediasession}
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
      return this.sendMediaEvent(path, mediaDetails);
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
  private async sendMediaEvent(path: keyof paths, mediaDetails: AdobeMediaDetails) {
    // Make sure we are positing data with a valid sessionID.
    if (!this._sessionId) {
      console.error(TAG, 'Invalid sessionID');
      return;
    }

    try {
      this._alloyClient('sendMediaEvent', {
        xdm: {
          eventType: pathToEventTypeMap[path],
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

function findAlloyClient(datastreamId: string, orgId: string): AlloyClient | undefined {
  return createdClients.find((client) => client.datastreamId === datastreamId && client.orgId === orgId)?.client;
}

function sanitiseConfig(config: AdobeEdgeWebConfig): AdobeEdgeWebConfig {
  return {
    ...config,
    streamingMedia: {
      ...config.streamingMedia,
      channel: config.streamingMedia?.channel || 'defaultChannel',
      playerName: config.streamingMedia?.playerName || 'THEOplayer',
    },
  };
}
