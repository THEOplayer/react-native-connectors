/**
 * Advertising details information.
 *
 * https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/advertisingdetails.schema.md
 */
export interface AdobeAdvertisingDetails {
  // ID of the ad. Any integer and/or letter combination.
  ID?: string;

  // Company/Brand whose product is featured in the ad.
  advertiser?: string;

  // ID of the ad campaign.
  campaignID?: string;

  // ID of the ad creative.
  creativeID?: string;

  // URL of the ad creative.
  creativeURL?: string;

  // Ad is completed.
  isCompleted?: boolean;

  // Ad is started.
  isStarted?: boolean;

  // Length of video ad in seconds.
  length: number;

  // Friendly name of the ad. In reporting, “Ad Name” is the classification and “Ad Name (variable)” is the eVar.
  name: string;

  // Placement ID of the ad.
  placementID?: string;

  // The name of the player responsible for rendering the ad.
  playerName: string;

  // The index of the ad inside the parent ad start, for example, the first ad has index 0 and the second ad has
  // index 1.
  podPosition: number;

  // ID of the ad site.
  siteID?: string;

  // The total amount of time, in seconds, spent watching the ad (i.e., the number of seconds played).
  timePlayed?: number;
}
