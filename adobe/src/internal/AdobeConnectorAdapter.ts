import type {
  Ad,
  AdBreak,
  AdEvent,
  ErrorEvent,
  LoadedMetadataEvent,
  MediaTrackEvent,
  TextTrackCue,
  TextTrackEvent,
  THEOplayer
} from "react-native-theoplayer";
import { AdEventType, MediaTrackEventType, PlayerEventType, TextTrackEventType } from "react-native-theoplayer";
import type { AdobeEventRequestBody, AdobeMetaData, ContentType } from "./Types";
import { AdobeEventTypes } from "./Types";
import { calculateAdBeginMetadata, calculateAdBreakBeginMetadata, calculateChapterStartMetadata } from "../utils/Utils";
  import { NativeModules, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

const CONTENT_PING_INTERVAL = 10000;
const AD_PING_INTERVAL = 1000;
const USER_AGENT_PREFIX = 'Mozilla/5.0';
const UNKNOWN = 'unknown';

function nonEmptyOrUnknown(str?: string): string {
  return str && str !== '' ? str : UNKNOWN;
}

export class AdobeConnectorAdapter {
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
  private pingInterval: ReturnType<typeof setInterval> | undefined;

  /** Whether we are in a current session or not */
  private sessionInProgress = false;

  private adBreakPodIndex = 0;

  private adPodPosition = 1;

  private isPlayingAd = false;

  private customMetadata: AdobeMetaData = {}

  private currentChapter: TextTrackCue | undefined;

  private readonly customUserAgent: string | undefined;

  constructor(player: THEOplayer, uri: string, ecid: string, sid: string, trackingUrl: string, metadata?: AdobeMetaData, userAgent?: string) {
    this.player = player
    this.uri = `https://${ uri }/api/v1/sessions`;
    this.ecid = ecid;
    this.sid = sid;
    this.trackingUrl = trackingUrl;
    this.customMetadata = { ...this.customMetadata, ...metadata };
    this.customUserAgent = userAgent || this.buildUserAgent();

    this.addEventListeners();
  }

  updateMetadata(metadata: AdobeMetaData): void {
    this.customMetadata = { ...this.customMetadata, ...metadata };
  }

  setError(metadata: AdobeMetaData): void {
    void this.sendEventRequest(AdobeEventTypes.ERROR, metadata);
  }

  async stopAndStartNewSession(metadata?: AdobeMetaData): Promise<void> {
    await this.maybeEndSession();
    if (metadata !== undefined) {
      this.updateMetadata(metadata);
    }
    await this.startSession();

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
    this.player.addEventListener(PlayerEventType.MEDIA_TRACK, this.onMediaTrackEvent)
    this.player.addEventListener(PlayerEventType.LOADED_METADATA, this.onLoadedMetadata);
    this.player.addEventListener(PlayerEventType.ERROR, this.onError);

    this.player.addEventListener(PlayerEventType.AD_EVENT, this.onAdEvent)

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
    this.player.removeEventListener(PlayerEventType.MEDIA_TRACK, this.onMediaTrackEvent)
    this.player.removeEventListener(PlayerEventType.LOADED_METADATA, this.onLoadedMetadata);
    this.player.removeEventListener(PlayerEventType.ERROR, this.onError);

    this.player.removeEventListener(PlayerEventType.AD_EVENT, this.onAdEvent)

    if (Platform.OS === 'web') {
      window.removeEventListener('beforeunload', this.onBeforeUnload);
    }
  }

  private onLoadedMetadata = (e: LoadedMetadataEvent) => {
    void this.startSession(e.duration);
  }

  private onPlaying = () => {
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
    void this.maybeEndSession();
  }

  private onMediaTrackEvent = (event: MediaTrackEvent) => {
    if (event.subType === MediaTrackEventType.ACTIVE_QUALITY_CHANGED) {
      void this.sendEventRequest(AdobeEventTypes.BITRATE_CHANGE);
    }
  }

  private onTextTrackEvent = (event: TextTrackEvent) => {
    const track = this.player.textTracks.find((track) => track.uid === event.trackUid);
    // @ts-ignore
    if (track !== undefined && track.kind === 'chapters') {
      switch (event.subType) {
        case TextTrackEventType.ENTER_CUE: {
          const chapterCue = event.cue;
          if (this.currentChapter && this.currentChapter.endTime !== chapterCue.startTime) {
            void this.sendEventRequest(AdobeEventTypes.CHAPTER_SKIP);
          }
          const metadata = calculateChapterStartMetadata(chapterCue);
          void this.sendEventRequest(AdobeEventTypes.CHAPTER_START, metadata);
          this.currentChapter = chapterCue;
          break;
        }
        case TextTrackEventType.EXIT_CUE: {
          void this.sendEventRequest(AdobeEventTypes.CHAPTER_COMPLETE);
          break;
        }
      }
    }
  }

  private onError = (error: ErrorEvent) => {
    const metadata: AdobeMetaData = {
      qoeData: {
        "media.qoe.errorID": error.error.errorCode,
        "media.qoe.errorSource": "player"
      }
    }
    void this.sendEventRequest(AdobeEventTypes.ERROR, metadata);
  }

  private onAdEvent = (event: AdEvent) => {
    switch (event.subType) {
      case AdEventType.AD_BREAK_BEGIN: {
        this.isPlayingAd = true;
        this.startPinger(AD_PING_INTERVAL);
        const adBreak = event.ad as AdBreak;
        const metadata = calculateAdBreakBeginMetadata(adBreak, this.adBreakPodIndex);
        void this.sendEventRequest(AdobeEventTypes.AD_BREAK_START, metadata);
        if (( metadata.params as any )[ "media.ad.podIndex" ] > this.adBreakPodIndex) { // TODO fix!
          this.adBreakPodIndex++;
        }
        break;
      }
      case AdEventType.AD_BREAK_END: {
        this.isPlayingAd = false;
        this.adPodPosition = 1;
        this.startPinger(CONTENT_PING_INTERVAL);
        void this.sendEventRequest(AdobeEventTypes.AD_BREAK_COMPLETE);
        break;
      }
      case AdEventType.AD_BEGIN: {
        const ad = event.ad as Ad;
        const metadata = calculateAdBeginMetadata(ad, this.adPodPosition);
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
    void this.maybeEndSession();
  }

  private async maybeEndSession(): Promise<void> {
    if (this.sessionId !== '') {
      return this.sendEventRequest(AdobeEventTypes.SESSION_END).then(() => {
        this.reset();
      });
    }
    return Promise.resolve();
  }

  private createBaseRequest(eventType: string): AdobeEventRequestBody {
    return {
      "playerTime": {
        "playhead": this.getCurrentTime(),
        "ts": Date.now()
      },
      "eventType": eventType,
      "qoeData": {},
    };
  }

  private getCurrentTime(): number {
    if (this.player.duration === Infinity) {
      // If content is live, the playhead must be the current second of the day.
      const date = new Date();
      return date.getSeconds() + (60 * (date.getMinutes() + (60 * date.getHours())));
    }
    return this.player.currentTime/1000;
  }

  private async startSession(mediaLengthMsec?: number): Promise<void> {
    const mediaLength = this.getContentLength(mediaLengthMsec);
    if (this.sessionInProgress || !this.player.source || !isValidDuration(mediaLength)) {
      return;
    }
    this.sessionInProgress = true;
    const initialBody = this.createBaseRequest(AdobeEventTypes.SESSION_START);
    let friendlyName = {};
    if (this.player.source.metadata?.title) {
      friendlyName = {
        "media.name": this.player.source.metadata.title
      };
    }
    initialBody.params = {
      "analytics.reportSuite": this.sid,
      "analytics.trackingServer": this.trackingUrl,
      "media.channel": "N/A",
      "media.contentType": this.getContentType(),
      "media.id": "N/A",
      "media.length": mediaLength,
      "media.playerName": "THEOplayer", // TODO make distinctions between platforms?
      "visitor.marketingCloudOrgId": this.ecid,
      ...friendlyName,
      ...this.customMetadata.params
    }
    const body = this.addCustomMetadata(AdobeEventTypes.SESSION_START, initialBody);

    const response = await this.sendRequest(this.uri, body);

    if (response.status !== 201) {
      console.error('ERROR DURING SESSION CREATION', response);
      return;
    }

    const splitResponseUrl = response.headers.get('location')?.split('/sessions/');
    if (splitResponseUrl === undefined) {
      console.error('NO LOCATION HEADER PRESENT');
      return;
    }
    this.sessionId = splitResponseUrl[ splitResponseUrl.length - 1 ];

    if (this.eventQueue.length !== 0) {
      const url = `${ this.uri }/${ this.sessionId }/events`;
      for (const body of this.eventQueue) {
        await this.sendRequest(url, body); // TODO another fallback necessary on top?
      }
      this.eventQueue = [];
    }

    if (!this.isPlayingAd) {
      this.startPinger(CONTENT_PING_INTERVAL);
    } else {
      this.startPinger(AD_PING_INTERVAL);
    }
  }

  private addCustomMetadata(eventType: AdobeEventTypes, body: AdobeEventRequestBody): AdobeEventRequestBody {
    if (eventType !== AdobeEventTypes.PING) {
      if (eventType === AdobeEventTypes.AD_BREAK_START
        || eventType === AdobeEventTypes.CHAPTER_START
        || eventType === AdobeEventTypes.AD_START
        || eventType === AdobeEventTypes.SESSION_START) {
        body.customMetadata = {...this.customMetadata.customMetadata};
      }
      // TODO check params which are fine and which need more limitations?
    }
    body.qoeData = {...body.qoeData, ...this.customMetadata.qoeData};
    return body;
  }

  private async sendEventRequest(eventType: AdobeEventTypes, metadata?: AdobeEventRequestBody): Promise<void> {
    const initialBody: AdobeEventRequestBody = { ...this.createBaseRequest(eventType), ...metadata};
    const body = this.addCustomMetadata(eventType, initialBody);
    if (this.sessionId === '') {
      // Session hasn't started yet but no session id --> add to queue
      this.eventQueue.push(body);
      return;
    }
    const url = `${ this.uri }/${ this.sessionId }/events`;
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

  private buildUserAgent(): string | undefined {
    if (Platform.OS === 'android') {
      const {Release, Model: deviceName} = Platform.constants;
      const localeString = nonEmptyOrUnknown(NativeModules.I18nManager?.localeIdentifier?.replace('_', '-'));
      const operatingSystem = `Android ${Release}`;
      const deviceBuildId = nonEmptyOrUnknown(DeviceInfo.getBuildIdSync());
      // operatingSystem: `Android Build.VERSION.RELEASE`
      // deviceName: Build.MODEL
      // Example: Mozilla/5.0 (Linux; U; Android 7.1.2; en-US; AFTN Build/NS6296)
      return `${USER_AGENT_PREFIX} (Linux; U; ${operatingSystem}; ${localeString}; ${deviceName} Build/${deviceBuildId})`;
    } else if (Platform.OS === 'ios') {
      const localeString = NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0]
      const model = DeviceInfo.getModel();
      const osVersion = DeviceInfo.getSystemVersion().replace('.', '_');
      return `${USER_AGENT_PREFIX} (${model}; CPU OS ${osVersion} like Mac OS X; ${localeString})`;
    } else if (Platform.OS === 'web') {
      return navigator.userAgent;
    } else /* if (Platform.OS === 'windows' || Platform.OS === 'macos') */ {
      // Custom User-Agent for Windows and MacOS not supported
      return undefined;
    }
  }

  private async sendRequest(url: string, body: AdobeEventRequestBody): Promise<Response> {
    return await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',

        // Override User-Agent with provided value.
        ...(this.customUserAgent && {'User-Agent': this.customUserAgent})
      }
    })
  }

  /**
   * Get the current media length in seconds.
   *
   * - In case of a live stream, set it to 24h.
   *
   * @param mediaLengthMsec optional mediaLengthMsec provided by a player event.
   * @private
   */
  private getContentLength(mediaLengthMsec?: number): number {
    if (mediaLengthMsec !== undefined) {
      return mediaLengthMsec === Infinity ? 86400 : 1e-3 * mediaLengthMsec;
    }
    return this.player.duration === Infinity ? 86400 : 1e-3 * this.player.duration;
  }

  private getContentType(): ContentType {
    return this.player.duration === Infinity ? 'Live' : 'VOD';
  }

  reset(): void {
    this.adBreakPodIndex = 0;
    this.adPodPosition = 1;
    this.sessionId = '';
    this.sessionInProgress = false;
    clearInterval(this.pingInterval);
    this.pingInterval = undefined;
    this.currentChapter = undefined;
  }

  async destroy(): Promise<void> {
    await this.maybeEndSession();
    this.removeEventListeners();
  }
}

function isValidDuration(v: number | undefined): boolean {
  return v !== undefined && !Number.isNaN(v);
}
