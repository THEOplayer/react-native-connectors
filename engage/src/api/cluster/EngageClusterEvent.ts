import { BaseEvent } from "../../internal/event/Event";

export class ClusterEntitiesChangedEvent extends BaseEvent<EngageClusterEventType.EntitiesChanged> {
  constructor() {
    super(EngageClusterEventType.EntitiesChanged);
  }
}

export enum EngageClusterEventType {
  EntitiesChanged = 'entitieschanged',
}

export interface EngageClusterEventMap {
  [EngageClusterEventType.EntitiesChanged]: ClusterEntitiesChangedEvent;
}
