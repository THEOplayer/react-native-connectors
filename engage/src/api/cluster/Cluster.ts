import { ClusterEntity, ClusterType } from "@theoplayer/react-native-engage";
import { DefaultEventDispatcher } from "../../internal/event/DefaultEventDispatcher";
import { EngageClusterEventMap } from "./EngageClusterEvent";

export enum AddOperation {
  AddToFront,
  AddToBack
}

export interface ClusterConfig {
}

export abstract class Cluster extends DefaultEventDispatcher<EngageClusterEventMap> {
  /**
   * Type of cluster.
   */
  type: ClusterType;

  /**
   * Cluster config.
   */
  abstract config: ClusterConfig;

  /**
   * The list of entities in this cluster
   */
  abstract entities: ClusterEntity[];

  /**
   * Add an entity to the cluster.
   */
  abstract addEntity(entity: ClusterEntity, op?: AddOperation): void;

  /**
   * Remove an entity from the cluster.
   */
  abstract removeEntity(entity: ClusterEntity): void;

  /**
   * Remove all entities from the cluster.
   */
  abstract removeAllEntities(): void;
}
