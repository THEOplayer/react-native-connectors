import { BaseEvent } from '../internal/event/Event';

export class EngageErrorEvent extends BaseEvent<EngageEventType.ERROR> {
  constructor(public message: string) {
    super(EngageEventType.ERROR);
  }
}

export enum EngageEventType {
  ERROR = 'error',
}

export interface EngageEventMap {
  [EngageEventType.ERROR]: EngageErrorEvent;
}
