import { Availability, DisplayTimeWindow, Poster, WatchNextType } from '../types';

export enum EntityType {
  LiveStream = 'liveStream',
  Movie = 'movie',
  TvEpisode = 'tvEpisode',
  TvSeason = 'tvSeason',
  TvShow = 'tvShow',
  VideoClip = 'videoClip',
  SignIn = 'signIn',
  Subscription = 'subscription',
}

/**
 * Entity base type.
 */
export interface Entity {
  /**
   * The entity's type.
   */
  type: EntityType;
}

/**
 * An Entity that can be part of a cluster, "Continuation", "Recommendation" or "Featured".
 */
export interface ClusterEntity extends Entity {
  /**
   * The optional entity id.
   */
  id?: string;

  /**
   * The entity's name or title.
   */
  name: string;

  /**
   * At least one image is required, and must be provided with an aspect ratio.
   * (Landscape is preferred but passing both portrait and landscape images for different scenarios is recommended.)
   */
  posters: Poster[];

  /**
   * The deep link to the provider app to start playing the entity.
   */
  playbackUri?: string;

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
   * WatchNext type in case the entity is in a continuation cluster.
   * Either `continue`, `new`, `next` or `watchlist`.
   */
  watchNextType?: WatchNextType;

  /**
   * A list of time windows at which the entity is available.
   */
  availabilityTimeWindows?: DisplayTimeWindow[];
}
