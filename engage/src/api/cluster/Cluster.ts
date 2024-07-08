import { ClusterType, Entity } from "@theoplayer/react-native-engage";
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
  config: ClusterConfig;

  /**
   * The list of entities in this cluster
   */
  entities: Entity[];

  /**
   * Add an entity to the cluster.
   */
  abstract addEntity(entity: Entity, op?: AddOperation): void;

  /**
   * Remove an entity from the cluster.
   */
  abstract removeEntity(entity: Entity): void;

  /**
   * Remove all entities from the cluster.
   */
  abstract removeAllEntities(): void;

  /**
   * Clears and unpublishes the cluster.
   */
  abstract unpublish(): void;
}
