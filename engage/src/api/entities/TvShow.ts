import { Price, RatingSystem } from "../types";
import { ClusterEntity, EntityType } from "./Entity";

/**
 * TvShow.
 */
export interface TvShow extends ClusterEntity {
  /**
   * The entity type.
   */
  type: EntityType.TvShow;

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
}
