import { Cluster, ClusterConfig } from "./cluster";
import { EventDispatcher } from "../internal/event/EventDispatcher";
import { EngageEventMap } from "./EngageEvent";
import { AccountProfile, ClusterType } from "./types";
import { SignIn } from "./entities";
import { Subscription } from "./entities/Subscription";

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
   * Provide a SignIn entity.
   */
  setSignInEntity(entity?: SignIn): void;

  /**
   * Set or update the subscription information whenever the user performs one of the following actions:
   * - Log in to your app;
   * - If your app supports single account with multiple profiles, user switches between profiles;
   * - Purchase a new subscription;
   * - Upgrades an existing subscription;
   * - Existing user subscription or tiered subscription expires.
   */
  setSubscription(accountProfile: AccountProfile, subscription?: Subscription): void;

  /**
   * Release the client.
   */
  destroy(): void;
}
