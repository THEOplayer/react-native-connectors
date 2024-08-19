import { ClusterEntity, EntityType } from "./Entity";
import { PlatformUri } from "../types";

export interface LiveStream extends ClusterEntity {
  /**
   * The entity type.
   */
  type: EntityType.LiveStream;

  /**
   * A list of platform-specific deep links to the provider app to start playing the entity.
   */
  platformSpecificPlaybackUri?: PlatformUri[];

  /**
   * The stream's broadcaster.
   */
  broadcaster?: string;

  /**
   * The stream's broadcaster icon uri.
   */
  broadcasterIcon?: string;

  /**
   * The start time of the livestream, in epoch milliseconds.
   */
  startTime?: number;

  /**
   * The end time of the livestream, in epoch milliseconds.
   */
  endTime?: number;

  /**
   * The view count.
   */
  viewCount?: string;
}
