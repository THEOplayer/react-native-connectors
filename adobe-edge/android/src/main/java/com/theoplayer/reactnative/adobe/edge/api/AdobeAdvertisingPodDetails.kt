package com.theoplayer.reactnative.adobe.edge.api

/**
 * Advertising Pod details information.
 *
 * @see <a href="https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/advertisingpoddetails.schema.md">Adobe XDM AdvertisingPodDetails Schema</a>
 */
data class AdobeAdvertisingPodDetails(
  // The ID of the ad break.
  val id: String? = null,
  // The friendly name of the Ad Break.
  val friendlyName: String? = null,
  // The index of the ad inside the parent ad break start, for example, the first ad has index 0 and the second ad has index 1.
  val index: Int,
  // The offset of the ad break inside the content, in seconds.
  val offset: Int
)
