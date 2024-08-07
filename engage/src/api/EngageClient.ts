import { Cluster, ClusterConfig } from "./cluster";
import { EventDispatcher } from "../internal/event/EventDispatcher";
import { EngageEventMap } from "./EngageEvent";
import { ClusterType } from "./types";

export interface EngageClient extends EventDispatcher<EngageEventMap> {
  /**
   * Return a cluster by type.
   *
   * @param type cluster type, either "Continuation", "Recommendation" or "Featured".
   * @param config set the cluster configuration.
   */
  getCluster(type: ClusterType, config?: ClusterConfig): Cluster;

  /**
   * Clears and unpublishes a cluster by type.
   *
   * @param type cluster type, either "Continuation", "Recommendation" or "Featured".
   */
  clearCluster(type: ClusterType): void;

  /**
   * Release the client.
   */
  destroy(): void;
}
