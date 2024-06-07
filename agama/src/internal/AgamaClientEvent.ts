import type { Event } from './event/Event';

export type AgamaClientPauseEvent = Event<AgamaClientEventType.PAUSE>;

export type AgamaClientResumeEvent = Event<AgamaClientEventType.RESUME>;

export enum AgamaClientEventType {
  PAUSE = 'agamaclientpause_',
  RESUME = 'agamaclientresume_',
}

export interface AgamaClientEventMap {
  [AgamaClientEventType.PAUSE]: AgamaClientPauseEvent;
  [AgamaClientEventType.RESUME]: AgamaClientResumeEvent;
}
