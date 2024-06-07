export type CustomComscoreMetadata = {
  [id: string]: string;
};

export enum ComscoreMediaType {
  longFormOnDemand = 'longFormOnDemand',
  shortFormOnDemand = 'shortFormOnDemand',
  live = 'live',
  userGeneratedLongFormOnDemand = 'userGeneratedLongFormOnDemand',
  userGeneratedShortFormOnDemand = 'userGeneratedShortFormOnDemand',
  userGeneratedLive = 'userGeneratedLive',
  bumper = 'bumper',
  other = 'other',
}

export enum ComscoreFeedType {
  eastHD = 'easthd',
  westHD = 'westhd',
  eastSD = 'eastsd',
  westSD = 'westsd',
}

export enum ComscoreDeliveryMode {
  linear = 'linear',
  ondemand = 'ondemand',
}

export enum ComscoreDeliverySubscriptionType {
  traditionalMvpd = 'traditionalMvpd', //LIVE
  virtualMvpd = 'virtualMvpd', //LIVE
  subscription = 'subscription',
  transactional = 'transactional',
  advertising = 'advertising',
  premium = 'premium',
}

export enum ComscoreDeliveryComposition {
  clean = 'clean',
  embed = 'embed',
}

export enum ComscoreDeliveryAdvertisementCapability {
  none = 'none',
  dynamicLoad = 'dynamicLoad',
  dynamicReplacement = 'dynamicReplacement',
  linear1day = 'linear1day',
  linear2day = 'linear2day',
  linear3day = 'linear3day',
  linear4day = 'linear4day',
  linear5day = 'linear5day',
  linear6day = 'linear6day',
  linear7day = 'linear7day',
}

export enum ComscoreMediaFormat {
  fullContentEpisode = 'fullContentEpisode',
  fullContentMovie = 'fullContentMovie',
  fullContentPodcast = 'fullContentPodcast',
  fullContentGeneric = 'fullContentGeneric',
  partialContentEpisode = 'partialContentEpisode',
  partialContentMovie = 'partialContentMovie',
  partialContentPodcast = 'partialContentPodcast',
  partialContentGeneric = 'partialContentGeneric',
  previewEpisode = 'previewEpisode',
  previewMovie = 'previewMovie',
  previewGeneric = 'previewGeneric',
  extraEpisode = 'extraEpisode',
  extraMovie = 'extraMovie',
  extraGeneric = 'extraGeneric',
}

export enum ComscoreDistributionModel {
  tvAndOnline = 'tvAndOnline',
  exclusivelyOnline = 'exclusivelyOnline',
}

export type ComscoreDate = {
  day: number;
  month: number;
  year: number;
};

export type ComscoreTime = {
  hours: number;
  minutes: number;
};

export type ComscoreDimension = {
  width: number;
  height: number;
};

export type ComscoreMetadata = {
  /**
   * Classification type, mandatory, setMediaType( value ) - (ns_st_li)
   */
  mediaType: ComscoreMediaType;
  /**
   * Program ID for VMX, unique identifier for the content, LIVE: Mandatory, VOD: Mandatory, Adv: Inherited from Content, Comscore API: setUniqueId( string id ) - (ns_st_ct)
   */
  uniqueId: string;
  /**
   * Clip Length in milliseconds, Comscore API: setLength( int length ) - (ns_st_cl)
   */
  length: number;
  /**
   * VMX dictionary (level 1), mandatory, Comscore API: setDictionaryClassificationC3( string value ) - (c3)
   */
  c3?: string;
  /**
   * VMX dictionary (level 2), mandatory, Comscore API: setDictionaryClassificationC4( string value ) - (c4)
   */
  c4?: string;
  /**
   * VMX dictionary (level 3), mandatory, Comscore API: setDictionaryClassificationC6( string value ) - (c6)
   */
  c6?: string;
  /**
   * Channel Name, title of the station or channel for which content was recorded or where content is made available, LIVE: Mandatory,VOD: Mandatory,Adv: Inherited from Content, Comscore API: setStationTitle( string title ) - (ns_st_st)
   */
  stationTitle: string;
  /**
   * Channel ID, Code of the station or channel for which content was recorded or where content is made available, LIVE: Mandatory,VOD: Mandatory,Adv: Inherited from Content, Comscore API: setStationCode( string code ) - (ns_st_stc)
   */
  stationCode?: string;
  /**
   * Code to identify station affiliation in cases where the same local TV station call sign is affiliated with multiple national TV networks, Comscore API: setNetworkAffiliate( string code ) - (ns_st_sta)
   */
  networkAffiliate?: string;
  /**
   * Publisher Brand Name, the consumer-facing brand name of the media publisher that owns the content, LIVE: Mandatory, VOD: Mandatory, Adv: Inherited from Content, Comscore API: setPublisherName( string name ) - (ns_st_pu)
   */
  publisherName?: string;
  /**
   * Program name, Top level content title (i.e., the name of the overall program, show, or content series), LIVE: Optional,VOD: Optional,Adv: Inherited from Content, Comscore API: setProgramTitle( string title ) - (ns_st_pr)
   */
  programTitle: string;
  /**
   * Program Id, Top level content ID to be used for matching and grouping purposes, LIVE: Optional,VOD: Optional,Adv: Inherited from Content, Comscore API: setProgramId( string id ) - (ns_st_tpr)
   */
  programId?: string;
  /**
   * Episode title, Sub level content title (i.e., the title of the specific episode),LIVE: Optional,VOD: Optional,Adv: Inherited from Content, Comscore API: setEpisodeTitle( string title ) - (ns_st_ep)
   */
  episodeTitle: string;
  /**
   * Episode ID Sub level content ID to be used for matching and grouping purposes,LIVE: Optional,VOD: Optional,Adv: Inherited from Content, Comscore API: setEpisodeId( string id ) - (ns_st_tep)
   */
  episodeId?: string;
  /**
   * Season Number, Season number for episodic content, LIVE: Optional, VOD: Optional, Adv: Inherited from Content, Comscore API: setEpisodeSeasonNumber( string value ) - (ns_st_sn)
   */
  episodeSeasonNumber?: string;
  /**
   * Episode number for episodic content. It is recommended to use values with 2 digits — or 3 digits for episodic content with more than 99 episodes in a season — left-padded with 0, Comscore API: setEpisodeNumber( string value ) - (ns_st_en)
   */
  episodeNumber?: string;
  /**
   * Genre description. Multiple values can be provided as a comma-separated string, LIVE: Optional, VOD: Optional, Adv: Inherited from Content, Comscore API: setGenreName( string name ) - (ns_st_ge)
   */
  genreName: string;
  /**
   * Genre ID to be used for matching and grouping purposes (for example when the genres are multilingual). Multiple values can be provided as a comma-separated string, Comscore API: setGenreId( string id ) - (ns_st_tge)
   */
  genreId?: string;
  /**
   * This metadata helps Comscore differentiate if the stream is carrying the same ad load as TV, Comscore API: carryTvAdvertisementLoad( Boolean value ) - (ns_st_ia)
   */
  carryTvAdvertisementLoad?: boolean;
  /**
   * Complete Episode Flag, 1 - if the content media is a full episode, LIVE: Optional, VOD: Optional, Adv: Inherited from Content, Comscore API: classifyAsCompleteEpisode( Boolean value ) - (ns_st_ce)
   */
  classifyAsCompleteEpisode?: boolean;
  /**
   * The date on which the content was produced or created,  LIVE: Optional,VOD: Optional,Adv: Inherited from Content, Comscore API: setDateOfProduction( int year, int month, int day ) - (ns_st_dt)
   */
  dateOfProduction?: ComscoreDate;
  /**
   * The time at which the content was produced or created,  LIVE: Optional,VOD: Optional,Adv: Inherited from Content, Comscore API: setTimeOfProduction( int hours, int minutes ) - (ns_st_tm)
   */
  timeOfProduction?: ComscoreTime;
  /**
   * The date on which the content aired on TV. This metadata helps Comscore establish monetization windows (live, day +1, day +3, etc.) for any given episode or show.
   * The monetization windows are used to calculate commercial and program ratings. LIVE: Optional,VOD: Optional,Adv: Inherited from Content
   * Comscore API: setDateOfTvAiring( int year, int month, int day ) - (ns_st_tdt)
   */
  dateOfTvAiring?: ComscoreDate;
  /**
   * The time at which the content aired on TV,  LIVE: Optional,VOD: Optional,Adv: Inherited from Content, Comscore API: setTimeOfTvAiring( int hours, int minutes ) - (ns_st_ttm)
   */
  timeOfTvAiring?: ComscoreTime;
  /**
   * The date on which the content was made available for streaming consumption. This metadata helps Comscore establish monetization windows (live, day +1, day +3, etc.) for any given episode or show. The monetization windows are used to calculate commercial and program ratings,  LIVE: Optional,VOD: Optional,Adv: Inherited from Content, Comscore API: setDateOfDigitalAiring( int year, int month, int day ) - (ns_st_ddt)
   */
  dateOfDigitalAiring?: ComscoreDate;
  /**
   * The time at which the content was made available for streaming consumption,  LIVE: Optional,VOD: Optional,Adv: Inherited from Content, Comscore API: setTimeOfDigitalAiring( int hours, int minutes ) - (ns_st_dtm)
   */
  timeOfDigitalAiring?: ComscoreTime;
  /**
   * Specify the type of feed provided on the live stream, Comscore API: setFeedType( value ) - (ns_st_ft)
   */
  feedType?: ComscoreFeedType;
  /**
   * Use value true if the content is audio-only, rather than video (with or without audio). Otherwise omit or use value false, Comscore API: classifyAsAudioStream( Boolean value ) - (ns_st_ty)
   */
  classifyAsAudioStream: boolean;
  /**
   * Identifies the content delivery to be on-demand or linear, Comscore API:  setDeliveryMode( value ) - (ns_st_cde)
   */
  deliveryMode?: ComscoreDeliveryMode;
  /**
   * Identifies the type of subscription of the user, Comscore API: setDeliverySubscriptionType( value ) - (ns_st_cds)
   */
  deliverySubscriptionType?: ComscoreDeliverySubscriptionType;
  /**
   * Indicates whether or not ads are delivered as part of the content stream, Comscore API: setDeliveryComposition( value ) - (ns_st_cdc)
   */
  deliveryComposition?: ComscoreDeliveryComposition;
  /**
   * Indicate what capability is allowed for advertisement placements, Comscore API: setDeliveryAdvertisementCapability( value ) - (ns_st_cda)
   */
  deliveryAdvertisementCapability?: ComscoreDeliveryAdvertisementCapability;
  /**
   *  Specify the type of content media in more detail, VOD: Mandatory, Adv: Inherited from Content, Specify the type of content media in more detail, Comscore API: setMediaFormat( value ) - (ns_st_cmt)
   */
  mediaFormat?: ComscoreMediaFormat;
  /**
   * Content Distribution Model, Specify where the content was distributed, LIVE: Optional, VOD: Optional, Adv: Inherited from Content, Comscore API: setDistributionModel( value ) - (ns_st_cdm)
   */
  distributionModel?: ComscoreDistributionModel;
  /**
   * Can be used if the player offers the media as part of a playlist. Specify an identifier (title, etc.) for the playlist. For example, the TV Show title for a playlist which contains all episodes from a specific TV show, Comscore API: setPlaylistTitle( string title ) - (ns_st_pl)
   */
  playlistTitle?: string;
  /**
   * Indicates the total number of segments of the content, which is one more than the number of mid-roll ad breaks. For example, content with no mid-roll ad breaks has 1 segment and content with 2 mid-roll ad breaks has 3 segments, Comscore API: setTotalSegments( int total ) - (ns_st_tp)
   */
  totalSegments?: number;
  /**
   * The URL (or path/filename) of the content stream, Comscore API: setClipUrl( string url ) - (ns_st_cu)
   */
  clipUrl?: string;
  /**
   * Content video dimensions in pixels, Comscore API: setVideoDimensions( int pixelsWide, int pixelsHigh ) - (ns_st_cs)
   */
  videoDimension?: ComscoreDimension;
  /**
   * Can be used to specify a collection of custom metadata name/value pairs, Comscore API: addCustomLabels( Object labels )
   */
  customLabels?: CustomComscoreMetadata;
};
