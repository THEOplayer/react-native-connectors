import { ClusterEntity, EntityType } from "./Entity";
import { PlatformUri, Price, RatingSystem } from "../types";

export interface TvEpisode extends ClusterEntity {
  /**
   * The entity type.
   */
  type: EntityType.TvEpisode;

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

  /**
   * Whether the next episode is already available.
   */
  isNextEpisodeAvailable?: boolean;
}
