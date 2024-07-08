import { AccountProfile, ClusterConfig } from "@theoplayer/react-native-engage";

export interface ContinuationClusterConfig extends ClusterConfig {
  /**
   * To allow a personalized continue watching experience, you need to provide account and profile information.
   */
  accountProfile: AccountProfile | undefined;

  /**
   * Controls whether a user's ContinuationCluster data should be synchronized across their devices
   * (TV, phone, tablet, etc.).
   *
   * If `true`, cross-device syncing is enabled to leverage the full benefits of continue watching.
   *
   * @default `true`.
   */
  syncAcrossDevices: boolean;
}
