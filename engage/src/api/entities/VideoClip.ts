import { ClusterEntity, EntityType } from "./Entity";
import { PlatformUri } from "../types";

export interface VideoClip extends ClusterEntity  {
  /**
   * The entity type.
   */
  type: EntityType.VideoClip;

  /**
   * A list of platform-specific deep links to the provider app to start playing the entity.
   */
  platformSpecificPlaybackUri?: PlatformUri[];

  /**
   * The view count.
   */
  viewCount?: string;

  /**
   * Duration in milliseconds.
   */
  duration: number;

  /**
   * Whether the entity was downloaded on the device for offline viewing.
   */
  downloadedOnDevice?: boolean;

  /**
   * The time at which this entity was created. In epoch milliseconds.
   */
  createdTime?: number;

  /**
   * The creator of this entity.
   */
  creator?: string;

  /**
   * The creator's image uri.
   */
  creatorImage?: string;
}
