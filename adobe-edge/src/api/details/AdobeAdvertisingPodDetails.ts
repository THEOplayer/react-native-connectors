/**
 * Advertising Pod details information.
 *
 * https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/advertisingpoddetails.schema.md
 */
export interface AdobeAdvertisingPodDetails {
  // The ID of the ad break.
  ID?: string;

  // The friendly name of the Ad Break.
  friendlyName?: string;

  // The index of the ad inside the parent ad break start, for example, the first ad has index 0 and the second ad
  // has index 1.
  index: number;

  // The offset of the ad break inside the content, in seconds.
  offset: number;
}
