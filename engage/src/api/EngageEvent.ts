import { BaseEvent } from '../internal/event/Event';

export enum EngageEventType {
  Error = 'error',
}

export interface EngageEventMap {
  [EngageEventType.Error]: EngageErrorEvent;
}

export class EngageErrorEvent extends BaseEvent<EngageEventType.Error> {
  constructor(public message: string) {
    super(EngageEventType.Error);
  }
}
