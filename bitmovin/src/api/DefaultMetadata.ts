import { CustomData } from './CustomData';

/**
 * DefaultMetadata can be set during player creation, and this contains source independent data.
 *
 * {@link https://developer.bitmovin.com/playback/docs/configuration-analytics}
 */
export interface DefaultMetadata {
  /**
   * Setting the CDN provider in the configuration allows you to use CDN as a breakdown or global filter in the Bitmovin Analytics Dashboard and API.
   * This will enable you to compare the performance of the different CDN providers that you’re using.
   */
  cdnProvider?: string;

  /**
   * The customUserId fields.
   */
  customUserId?: string;

  /**
   * The customData fields.
   */
  customData?: CustomData;
}
