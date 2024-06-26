export enum EventType {
  sessionStart = 'media.sessionStart',
  play = 'media.play',
  ping = 'media.ping',
  bitrateChange = 'media.bitrateChange',
  bufferStart = 'media.bufferStart',
  pauseStart = 'media.pauseStart',
  adBreakStart = 'media.adBreakStart',
  adStart = 'media.adStart',
  adComplete = 'media.adComplete',
  adSkip = 'media.adSkip',
  adBreakComplete = 'media.adBreakComplete',
  chapterStart = 'media.chapterStart',
  chapterSkip = 'media.chapterSkip',
  chapterComplete = 'media.chapterComplete',
  error = 'media.error',
  sessionEnd = 'media.sessionEnd',
  sessionComplete = 'media.sessionComplete',
  statesUpdate = 'media.statesUpdate',
}
