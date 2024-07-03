import { DisplayTimeWindow } from "../types/DisplayTimeWindow";
import { RatingSystem } from "../types/RatingSystem";
import { Availability } from "../types/Availability";
import { WatchNextType } from "../types/WatchNextType";
import { Price } from "../types/Price";
import { Entity, EntityType } from "./Entity";

export interface TvSeason extends Entity {
  type: EntityType.TvSeason;

  /**
   * The deep link to the provider app to start playing the entity.
   */
  playbackUri?: string;

  /**
   * The deep link to the provider app to show details about the entity.
   */
  infoPageUri?: string;

  /**
   * The season number.
   */
  seasonNumber?: number;

  /**
   * The season number as a string that can be displayed.
   */
  seasonDisplayNumber?: string;

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
   * Episode count.
   */
  episodeCount?: number;

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
