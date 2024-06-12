export type ContentType = 'VOD' | 'Live' | 'Linear';

export type AdobeEventRequestBody = {
  playerTime?: object;
  eventType?: string;
} & AdobeMetaData;

export type AdobeMetaData = {
  params?: object;
  qoeData?: object;
  customMetadata?: object;
};

export enum AdobeEventTypes {
  SESSION_START = 'sessionStart',
  PLAY = 'play',
  PING = 'ping',
  BITRATE_CHANGE = 'bitrateChange',
  BUFFER_START = 'bufferStart',
  PAUSE_START = 'pauseStart',
  AD_BREAK_START = 'adBreakStart',
  AD_START = 'adStart',
  AD_COMPLETE = 'adComplete',
  AD_SKIP = 'adSkip',
  AD_BREAK_COMPLETE = 'adBreakComplete',
  CHAPTER_START = 'chapterStart',
  CHAPTER_SKIP = 'chapterSkip',
  CHAPTER_COMPLETE = 'chapterComplete',
  ERROR = 'error',
  SESSION_END = 'sessionEnd',
  SESSION_COMPLETE = 'sessionComplete',
}
