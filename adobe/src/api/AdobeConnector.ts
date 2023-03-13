import type { AdBreak, AdEvent, GoogleImaAd, MediaTrackEvent, TextTrackCue, TextTrackEvent, THEOplayer } from "react-native-theoplayer";
import { AdEventType, MediaTrackEventType, PlayerEventType, TextTrackEventType } from "react-native-theoplayer";
import type { AdobeEventRequestBody, ContentType } from "../internal/Types";
import { AdobeEventTypes } from "../internal/Types";

const CONTENT_PING_INTERVAL = 10_000;
const AD_PING_INTERVAL = 1_000;

export class AdobeConnector {
  private player: THEOplayer;

  /** Media Collection APIs end point */
  private readonly uri: string;

  /** Visitor Experience Cloud Org ID */
  private readonly ecid: string;

  /** Analytics Report Suite ID */
  private readonly sid: string;

  /** Analytics Tracking Server URL */
  private readonly trackingUrl: string;

  /** The id of the current session */
  private sessionId = '';

  /** Queue for events that happened before sessionid has been obtained */
  private eventQueue: AdobeEventRequestBody[] = [];

  /** Timer handling the ping event request */
  private pingInterval: NodeJS.Timer | undefined;

  /** Whether we are in a current session or not */
  private sessionInProgress = false;

  private adBreakPodIndex = 0; // TODO check if can do it like this? What if we play same adbreak again?

  private adPodPosition = 0;

  private isPlayingAd = false;

  private customMetadata: AdobeEventRequestBody = {}

  private currentChapter: TextTrackCue | undefined;

  constructor(player: THEOplayer, uri: string, ecid: string, sid: string, trackingUrl: string) {
    this.player = player
    this.uri = `https://${uri}/api/v1/sessions`;
    this.ecid = ecid;
    this.sid = sid;
    this.trackingUrl = trackingUrl;

    this.addEventListeners();
  }

  addCustomMetadata(metadata: AdobeEventRequestBody): void {
    this.customMetadata = {...this.customMetadata, ...metadata};
  }

  private addEventListeners(): void {
    this.player.addEventListener(PlayerEventType.PLAYING, this.onPlaying);
    this.player.addEventListener(PlayerEventType.PAUSE, this.onPause);
    this.player.addEventListener(PlayerEventType.ENDED, this.onEnded);
    this.player.addEventListener(PlayerEventType.WAITING, this.onWaiting);
    this.player.addEventListener(PlayerEventType.SOURCE_CHANGE, this.onSourceChange);
    this.player.addEventListener(PlayerEventType.TEXT_TRACK, this.onTextTrackEvent);
    this.player.addEventListener(PlayerEventType.MEDIA_TRACK, this.onMediaTrackEvent)
    this.player.addEventListener(PlayerEventType.DURATION_CHANGE, this.onDurationChange);
    this.player.addEventListener(PlayerEventType.ERROR, this.onError);

    this.player.addEventListener(PlayerEventType.AD_EVENT, this.onAdEvent)

    window.addEventListener('beforeunload', this.onBeforeUnload);

  }

  private removeEventListeners(): void {
    this.player.removeEventListener(PlayerEventType.PLAYING, this.onPlaying);
    this.player.removeEventListener(PlayerEventType.PAUSE, this.onPause);
    this.player.removeEventListener(PlayerEventType.ENDED, this.onEnded);
    this.player.removeEventListener(PlayerEventType.WAITING, this.onWaiting);
    this.player.removeEventListener(PlayerEventType.SOURCE_CHANGE, this.onSourceChange);
    this.player.removeEventListener(PlayerEventType.TEXT_TRACK, this.onTextTrackEvent);
    this.player.removeEventListener(PlayerEventType.MEDIA_TRACK, this.onMediaTrackEvent)
    this.player.removeEventListener(PlayerEventType.DURATION_CHANGE, this.onDurationChange);
    this.player.removeEventListener(PlayerEventType.ERROR, this.onError);

    this.player.removeEventListener(PlayerEventType.AD_EVENT, this.onAdEvent)

    window.removeEventListener('beforeunload', this.onBeforeUnload);
  }

  private onDurationChange = () => {
    void this.startSession();
  }

  private onPlaying = () => {
    if (!this.sessionInProgress) {
      void this.startSession();
    }
    void this.sendEventRequest(AdobeEventTypes.PLAY);
  }

  private onPause = () => {
    void this.sendEventRequest(AdobeEventTypes.PAUSE_START);
  }

  private onWaiting = () => {
    void this.sendEventRequest(AdobeEventTypes.BUFFER_START);
  }

  private onEnded = () => {
    this.sendEventRequest(AdobeEventTypes.SESSION_COMPLETE).then(() => {
      this.reset();
    });
  }

  private onSourceChange = () => {
    if (this.sessionId !== '') {
      this.sendEventRequest(AdobeEventTypes.SESSION_END).then(() => {
        this.reset();
      });
    }
  }

  private onMediaTrackEvent = (event: MediaTrackEvent) => {
    // TODO check if for both audio and video! I suppose it should?
    if (event.subType === MediaTrackEventType.ACTIVE_QUALITY_CHANGED) {
      void this.sendEventRequest(AdobeEventTypes.BITRATE_CHANGE);
    }
  }

  private onTextTrackEvent = (event: TextTrackEvent) => {
    const track = this.player.textTracks.find((track) => track.uid === event.trackUid);
    if (track === undefined || track.kind !== 'chapters') {
      return;
    }
    switch (event.subType) {
      case TextTrackEventType.ENTER_CUE: {
        const chapterCue = event.cue;
        if (this.currentChapter && this.currentChapter.endTime !== chapterCue.startTime) {
          void this.sendEventRequest(AdobeEventTypes.CHAPTER_SKIP); // TODO check if this is the correct use case for Chapter Skip
        }
        void this.sendEventRequest(AdobeEventTypes.CHAPTER_START);
        this.currentChapter = chapterCue;
        break;
      }
      case TextTrackEventType.EXIT_CUE: {
        void this.sendEventRequest(AdobeEventTypes.CHAPTER_COMPLETE);
        break;
      }
    }
  }

  private onError = () => {
    void this.sendEventRequest(AdobeEventTypes.ERROR);
  }

  private onAdEvent = (event: AdEvent) => {
    switch (event.subType) {
      case AdEventType.AD_BREAK_BEGIN: {
        this.isPlayingAd = true;
        this.startPinger(AD_PING_INTERVAL);
        const adBreak = event.ad as AdBreak;
        const metadata: AdobeEventRequestBody = {
          params: {
            'media.ad.podIndex': this.adBreakPodIndex,
            'media.ad.podSecond': adBreak.maxDuration
          }
        }
        void this.sendEventRequest(AdobeEventTypes.AD_BREAK_START, metadata);
        this.adBreakPodIndex++;
        break;
      }
      case AdEventType.AD_BREAK_END: {
        this.isPlayingAd = false;
        this.adPodPosition = 0;
        this.startPinger(CONTENT_PING_INTERVAL);
        void this.sendEventRequest(AdobeEventTypes.AD_BREAK_COMPLETE);
        break;
      }
      case AdEventType.AD_BEGIN: {
        const ad = event.ad as Ad;
        console.log('AD BEGIN', ad);
        const metadata: AdobeEventRequestBody = {
          params: {
            'media.ad.podPosition': this.adPodPosition, // TODO check if it is a number and make it a number!
            'media.ad.id': ad.id,
            'media.ad.length': ad.duration,
            'media.ad.playerName': 'THEOplayer' // Or do they want the ad integration? We as a player render it :shrug:
          }
        }
        void this.sendEventRequest(AdobeEventTypes.AD_START, metadata);
        this.adPodPosition++;
        break;
      }
      case AdEventType.AD_END: {
        void this.sendEventRequest(AdobeEventTypes.AD_COMPLETE);
        break;
      }
      case AdEventType.AD_SKIP: {
        void this.sendEventRequest(AdobeEventTypes.AD_SKIP);
        break;
      }
    }
  }

  private onBeforeUnload = () => {
    void this.sendEventRequest(AdobeEventTypes.SESSION_END).then(() => {
      this.reset();
    });
  }

  private createBaseRequest(eventType: string): AdobeEventRequestBody {
    return {
      "playerTime": {
        "playhead": this.player.currentTime/1000,
        "ts": Date.now() // TODO use currentPDT? no alternatives?
      },
      "eventType": eventType,
      "qoeData": {},
    };
  }

  private async startSession(): Promise<void> {
    if (this.sessionInProgress) {
      return;
    }
    this.sessionInProgress = true;
    const body = this.createBaseRequest(AdobeEventTypes.SESSION_START);
    body.params = {
      "analytics.reportSuite": this.sid,
      "analytics.trackingServer": this.trackingUrl,
      "media.channel": "sample-test-channel", // TODO allow generic metadata to be passed with some required fields like this one? and query them with a default as fallback?
      "media.contentType": this.getContentType(),
      "media.id": "sample-test-id",
      "media.length": this.getContentLength(),
      "media.playerName": "THEOplayer",
      "visitor.marketingCloudOrgId": this.ecid
    }

    const response = await this.sendRequest(this.uri, body);

    if (response.status !== 201) {
      console.log('ERROR DURING SESSION CREATION', response);
      return;
    }

    const splitResponseUrl =  response.headers.get('location')?.split('/sessions/');
    if (splitResponseUrl === undefined) {
      console.error('NO LOCATION HEADER PRESENT');
      return;
    }
    this.sessionId = splitResponseUrl[splitResponseUrl.length-1];

    if (this.eventQueue.length !== 0) {
      const url = `${this.uri}/${this.sessionId}/events`;
      for (const body of this.eventQueue) {
        await this.sendRequest(url, body); // TODO another fallback necessary on top?
      }
      this.eventQueue = [];
    }

    if (!this.isPlayingAd) {
      this.startPinger(CONTENT_PING_INTERVAL);
    }
  }

  // TODO probably other way to pass metadata or other type, All optional data should come from our side, check with NFL which ones they want? Leave all non required out for now
  private async sendEventRequest(eventType: string, metadata?: AdobeEventRequestBody): Promise<void> {
    const body: AdobeEventRequestBody = {...this.createBaseRequest(eventType), ...metadata, ...this.customMetadata};
    if (this.sessionId === '') {
      // Session hasn't started yet but no session id --> add to queue
      this.eventQueue.push(body);
      return;
    }
    const url = `${this.uri}/${this.sessionId}/events`;
    const response = await this.sendRequest(url, body);

    if (response.status === 404 || response.status === 410) {
      // Faulty session id, store in queue and remake session
      this.eventQueue.push(body);
      if (this.sessionId !== '' && this.sessionInProgress) {
        // avoid calling multiple startSessions close together
        this.sessionId = '';
        this.sessionInProgress = false;
        await this.startSession();
      }
    }
  }

  private startPinger(interval: number): void {
    if (this.pingInterval !== undefined) {
      clearInterval(this.pingInterval);
    }
    this.pingInterval = setInterval(() => {
      void this.sendEventRequest(AdobeEventTypes.PING);
    }, interval);
  }

  private async sendRequest(url: string, body: AdobeEventRequestBody): Promise<Response> {
    console.log('sending request', body.eventType);
    return await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  private getContentLength(): number {
    return this.player.duration === Infinity ? 86400 : this.player.duration/1000; // In case of a live stream, set it to 24h
  }

  private getContentType(): ContentType {
    return this.player.duration === Infinity ? 'Live' : 'VOD';
  }

  reset(): void {
    this.adBreakPodIndex = 0;
    this.adPodPosition = 0;
    this.sessionId = '';
    this.sessionInProgress = false;
    clearInterval(this.pingInterval);
    this.pingInterval = undefined;
    this.currentChapter = undefined;
  }

  destroy(): void {
    this.reset();
    this.removeEventListeners();
  }
}
