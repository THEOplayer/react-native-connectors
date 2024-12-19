import { ClusterEntity, EntityType } from './Entity';
import { PlatformUri } from '../types';

/**
 * The VideoClipEntity object represents a video entity coming from social media, such as TikTok or YouTube.
 *
 * {@link https://developer.android.com/guide/playcore/engage/watch#videoclipentity | VideoClipEntity}.
 */
export interface VideoClip extends ClusterEntity {
  /**
   * The entity type.
   */
  type: EntityType.VideoClip;

  /**
   * The deep link to the provider app to start playing the entity.
   */
  playbackUri: string;

  /**
   * The time at which this entity was created. In epoch milliseconds.
   */
  createdTime: number;

  /**
   * Duration in milliseconds.
   */
  duration: number;

  /**
   * The creator of this entity.
   */
  creator: string;

  /**
   * A list of platform-specific deep links to the provider app to start playing the entity.
   */
  platformSpecificPlaybackUri?: PlatformUri[];

  /**
   * The view count.
   */
  viewCount?: string;

  /**
   * Whether the entity was downloaded on the device for offline viewing.
   */
  downloadedOnDevice?: boolean;

  /**
   * The creator's image uri.
   */
  creatorImage?: string;
}
