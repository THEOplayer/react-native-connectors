import {  ClusterConfig } from "./Cluster";

export interface RecommendationClusterConfig extends ClusterConfig {
  /**
   * The title used for a recommendations cluster.
   *
   * @default `"Because you enjoyed"`.
   */
  recommendationTitle?: string;

  /**
   * The subtitle used for a recommendations cluster.
   *
   * @default `""` (empty).
   */
  recommendationSubtitle?: string;

  /**
   * actionUri
   */
  actionUri?: string;

  /**
   * actionText
   */
  actionText?: string;
}
