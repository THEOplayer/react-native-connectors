import { RatingSystem } from "../types/RatingSystem";
import { Price } from "../types/Price";
import { ClusterEntity, EntityType } from "./Entity";

export interface TvSeason extends ClusterEntity {
  /**
   * The entity type.
   */
  type: EntityType.TvSeason;

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
}
