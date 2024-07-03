import { Availability, DisplayTimeWindow, Price, RatingSystem, WatchNextType } from "../types";
import { Entity, EntityType } from "./Entity";

/**
 * TvShow.
 */
export interface TvShow extends Entity {
  type: EntityType.TvShow;

  /**
   * The deep link to the provider app to start playing the entity.
   */
  playbackUri?: string;

  /**
   * The deep link to the provider app to show details about the entity.
   */
  infoPageUri?: string;

  /**
   * The air date of the first episode, in epoch milliseconds.
   */
  firstEpisodeAirDate?: number;

  /**
   * The air date of the last episode, in epoch milliseconds.
   */
  lastEpisodeAirDate?: number;

  /**
   * The availability of the entity.
   */
  availability?: Availability;

  /**
   * The entity's price.
   */
  price?: Price;

  /**
   * Season count.
   */
  seasonCount?: number;

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
   * A list of time windows at which the entity is available.
   */
  availabilityTimeWindows?: DisplayTimeWindow[];
}
