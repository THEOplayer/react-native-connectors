import { Cluster } from "./cluster";
import { EventDispatcher } from "../internal/event/EventDispatcher";
import { EngageEventMap } from "./EngageEvent";
import { ClusterType } from "./types";

export interface EngageClient extends EventDispatcher<EngageEventMap> {
  /**
   * Return a cluster by type.
   *
   * @param type cluster type, either "Continuation", "Recommendation" or "Featured".
   */
  getCluster(type: ClusterType): Cluster;

  /**
   * Clears and unpublishes a cluster by type.
   *
   * @param type cluster type, either "Continuation", "Recommendation" or "Featured".
   */
  unpublishCluster(type: ClusterType): void;

  /**
   * Release the client.
   */
  destroy(): void;
}
