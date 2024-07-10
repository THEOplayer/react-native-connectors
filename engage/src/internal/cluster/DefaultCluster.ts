import {
  AddOperation,
  Cluster, ClusterConfig,
  ClusterEntitiesChangedEvent,
  ClusterType,
  Entity
} from "@theoplayer/react-native-engage";
import { DefaultEngageClient } from "../DefaultEngageClient";

export class DefaultCluster extends Cluster {
  private clusterConfig: ClusterConfig;

  constructor(private engageClient: DefaultEngageClient,
              public type: ClusterType,
              public entities: Entity[] = []) {
    super();
  }

  get config(): ClusterConfig {
    return this.clusterConfig;
  }

  set config(config: ClusterConfig) {
    this.clusterConfig = config;
    this.update();
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
}
