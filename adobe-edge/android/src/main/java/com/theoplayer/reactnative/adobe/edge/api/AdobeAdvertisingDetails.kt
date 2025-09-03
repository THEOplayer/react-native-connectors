package com.theoplayer.reactnative.adobe.edge.api

/**
 * Advertising details information.
 *
 * @see <a href="https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/advertisingdetails.schema.md">Adobe XDM AdvertisingDetails Schema</a>
 */
data class AdobeAdvertisingDetails(
  // ID of the ad. Any integer and/or letter combination.
  val id: String? = null,
  // Company/Brand whose product is featured in the ad.
  val advertiser: String? = null,
  // ID of the ad campaign.
  val campaignID: String? = null,
  // ID of the ad creative.
  val creativeID: String? = null,
  // URL of the ad creative.
  val creativeURL: String? = null,
  // Ad is completed.
  val isCompleted: Boolean? = null,
  // Ad is started.
  val isStarted: Boolean? = null,
  // Length of video ad in seconds.
  val length: Int,
  // Friendly name of the ad. In reporting, “Ad Name” is the classification and “Ad Name (variable)” is the eVar.
  val name: String,
  // Placement ID of the ad.
  val placementID: String? = null,
  // The name of the player responsible for rendering the ad.
  val playerName: String,
  // The index of the ad inside the parent ad start, for example, the first ad has index 0 and the second ad has index 1.
  val podPosition: Int,
  // ID of the ad site.
  val siteID: String? = null,
  // The total amount of time, in seconds, spent watching the ad (i.e., the number of seconds played).
  val timePlayed: Int? = null
)
