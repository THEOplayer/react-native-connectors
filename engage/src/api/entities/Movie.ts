import { Availability, PlatformUri, Price, RatingSystem } from '../types';
import { ClusterEntity, EntityType } from './Entity';

/**
 * An object representing a movie.
 *
 * {@link https://developer.android.com/guide/playcore/engage/watch#movieentity | MovieEntity}.
 */
export interface Movie extends ClusterEntity {
  /**
   * The entity type.
   */
  type: EntityType.Movie;

  /**
   * The deep link to the provider app to start playing the entity.
   */
  playbackUri: string;

  /**
   * The release date of the entity in epoch milliseconds.
   */
  releaseDate: number;

  /**
   * The availability of the entity.
   */
  availability: Availability;

  /**
   * Duration in milliseconds.
   */
  duration: number;

  /**
   * A list of genres.
   */
  genres: string[];

  /**
   * A list of content ratings.
   */
  contentRating: RatingSystem[];

  /**
   * A list of platform-specific deep links to the provider app to start playing the entity.
   */
  platformSpecificPlaybackUri?: PlatformUri[];

  /**
   * The deep link to the provider app to show details about the entity.
   */
  infoPageUri?: string;

  /**
   * The entity's price.
   */
  price?: Price;

  /**
   * Whether the entity was downloaded on the device for offline viewing.
   */
  downloadedOnDevice?: boolean;
}
