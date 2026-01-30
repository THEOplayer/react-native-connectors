import { CustomData } from './CustomData';

/**
 * Source Metadata.
 *
 * {@link https://developer.bitmovin.com/playback/docs/configuration-analytics}
 */
export interface SourceMetadata {
  /**
   * Configuring the title will allow you to efficiently compare the performance of different content pieces in the Bitmovin Analytics Dashboard.
   * You will see names and titles instead of just numbers and IDs.
   */
  title?: string;

  /**
   * Configuring the videoId is important to ensure consistency within your data framework. We use the videoId to enable filtering and breaking down
   * by videoTitle, hence setting the videoId is a pre-requisite to enable this feature. If no videoId is set, the videoTitle filter cannot be applied
   * to the data.
   * In case there are multiple videoTitle values with the same videoId, we assign the data to each of the different video titles.
   */
  videoId?: string;

  /**
   * Setting the CDN provider in the configuration allows you to use CDN as a breakdown or global filter in the Bitmovin Analytics Dashboard and API.
   * This will enable you to compare the performance of the different CDN providers that you’re using.
   */
  cdnProvider?: string;

  /**
   * Breadcrumb path to show where in the app the user is.
   *
   * @platform ios, android
   */
  path?: string;

  /**
   * Differentiating between Live and VOD content is important, as both are often distributed through different workflows. Auto-detection is only
   * possible once stream metadata is received so explicitly providing this information is helpful in certain cases and improves the accuracy of your
   * data.
   */
  isLive?: boolean;

  /**
   * The customData fields.
   */
  customData?: CustomData;
}
