import type { paths } from './MediaEdge';
import { EventType } from '../EventType';

export const pathToEventTypeMap: Record<keyof paths, string> = {
  '/adBreakComplete': EventType.adBreakComplete,
  '/adBreakStart': EventType.adBreakStart,
  '/adComplete': EventType.adComplete,
  '/adSkip': EventType.adSkip,
  '/adStart': EventType.adStart,
  '/bitrateChange': EventType.bitrateChange,
  '/bufferStart': EventType.bufferStart,
  '/chapterComplete': EventType.chapterComplete,
  '/chapterSkip': EventType.chapterSkip,
  '/chapterStart': EventType.chapterStart,
  '/error': EventType.error,
  '/pauseStart': EventType.pauseStart,
  '/ping': EventType.ping,
  '/play': EventType.play,
  '/sessionComplete': EventType.sessionComplete,
  '/sessionEnd': EventType.sessionEnd,
  '/sessionStart': EventType.sessionStart,
  '/statesUpdate': EventType.statesUpdate,
};
