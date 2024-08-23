import { PlatformUri, Price, RatingSystem } from "../types";
import { ClusterEntity, EntityType } from "./Entity";

/**
 * Movie.
 */
export interface Movie extends ClusterEntity {
  /**
   * The entity type.
   */
  type: EntityType.Movie;

  /**
   * A list of platform-specific deep links to the provider app to start playing the entity.
   */
  platformSpecificPlaybackUri?: PlatformUri[];

  /**
   * The deep link to the provider app to show details about the entity.
   */
  infoPageUri?: string;

  /**
   * The release date of the entity in epoch milliseconds.
   */
  releaseDate?: number;

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
   * Whether the entity was downloaded on the device for offline viewing.
   */
  downloadedOnDevice?: boolean;
}
