import {
  AddOperation,
  Cluster,
  ClusterEntitiesChangedEvent,
  ClusterType,
  Entity
} from "@theoplayer/react-native-engage";
import { DefaultEngageClient } from "../DefaultEngageClient";

export class DefaultCluster extends Cluster {
  constructor(private engageClient: DefaultEngageClient,
              public type: ClusterType,
              public entities: Entity[] = []) {
    super();
  }

  update() {
    this.engageClient.publish(this);
    this.dispatchEvent(new ClusterEntitiesChangedEvent());
  }

  addEntity(entity: Entity, op: AddOperation = AddOperation.AddToFront): void {
    switch (op) {
      case AddOperation.AddToBack:
        this.entities = [...this.entities.filter(e => e.id !== entity.id), entity];
      break;
      case AddOperation.AddToFront:
        this.entities = [entity, ...this.entities.filter(e => e.id !== entity.id)];
      break;
    }
    this.update();
  }

  removeEntity(entity: Entity): void {
    this.entities = this.entities.filter(e => e.id !== entity.id);
    this.update();
  }

  removeAllEntities(): void {
    this.entities = [];
    this.update();
  }

  unpublish(): void {
    this.entities = [];
    this.engageClient.unpublish(this);
    this.dispatchEvent(new ClusterEntitiesChangedEvent());
  }
}
