import {
  AddOperation,
  ClusterConfig,
  ClusterEntitiesChangedEvent,
  ClusterEntity,
  ClusterType,
} from "@theoplayer/react-native-engage";
import { type DefaultEngageClient } from "../DefaultEngageClient";
import { Cluster } from "../../api/cluster/Cluster";

export class DefaultCluster extends Cluster {
  private clusterConfig: ClusterConfig;

  constructor(private engageClient: DefaultEngageClient,
              public type: ClusterType,
              public entities: ClusterEntity[] = []) {
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

  addEntity(entity: ClusterEntity, op: AddOperation = AddOperation.AddToFront): void {
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

  removeEntity(entity: ClusterEntity): void {
    this.entities = this.entities.filter(e => e.id !== entity.id);
    this.update();
  }

  removeAllEntities(): void {
    this.entities = [];
    this.update();
  }
}
