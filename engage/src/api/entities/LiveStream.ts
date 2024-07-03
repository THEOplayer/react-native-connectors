import { Entity, EntityType } from "./Entity";
import { Availability, DisplayTimeWindow, PlatformUri, Price, RatingSystem, WatchNextType } from "../types";

export interface LiveStream extends Entity {
  type: EntityType.LiveStream;

  /**
   * The deep link to the provider app to start playing the entity.
   */
  playbackUri?: string;

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

  /**
   * The availability of the entity.
   */
  availability?: Availability;

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
   * A list of time windows at which the entity is available.
   */
  availabilityTimeWindows?: DisplayTimeWindow[];
}
