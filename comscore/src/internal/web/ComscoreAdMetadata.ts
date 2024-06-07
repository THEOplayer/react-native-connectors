/* eslint-disable @typescript-eslint/no-inferrable-types */
import { AD_TYPES, logDebug } from './Utils';
import type { ContentMetadata } from './ComscoreContentMetadata';
import * as analytics from './sdk/comscore';

export class AdMetadata {
  /**
   * Stores ns_.analytics.StreamingAnalytics.AdvertisementMetadata()
   *
   * @private
   * @type {*}
   * @memberof AdMetadata
   */
  private readonly cm: any;

  /**
   * sets ad metadata
   * @param {Boolean} isAudio Use value true if the advertisement is audio-only, rather than video (with or without audio). Otherwise omit or use value false, Comscore API: classifyAsAudioStream( Boolean value )
   * @param {Object} customLabels a collection of custom metadata name/value pair, Comscore API: addCustomLabels( Object labels )
   * @param {analytics.StreamingAnalytics.AdvertisementMetadata.AdvertisementDeliveryType} deliveryType Specify the mechanism use to deliver an advertisement, Comscore API: setDeliveryType( value )
   * @param {analytics.StreamingAnalytics.AdvertisementMetadata.AdvertisementOwner} owner Specify who is monetizing the advertisement, Comscore API: setOwner( value )
   * @param {String} serverCampaignId Provide an ID for the advertisement campaign being delivered, Comscore API: setServerCampaignId( String id )
   * @param {String} placementId Provide an ID for the placement the advertisement campaign is being delivered to, Comscore API: setPlacementId( String id )
   * @param {String} siteId Provide an ID for the site the advertisement campaign is being delivered to, Comscore API: setSiteId( String id )
   * @param {String} serverName Provide a name for the advertising server/provider, Comscore API: setServer( String name )
   * @param {String} title Provide a title for the advertisement (i.e., the name of the campaign or creative), Comscore API: setTitle( String title )
   * @param {String} callToActionUrl Provide the URL which will be loaded when the advertisement is clicked on, Comscore API: setCallToActionUrl( String url )
   * @param {String} clipUrl The URL (or path/filename) of the advertisement stream, Comscore API: setClipUrl( String url )
   * @param {Number} pixelsWide Advertisement video width, Comscore API: setVideoDimensions( int pixelsWide, int pixelsHigh )
   * @param {Number} pixelsHigh Advertisement video height, Comscore API: setVideoDimensions( int pixelsWide, int pixelsHigh )
   */
  constructor(
    isAudio: boolean = false,
    customLabels: string = null,
    deliveryType: string = null,
    owner: string = null,
    serverCampaignId: string = null,
    placementId: string = null,
    siteId: string = null,
    serverName: string = null,
    title: string = null,
    callToActionUrl: string = null,
    clipUrl: string = null,
    pixelsWide: number = 0,
    pixelsHigh: number = 0,
  ) {
    const cm = new analytics.StreamingAnalytics.AdvertisementMetadata();

    if (deliveryType) {
      cm.setDeliveryType(deliveryType);
    }
    if (owner) {
      cm.setOwner(owner);
    }
    cm.classifyAsAudioStream(isAudio);
    if (serverCampaignId) {
      cm.setServerCampaignId(serverCampaignId);
    }
    if (placementId) {
      cm.setPlacementId(placementId);
    }
    if (siteId) {
      cm.setSiteId(siteId);
    }
    if (serverName) {
      cm.setServer(serverName);
    }
    if (title) {
      cm.setTitle(title);
    }
    if (callToActionUrl) {
      cm.setCallToActionUrl(callToActionUrl);
    }
    if (clipUrl) {
      cm.setClipUrl(clipUrl);
    }
    if (pixelsWide && pixelsHigh) {
      cm.setVideoDimensions(pixelsWide, pixelsHigh);
    }
    if (customLabels) {
      cm.addCustomLabels(customLabels); // Can be used to specify a collection of custom metadata name/value pairs.
    }
    this.cm = cm;
  }

  /**
   * Sets media type based on ad type and if stream is live
   * @param adType ad type: preroll, midroll, postroll
   * @param isLive specifies if stream is LIVE
   */
  public setMediaType(adType: string, isLive: boolean) {
    const { ON_DEMAND_PRE_ROLL, ON_DEMAND_MID_ROLL, ON_DEMAND_POST_ROLL, LIVE } =
      analytics.StreamingAnalytics.AdvertisementMetadata.AdvertisementType;

    let cm_AdType = adType;
    if (isLive) {
      cm_AdType = LIVE; //this.cm.setMediaType(LIVE);
    } else {
      switch (adType) {
        case AD_TYPES.PREROLL:
          cm_AdType = ON_DEMAND_PRE_ROLL; //this.cm.setMediaType(ON_DEMAND_PRE_ROLL);
          break;
        case AD_TYPES.MIDROLL:
          cm_AdType = ON_DEMAND_MID_ROLL; //this.cm.setMediaType(ON_DEMAND_MID_ROLL);
          break;
        case AD_TYPES.POSTROLL:
          cm_AdType = ON_DEMAND_POST_ROLL; //this.cm.setMediaType(ON_DEMAND_POST_ROLL);
          break;

        default:
          break;
      }
    }
    //FIX issue 12 17 19
    logDebug('AdMetadata - setMediaType', cm_AdType);
    this.cm.setMediaType(cm_AdType);
  }

  /**
   * sets the analytics.StreamingAnalytics.ContentMetadata of the content which the advertisement is served for. Omit for cases where player is not aware which content the advertisement is playing for.
   * @param {ContentMetadata} relatedContent , Comscore API: setRelatedContentMetadata(contentMetadataObject )
   */
  public setRelatedContentMetadata(relatedContent: ContentMetadata) {
    logDebug('AdMetadata - setRelatedContentMetadata', relatedContent.getContentMetadata());
    this.cm.setRelatedContentMetadata(relatedContent.getContentMetadata());
  }

  /**
   * Sets a unique identifier of the advertisement
   * @param uniqueId  a unique identifier of the advertisement Comscore API: setUniqueId( String id )
   * @memberof AdMetadata
   */
  public setId(uniqueId: string) {
    const id = uniqueId || '*null';
    logDebug('AdMetadata - setId', id);
    this.cm.setUniqueId(id);
  }

  /**
   * sets duration of ad
   * @memberof AdMetadata, Comscore API: setLength( int length )
   */
  public setLength(length: number) {
    logDebug('AdMetadata - setLength', length);
    this.cm.setLength(length);
  }

  /**
   * set Custom Auditel labels
   * @param {String} oce_skp Advertisement's skippable duration, Adv: Mandatory
   * @memberof ContentMetadata
   */
  public addCustomLabels(oce_skp: string) {
    let customLabels: { [key: string]: string };
    if (oce_skp) {
      customLabels.oce_skp = oce_skp;
    }
    logDebug('AdMetadata - addCustomLabels', customLabels);
    this.cm.addCustomLabels(customLabels);
  }

  /**
   * Gets  content metadata
   * @readonly
   * @memberof AdContentMetadata
   */
  public getAdContentMetadata() {
    return this.cm;
  }

  public static clone(old: AdMetadata): AdMetadata {
    return new AdMetadata(
      old.cm.isAudio,
      old.cm.customLabels,
      old.cm.deliveryType,
      old.cm.owner,
      old.cm.serverCampaignId,
      old.cm.placementId,
      old.cm.siteId,
      old.cm.serverName,
      old.cm.title,
      old.cm.callToActionUrl,
      old.cm.clipUrl,
      old.cm.pixelsWide,
      old.cm.pixelsHigh,
    );
  }
}
