import { Entity, EntityType } from "./Entity";
import { Availability, DisplayTimeWindow, PlatformUri, WatchNextType } from "../types";

export interface VideoClip extends Entity  {
  type: EntityType.VideoClip;

  /**
   * The deep link to the provider app to start playing the entity.
   */
  playbackUri?: string;

  /**
   * A list of platform-specific deep links to the provider app to start playing the entity.
   */
  platformSpecificPlaybackUri?: PlatformUri[];

  /**
   * The view count.
   */
  viewCount?: string;

  /**
   * The availability of the entity.
   */
  availability?: Availability;

  /**
   * Duration in milliseconds.
   */
  duration: number;

  /**
   * WatchNext type in case the entity is in a continuation cluster.
   * Either `continue`, `new`, `next` or `watchlist`.
   */
  watchNextType?: WatchNextType;

  /**
   * The last engagement time in milliseconds.
   * Must be provided when the item is in the Continuation cluster.
   */
  lastEngagementTime?: number;

  /**
   * The last playback position in milliseconds.
   * Must be provided when the item is in the Continuation cluster and WatchNextType is CONTINUE.
   * In epoch milliseconds.
   */
  lastPlaybackPosition?: number;

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

  /**
   * A list of time windows at which the entity is available.
   */
  availabilityTimeWindows?: DisplayTimeWindow[];
}
