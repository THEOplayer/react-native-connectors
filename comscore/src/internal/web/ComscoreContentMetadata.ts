import * as analytics from './sdk/comscore';
import {
  ComscoreDeliveryAdvertisementCapability,
  ComscoreDeliveryComposition,
  ComscoreDeliveryMode,
  ComscoreDeliverySubscriptionType,
  ComscoreDistributionModel,
  ComscoreMediaFormat,
  ComscoreMediaType,
  ComscoreMetadata,
} from '../../api/ComscoreMetadata';
import { logDebug } from './Utils';

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
  private readonly isLivecontentMediaType: boolean;
  /**
   * Stores the main content length this is needed in order to fix a bug with the order of events flowing after
   * a preroll on VOD content
   *
   */
  public mainContentLength: number;

  /**
   * @param {ComscoreMetadata} data
   */
  constructor(data: ComscoreMetadata) {
    const {
      mediaType,
      uniqueId,
      length,
      c3,
      c4,
      c6,
      stationTitle,
      stationCode,
      networkAffiliate,
      publisherName,
      programTitle,
      programId,
      episodeTitle,
      episodeId,
      episodeSeasonNumber,
      episodeNumber,
      genreName,
      genreId,
      carryTvAdvertisementLoad,
      classifyAsCompleteEpisode,
      dateOfProduction,
      timeOfProduction,
      dateOfTvAiring,
      timeOfTvAiring,
      dateOfDigitalAiring,
      timeOfDigitalAiring,
      feedType,
      classifyAsAudioStream,
      deliveryMode,
      deliverySubscriptionType,
      deliveryComposition,
      deliveryAdvertisementCapability,
      mediaFormat,
      distributionModel,
      playlistTitle,
      totalSegments,
      clipUrl,
      videoDimension,
      customLabels,
    } = data;

    const isLive = mediaType === ComscoreMediaType.live;
    this.isLivecontentMediaType = isLive; //TODO check wat ze hier nog mee doen
    // The media type is critical for enabling Comscore to distinguish different types of streams.
    //isLive ? cm.setMediaType(LIVE) : cm.setMediaType(LONG_FORM_ON_DEMAND);
    //ns_st_li - what to do with it?
    this.mainContentLength = length;

    const cm = new analytics.StreamingAnalytics.ContentMetadata();
    cm.setMediaType(this.mapMediaType(mediaType));
    cm.setUniqueId(uniqueId || '0'); // Used in report calculations logic to identify individual content. Provide your internal unique identifier for the content
    cm.setLength(isLive || !length ? 0 : length); // A value in milliseconds indicating the length of the individual content (the available amount of content).
    cm.setDictionaryClassificationC3(c3 || '*null');
    cm.setDictionaryClassificationC4(c4 || '*null');
    cm.setDictionaryClassificationC6(c6 || '*null');
    cm.setStationTitle(stationTitle); // Title of the station or channel for which content was recorded or where content is made available.
    if (stationCode !== undefined) {
      cm.setStationCode(stationCode); // Can be used for matching purposes (for example when the station titles are multilingual).
    }
    if (networkAffiliate !== undefined) {
      cm.setNetworkAffiliate(networkAffiliate); // Code to identify station affiliation in cases where the same local TV station call sign is affiliated with multiple national TV networks. Expected to be used alongside setStationTitle( String title ) or setStationCode( String code ).
    }
    if (publisherName !== undefined) {
      cm.setPublisherName(publisherName); // Collect the consumer-facing brand name of the media publisher that owns the content.
    }
    cm.setProgramTitle(programTitle || '*null'); // Top level content title (i.e., the name of the overall program, show, or content series)
    cm.setProgramId(programId || '*null'); // Top level content id
    cm.setEpisodeTitle(episodeTitle || '*null'); // Sub level content title (i.e., the title of the specific episode). Can be used with setProgramTitle( String title ) to tag TV shows on program and episode level.
    cm.setEpisodeId(episodeId || '*null'); // Episode identifier to link the online content to the corresponding Episode of a TV Program (or series). Each time you create a new episode, an Episode ID should be automatically assigned.
    cm.setEpisodeSeasonNumber(episodeSeasonNumber || '*null');
    if (episodeNumber !== undefined) {
      cm.setEpisodeNumber(episodeNumber || '*null');
    }
    cm.setGenreName(genreName || '*null'); // Genre description. Multiple values can be provided as a comma-separated string.
    if (genreId !== undefined) {
      cm.setGenreId(genreId); // Genre ID to be used for matching and grouping purposes (for example when the genres are multilingual).
    }
    if (carryTvAdvertisementLoad !== undefined) {
      cm.carryTvAdvertisementLoad(true); // Use value true if the streamed content carries the same advertisement load that was used during the TV airing. Otherwise omit or use value false.
    }
    cm.classifyAsCompleteEpisode(classifyAsCompleteEpisode || '*null');
    if (dateOfProduction !== undefined) {
      const { year, month, day } = dateOfProduction;
      cm.setDateOfProduction(year, month, day);
    }
    if (timeOfProduction !== undefined) {
      const { hours, minutes } = timeOfProduction;
      cm.setTimeOfProduction(hours, minutes);
    }
    if (dateOfTvAiring !== undefined) {
      const { year, month, day } = dateOfTvAiring;
      cm.setDateOfTvAiring(year, month, day);
    }
    if (timeOfTvAiring !== undefined) {
      const { hours, minutes } = timeOfTvAiring;
      cm.setTimeOfTvAiring(hours, minutes);
    }
    if (dateOfDigitalAiring !== undefined) {
      const { year, month, day } = dateOfDigitalAiring;
      cm.setDateOfDigitalAiring(year, month, day);
    }
    if (timeOfDigitalAiring !== undefined) {
      const { hours, minutes } = timeOfDigitalAiring;
      cm.setTimeOfDigitalAiring(hours, minutes);
    }
    if (feedType !== undefined) {
      cm.setFeedType(feedType);
    }
    cm.classifyAsAudioStream(classifyAsAudioStream || false); // This metadata helps Comscore identify if the streaming content is audio-only in nature.
    if (deliveryMode !== undefined) {
      cm.setDeliveryMode(this.mapDeliveryMode(deliveryMode));
    }
    if (deliverySubscriptionType !== undefined) {
      cm.setDeliverySubscriptionType(this.mapDeliverySubcriptionType(deliverySubscriptionType));
    }
    if (deliveryComposition !== undefined) {
      cm.setDeliveryComposition(this.mapDeliveryComposition(deliveryComposition));
    }
    if (deliveryAdvertisementCapability !== undefined) {
      cm.setDeliveryAdvertisementCapability(this.mapDeliveryAdvertisementCapability(deliveryAdvertisementCapability));
    }
    if (mediaFormat !== undefined) {
      cm.setMediaFormat(this.mapMediaFormat(mediaFormat));
    }
    if (distributionModel !== undefined) {
      cm.setDistributionModel(this.mapDistributionModel(distributionModel));
    }
    if (playlistTitle !== undefined) {
      cm.setPlaylistTitle(playlistTitle);
    }
    if (totalSegments !== undefined) {
      cm.setTotalSegments(totalSegments);
    }
    if (clipUrl !== undefined) {
      cm.setClipUrl(clipUrl);
    }
    if (videoDimension !== undefined) {
      cm.setVideoDimensions(videoDimension.width, videoDimension.height);
    }
    cm.addCustomLabels(customLabels);
    this.cm = cm;
  }

  /**
   * Gets content metadata
   * @readonly
   * @memberof ContentMetadata
   */
  public getContentMetadata() {
    return this.cm;
  }

  /**
   *  Returns if the ContentMetadata MediaType is configured as LIVE
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
    const cmLength = isLive || !length ? 0 : length;
    logDebug('ContentMetadata - setLength', cmLength);
    this.cm.setLength(cmLength);
  }

  public setContentLength(length: number) {
    logDebug('ContentMetadata - setContentLength', length);
    this.setLength(length, this.isLivecontentMediaType);
  }

  private mapMediaType(mediaType: ComscoreMediaType) {
    switch (mediaType) {
      case ComscoreMediaType.longFormOnDemand:
        return analytics.StreamingAnalytics.ContentMetadata.ContentType.LONG_FORM_ON_DEMAND;
      case ComscoreMediaType.shortFormOnDemand:
        return analytics.StreamingAnalytics.ContentMetadata.ContentType.SHORT_FORM_ON_DEMAND;
      case ComscoreMediaType.live:
        return analytics.StreamingAnalytics.ContentMetadata.ContentType.LIVE;
      case ComscoreMediaType.userGeneratedLongFormOnDemand:
        return analytics.StreamingAnalytics.ContentMetadata.ContentType.USER_GENERATED_LONG_FORM_ON_DEMAND;
      case ComscoreMediaType.userGeneratedShortFormOnDemand:
        return analytics.StreamingAnalytics.ContentMetadata.ContentType.USER_GENERATED_SHORT_FORM_ON_DEMAND;
      case ComscoreMediaType.userGeneratedLive:
        return analytics.StreamingAnalytics.ContentMetadata.ContentType.USER_GENERATED_LIVE;
      case ComscoreMediaType.bumper:
        return analytics.StreamingAnalytics.ContentMetadata.ContentType.BUMPER;
      case ComscoreMediaType.other:
        return analytics.StreamingAnalytics.ContentMetadata.ContentType.OTHER;
      default:
        console.log('UNKNOWN MEDIA TYPE:', mediaType);
        return analytics.StreamingAnalytics.ContentMetadata.ContentType.LONG_FORM_ON_DEMAND;
    }
  }

  private mapDeliveryMode(deliveryMode: ComscoreDeliveryMode) {
    switch (deliveryMode) {
      case ComscoreDeliveryMode.linear:
        return analytics.StreamingAnalytics.ContentMetadata.ContentDeliveryMode.LINEAR;
      case ComscoreDeliveryMode.ondemand:
        return analytics.StreamingAnalytics.ContentMetadata.ContentDeliveryMode.ON_DEMAND;
    }
  }

  private mapDeliverySubcriptionType(deliverySubscriptionType: ComscoreDeliverySubscriptionType) {
    switch (deliverySubscriptionType) {
      case ComscoreDeliverySubscriptionType.traditionalMvpd:
        return analytics.StreamingAnalytics.ContentMetadata.ContentDeliverySubscriptionType.TRADITIONAL_MVPD;
      case ComscoreDeliverySubscriptionType.virtualMvpd:
        return analytics.StreamingAnalytics.ContentMetadata.ContentDeliverySubscriptionType.VIRTUAL_MVPD;
      case ComscoreDeliverySubscriptionType.subscription:
        return analytics.StreamingAnalytics.ContentMetadata.ContentDeliverySubscriptionType.SUBSCRIPTION;
      case ComscoreDeliverySubscriptionType.transactional:
        return analytics.StreamingAnalytics.ContentMetadata.ContentDeliverySubscriptionType.TRANSACTIONAL;
      case ComscoreDeliverySubscriptionType.advertising:
        return analytics.StreamingAnalytics.ContentMetadata.ContentDeliverySubscriptionType.ADVERTISING;
      case ComscoreDeliverySubscriptionType.premium:
        return analytics.StreamingAnalytics.ContentMetadata.ContentDeliverySubscriptionType.PREMIUM;
    }
  }

  private mapDeliveryComposition(deliveryComposition: ComscoreDeliveryComposition) {
    switch (deliveryComposition) {
      case ComscoreDeliveryComposition.clean:
        return analytics.StreamingAnalytics.ContentMetadata.ContentDeliveryComposition.CLEAN;
      case ComscoreDeliveryComposition.embed:
        return analytics.StreamingAnalytics.ContentMetadata.ContentDeliveryComposition.EMBED;
    }
  }

  private mapDeliveryAdvertisementCapability(deliveryAdvertisementCapability: ComscoreDeliveryAdvertisementCapability) {
    switch (deliveryAdvertisementCapability) {
      case ComscoreDeliveryAdvertisementCapability.none:
        return analytics.StreamingAnalytics.ContentMetadata.ContentDeliveryAdvertisementCapability.NONE;
      case ComscoreDeliveryAdvertisementCapability.dynamicLoad:
        return analytics.StreamingAnalytics.ContentMetadata.ContentDeliveryAdvertisementCapability.DYNAMIC_LOAD;
      case ComscoreDeliveryAdvertisementCapability.dynamicReplacement:
        return analytics.StreamingAnalytics.ContentMetadata.ContentDeliveryAdvertisementCapability.DYNAMIC_REPLACEMENT;
      case ComscoreDeliveryAdvertisementCapability.linear1day:
        return analytics.StreamingAnalytics.ContentMetadata.ContentDeliveryAdvertisementCapability.LINEAR_1DAY;
      case ComscoreDeliveryAdvertisementCapability.linear2day:
        return analytics.StreamingAnalytics.ContentMetadata.ContentDeliveryAdvertisementCapability.LINEAR_2DAY;
      case ComscoreDeliveryAdvertisementCapability.linear3day:
        return analytics.StreamingAnalytics.ContentMetadata.ContentDeliveryAdvertisementCapability.LINEAR_3DAY;
      case ComscoreDeliveryAdvertisementCapability.linear4day:
        return analytics.StreamingAnalytics.ContentMetadata.ContentDeliveryAdvertisementCapability.LINEAR_4DAY;
      case ComscoreDeliveryAdvertisementCapability.linear5day:
        return analytics.StreamingAnalytics.ContentMetadata.ContentDeliveryAdvertisementCapability.LINEAR_5DAY;
      case ComscoreDeliveryAdvertisementCapability.linear6day:
        return analytics.StreamingAnalytics.ContentMetadata.ContentDeliveryAdvertisementCapability.LINEAR_6DAY;
      case ComscoreDeliveryAdvertisementCapability.linear7day:
        return analytics.StreamingAnalytics.ContentMetadata.ContentDeliveryAdvertisementCapability.LINEAR_7DAY;
    }
  }

  private mapMediaFormat(mediaFormat: ComscoreMediaFormat) {
    switch (mediaFormat) {
      case ComscoreMediaFormat.fullContentEpisode:
        return analytics.StreamingAnalytics.ContentMetadata.ContentMediaFormat.FULL_CONTENT_EPISODE;
      case ComscoreMediaFormat.fullContentMovie:
        return analytics.StreamingAnalytics.ContentMetadata.ContentMediaFormat.FULL_CONTENT_MOVIE;
      case ComscoreMediaFormat.fullContentPodcast:
        return analytics.StreamingAnalytics.ContentMetadata.ContentMediaFormat.FULL_CONTENT_PODCAST;
      case ComscoreMediaFormat.fullContentGeneric:
        return analytics.StreamingAnalytics.ContentMetadata.ContentMediaFormat.FULL_CONTENT_GENERIC;
      case ComscoreMediaFormat.partialContentEpisode:
        return analytics.StreamingAnalytics.ContentMetadata.ContentMediaFormat.PARTIAL_CONTENT_EPISODE;
      case ComscoreMediaFormat.partialContentMovie:
        return analytics.StreamingAnalytics.ContentMetadata.ContentMediaFormat.PARTIAL_CONTENT_MOVIE;
      case ComscoreMediaFormat.partialContentPodcast:
        return analytics.StreamingAnalytics.ContentMetadata.ContentMediaFormat.PARTIAL_CONTENT_PODCAST;
      case ComscoreMediaFormat.partialContentGeneric:
        return analytics.StreamingAnalytics.ContentMetadata.ContentMediaFormat.PARTIAL_CONTENT_GENERIC;
      case ComscoreMediaFormat.previewEpisode:
        return analytics.StreamingAnalytics.ContentMetadata.ContentMediaFormat.PREVIEW_EPISODE;
      case ComscoreMediaFormat.previewMovie:
        return analytics.StreamingAnalytics.ContentMetadata.ContentMediaFormat.PREVIEW_MOVIE;
      case ComscoreMediaFormat.previewGeneric:
        return analytics.StreamingAnalytics.ContentMetadata.ContentMediaFormat.PREVIEW_GENERIC;
      case ComscoreMediaFormat.extraEpisode:
        return analytics.StreamingAnalytics.ContentMetadata.ContentMediaFormat.EXTRA_EPISODE;
      case ComscoreMediaFormat.extraMovie:
        return analytics.StreamingAnalytics.ContentMetadata.ContentMediaFormat.EXTRA_MOVIE;
      case ComscoreMediaFormat.extraGeneric:
        return analytics.StreamingAnalytics.ContentMetadata.ContentMediaFormat.EXTRA_GENERIC;
    }
  }

  private mapDistributionModel(distributionModel: ComscoreDistributionModel) {
    switch (distributionModel) {
      case ComscoreDistributionModel.exclusivelyOnline:
        return analytics.StreamingAnalytics.ContentMetadata.ContentDistributionModel.EXCLUSIVELY_ONLINE;
      case ComscoreDistributionModel.tvAndOnline:
        return analytics.StreamingAnalytics.ContentMetadata.ContentDistributionModel.TV_AND_ONLINE;
    }
  }
}
