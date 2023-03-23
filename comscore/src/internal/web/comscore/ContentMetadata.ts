import type { IContentMetadata } from './IContentMetadata';

class CustomLabels {
  /**
   * On Demand Type (vod / catch_up), LIVE: *null, VOD: Mandatory, Adv: Inherited from Content
   */
  oce_odt: string;
  /**
   * Broadcaster Platform, LIVE: Mandatory, VOD: Mandatory, Adv: Mandatory
   */
  oce_bpf: string;
  /**
   * Content additional description (especially for clips), LIVE: Optional, VOD: Mandatory, Adv: Inherited from Content
   */
  oce_ctl: string;
  /**
   * Distribution Mode ID, LIVE: Optional, VOD: Optional, Adv: Optional
   */
  oce_emb: string;
  /**
   * Audience Measurement Project, LIVE: Mandatory, VOD: Mandatory, Adv: Mandatory
   */
  cs_proid: string;
  /**
   *
   */
  name: string;
}

/**
 * Object for stream metadata
 */
export class ContentMetadata {
  /**
   * Stores ns_.analytics.StreamingAnalytics.ContentMetadata()
   * @private
   * @type {*}
   * @memberof ContentMetadata
   */
  private readonly cm: any;

  /**
   * Stores the main content length this is needed in order to fix a bug with the order of events flowing after
   * a preroll on VOD content
   *
   */
  public mainContentLength: number;

  /**
   * @param {IContentMetadata} data
   */
  constructor(data: IContentMetadata) {
    const {
      ns_st_ct,
      ns_st_ci,
      ns_st_cl,
      ns_st_st,
      ns_st_stc,
      networkAffiliateCode,
      ns_st_pu,
      ns_st_pr,
      ns_st_tpr,
      ns_st_ep,
      ns_st_tep,
      ns_st_sn,
      episodeNumber,
      ns_st_ce,
      ns_st_ge,
      genreId,
      carryTvAdvertisement,
      isAudioOnly,
      c3,
      c4,
      c6,
      ns_st_tm,
      ns_st_tdt,
      ns_st_ddt,
      feedType,
      setDeliveryMode,
      deliverySubscriptionType,
      deliveryComposition,
      deliveryAdvertisementCapability,
      ns_st_cmt,
      ns_st_cdm,
      playlistTitle,
      totalSegment,
      clipUrl,
      pixelsWide,
      pixelsHigh,
      oce_odt,
      oce_bpf,
      oce_ctl,
      oce_emb,
      cs_proid,
      name,
    } = data;

    let isLive = false;

    const cm = new (
      window as any
    ).ns_.analytics.StreamingAnalytics.ContentMetadata();
    const {
      BUMPER,
      LIVE,
      LONG_FORM_ON_DEMAND,
      OTHER,
      SHORT_FORM_ON_DEMAND,
      USER_GENERATED_LIVE,
      USER_GENERATED_LONG_FORM_ON_DEMAND,
      USER_GENERATED_SHORT_FORM_ON_DEMAND,
    } = (window as any).ns_.analytics.StreamingAnalytics.ContentMetadata
      .ContentType;

    let mediaType = ns_st_ct;

    //LONG_FORM_ON_DEMAND is considered default when ns_st_ct is undefined
    if (!mediaType) mediaType = LONG_FORM_ON_DEMAND;

    // Fail safe to make sure users do not accidentally pass the
    // vc or VC prefixed values in the data structure
    // comscore will add these automatically when reporting
    mediaType = mediaType.toLowerCase();
    if (mediaType.indexOf('vc') > -1) mediaType = mediaType.replace('vc', '');

    switch (mediaType) {
      case BUMPER:
      case LIVE:
      case LONG_FORM_ON_DEMAND:
      case OTHER:
      case SHORT_FORM_ON_DEMAND:
      case USER_GENERATED_LIVE:
      case USER_GENERATED_LONG_FORM_ON_DEMAND:
      case USER_GENERATED_SHORT_FORM_ON_DEMAND:
        console.log('SETMEDIATYPE TO', mediaType);
        cm.setMediaType(mediaType);
        break;
      default:
        console.log('UNKNOWN MEDIA TYPE:', mediaType);
    }

    isLive = mediaType === LIVE;
    this.isLivecontentMediaType = isLive;

    // The media type is critical for enabling Comscore to distinguish different types of streams.
    //isLive ? cm.setMediaType(LIVE) : cm.setMediaType(LONG_FORM_ON_DEMAND);
    //ns_st_li - what to do with it?
    // Used in report calculations logic to identify individual content. Provide your internal unique identifier for the content
    cm.setUniqueId(ns_st_ci || '0');
    // A value in milliseconds indicating the length of the individual content (the available amount of content).
    this.mainContentLength = ns_st_cl;
    cm.setLength(isLive || !ns_st_cl ? 0 : ns_st_cl);
    //Title of the station or channel for which content was recorded or where content is made available.
    cm.setStationTitle(ns_st_st);

    // Can be used for matching purposes (for example when the station titles are multilingual).
    if (ns_st_stc !== undefined) {
      cm.setStationCode(ns_st_stc);
    }

    // Code to identify station affiliation in cases where the same local TV station call sign is affiliated with multiple national TV networks. Expected to be used alongside setStationTitle( String title ) or setStationCode( String code ).
    if (networkAffiliateCode !== undefined) {
      cm.setNetworkAffiliate(networkAffiliateCode);
    }

    // Collect the consumer-facing brand name of the media publisher that owns the content.
    if (ns_st_pu !== undefined) {
      cm.setPublisherName(ns_st_pu);
    }
    //Top level content title (i.e., the name of the overall program, show, or content series)
    cm.setProgramId(ns_st_tpr || '*null');
    //Top level content title (i.e., the name of the overall program, show, or content series)
    cm.setProgramTitle(ns_st_pr || '*null');
    // Sub level content title (i.e., the title of the specific episode). Can be used with setProgramTitle( String title ) to tag TV shows on program and episode level.
    cm.setEpisodeTitle(ns_st_ep || '*null');
    cm.setEpisodeSeasonNumber(ns_st_sn || '*null');
    //Episode identifier to link the online content to the corresponding Episode of a TV Program (or series). Each time you create a new episode, an Episode ID should be automatically assigned.
    cm.setEpisodeId(ns_st_tep || '*null');
    if (episodeNumber !== undefined) {
      cm.setEpisodeNumber(episodeNumber || '*null');
    }
    cm.classifyAsCompleteEpisode(ns_st_ce || '*null');

    // Genre description. Multiple values can be provided as a comma-separated string.
    cm.setGenreName(ns_st_ge || '*null');

    // Genre ID to be used for matching and grouping purposes (for example when the genres are multilingual).
    if (genreId !== undefined) {
      cm.setGenreId(genreId);
    }

    // Use value true if the streamed content carries the same advertisement load that was used during the TV airing. Otherwise omit or use value false.
    if (carryTvAdvertisement !== undefined) {
      cm.carryTvAdvertisementLoad(true);
    }

    // This metadata helps Comscore identify if the streaming content is audio-only in nature.
    cm.classifyAsAudioStream(isAudioOnly || false);
    cm.setDictionaryClassificationC3(c3 || '*null');
    cm.setDictionaryClassificationC4(c4 || '*null');
    cm.setDictionaryClassificationC6(c6 || '*null');

    if (ns_st_tdt !== undefined && ns_st_tdt !== '*null') {
      let dateOfTvAiring = new Date(ns_st_tdt.toString());
      if (ns_st_tm !== undefined && ns_st_tm !== '*null') {
        dateOfTvAiring = new Date(
          ns_st_tdt.toString() + ' ' + ns_st_tm.toString()
        );
      }

      // The date on which the content aired on TV
      cm.setDateOfTvAiring(
        dateOfTvAiring.getFullYear(),
        dateOfTvAiring.getMonth(),
        dateOfTvAiring.getDay()
      );

      cm.setTimeOfTvAiring(
        dateOfTvAiring.getHours(),
        dateOfTvAiring.getMinutes()
      );
    }
    if (ns_st_ddt !== undefined && ns_st_ddt !== '*null') {
      const dateOfDigitalAiring = new Date(ns_st_ddt.toString());
      //The date on which the content was made available for streaming consumption
      cm.setDateOfDigitalAiring(
        dateOfDigitalAiring.getFullYear(),
        dateOfDigitalAiring.getMonth(),
        dateOfDigitalAiring.getDay()
      );
      cm.setTimeOfDigitalAiring(
        dateOfDigitalAiring.getHours(),
        dateOfDigitalAiring.getMinutes()
      );
    }
    if (feedType !== undefined) {
      cm.setFeedType(feedType);
    }
    if (setDeliveryMode !== undefined) {
      const { LINEAR, ON_DEMAND } = (window as any).ns_.analytics
        .StreamingAnalytics.ContentMetadata.ContentDeliveryMode;
      cm.setDeliveryMode(isLive ? LINEAR : ON_DEMAND);
    }
    if (deliverySubscriptionType !== undefined) {
      cm.setDeliverySubscriptionType(deliverySubscriptionType);
    }
    if (deliveryComposition !== undefined) {
      cm.setDeliveryComposition(deliveryComposition);
    }
    if (deliveryAdvertisementCapability !== undefined) {
      cm.setDeliveryAdvertisementCapability(deliveryAdvertisementCapability);
    }
    if (ns_st_cmt !== undefined) {
      cm.setMediaFormat(ns_st_cmt);
    }
    if (ns_st_cdm !== undefined) {
      cm.setDistributionModel(ns_st_cdm);
    }
    if (playlistTitle !== undefined) {
      cm.setPlaylistTitle(playlistTitle);
    }
    if (totalSegment !== undefined) {
      cm.setTotalSegments(totalSegment);
    }
    if (clipUrl !== undefined) {
      cm.setClipUrl(clipUrl);
    }
    if (pixelsWide !== undefined && pixelsHigh !== undefined) {
      cm.setVideoDimensions(pixelsWide, pixelsHigh);
    }
    const customLabels = new CustomLabels();
    if (oce_odt !== undefined) {
      customLabels.oce_odt = oce_odt;
    }
    if (oce_bpf !== undefined) {
      customLabels.oce_bpf = oce_bpf;
    }
    if (oce_ctl !== undefined) {
      customLabels.oce_ctl = oce_ctl;
    }
    if (oce_emb !== undefined) {
      customLabels.oce_emb = oce_emb;
    }
    if (cs_proid !== undefined) {
      customLabels.cs_proid = cs_proid;
    }
    if (name !== undefined) {
      customLabels.name = name;
    }
    cm.addCustomLabels(customLabels);
    this.cm = cm;
  }

  private readonly isLivecontentMediaType: boolean;
  /**
   *  Returns id the ContentMetadata MediaType is configured as LIVE
   */
  public isLiveContentMediaType(): boolean {
    return this.isLivecontentMediaType;
  }
  /**
   * set duration of stream
   * @param length A value in milliseconds indicating the length of the individual content (the available amount of content).
   * @param isLive specifies if stream is LIVE
   */
  public setLength(length: number, isLive: boolean) {
    this.cm.setLength(isLive || !length ? 0 : length);
  }

  public setContentLength(length: number) {
    this.setLength(length, this.isLivecontentMediaType);
  }

  /**
   * Gets  content metadata
   * @readonly
   * @memberof ContentMetadata
   */
  public getContentMetadata() {
    return this.cm;
  }
}
