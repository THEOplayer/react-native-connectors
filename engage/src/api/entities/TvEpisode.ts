import { Entity, EntityType } from "./Entity";
import { Availability, DisplayTimeWindow, PlatformUri, Price, RatingSystem, WatchNextType } from "../types";

export interface TvEpisode extends Entity {
  type: EntityType.TvEpisode;

  /**
   * The deep link to the provider app to start playing the entity.
   */
  playbackUri?: string;

  /**
   * A list of platform-specific deep links to the provider app to start playing the entity.
   */
  platformSpecificPlaybackUri?: PlatformUri[];

  /**
   * The deep link to the provider app to show details about the entity.
   */
  infoPageUri?: string;

  /**
   * The show title.
   */
  showTitle?: string;

  /**
   * The season title.
   */
  seasonTitle?: string;

  /**
   * The season number as a string.
   */
  seasonNumber?: string;

  /**
   * The episode number.
   */
  episodeNumber?: number;

  /**
   * The episode number as a string that can be displayed.
   */
  episodeDisplayNumber?: string;

  /**
   * The air date of the episode, in epoch milliseconds.
   */
  airDate?: number;

  /**
   * The availability of the entity.
   */
  availability?: Availability;

  /**
   * The entity's price.
   */
  price?: Price;

  /**
   * Duration in milliseconds.
   */
  duration: number;

  /**
   * A list of genres.
   */
  genres?: string[];

  /**
   * A list of content ratings.
   */
  contentRating?: RatingSystem[];

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
   * Whether the next episode is already available.
   */
  isNextEpisodeAvailable?: boolean;

  /**
   * A list of time windows at which the entity is available.
   */
  availabilityTimeWindows?: DisplayTimeWindow[];
}
