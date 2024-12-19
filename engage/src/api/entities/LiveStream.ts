import { ClusterEntity, EntityType } from './Entity';
import { PlatformUri } from '../types';

/**
 * An object representing a live streaming video.
 *
 * {@link https://developer.android.com/guide/playcore/engage/watch#livestreamingvideoentity | LiveStreamVideoEntity}.
 */
export interface LiveStream extends ClusterEntity {
  /**
   * The entity type.
   */
  type: EntityType.LiveStream;

  /**
   * The deep link to the provider app to start playing the entity.
   */
  playbackUri: string;

  /**
   * The stream's broadcaster.
   */
  broadcaster: string;

  /**
   * A list of platform-specific deep links to the provider app to start playing the entity.
   */
  platformSpecificPlaybackUri?: PlatformUri[];

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
}
