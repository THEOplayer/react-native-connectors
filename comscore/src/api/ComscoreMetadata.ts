export type CustomComscoreMetadata = {
  [id: string]: string;
}

export enum ComscoreMediaType {
  longFormOnDemand = "longFormOnDemand",
  shortFormOnDemand = "shortFormOnDemand",
  live = "live",
  userGeneratedLongFormOnDemand = "userGeneratedLongFormOnDemand",
  userGeneratedShortFormOnDemand = "userGeneratedShortFormOnDemand",
  userGeneratedLive = "userGeneratedLive",
  bumper = "bumper",
  other = "other"
}

export enum ComscoreFeedType {
  eastHD = "easthd",
  westHD = "westhd",
  eastSD = "eastsd",
  westSD = "westsd"
}

export enum ComscoreDeliveryMode {
  linear = "linear",
  ondemand = "ondemand"
}

export enum ComscoreDeliverySubscriptionType {
  traditionalMvpd = "traditionalMvpd",  //LIVE
  virtualMvpd = "virtualMvpd",          //LIVE
  subscription = "subscription",
  transactional = "transactional",
  advertising = "advertising",
  premium = "premium"
}

export enum ComscoreDeliveryComposition {
  clean = "clean",
  embed = "embed"
}

export enum ComscoreDeliveryAdvertisementCapability {
  none = "none",
  dynamicLoad = "dynamicLoad",
  dynamicReplacement = "dynamicReplacement",
  linear1day = "linear1day",
  linear2day = "linear2day",
  linear3day = "linear3day",
  linear4day = "linear4day",
  linear5day = "linear5day",
  linear6day = "linear6day",
  linear7day = "linear7day"
}

export enum ComscoreMediaFormat {
  fullContentEpisode = "fullContentEpisode",
  fullContentMovie = "fullContentMovie",
  fullContentPodcast = "fullContentPodcast",
  fullContentGeneric = "fullContentGeneric",
  partialContentEpisode = "partialContentEpisode",
  partialContentMovie = "partialContentMovie",
  partialContentPodcast = "partialContentPodcast",
  partialContentGeneric = "partialContentGeneric",
  previewEpisode = "previewEpisode",
  previewMovie = "previewMovie",
  previewGeneric = "previewGeneric",
  extraEpisode = "extraEpisode",
  extraMovie = "extraMovie",
  extraGeneric = "extraGeneric"
}

export enum ComscoreDistributionModel {
  tvAndOnline = "tvAndOnline",
  exclusivelyOnline = "exclusivelyOnline"
}

export type ComscoreDate = {
  day: number;
  month: number;
  year: number;
}

export type ComscoreTime = {
  hours: number;
  minutes:number;
}

export type ComscoreDimension = {
  width: number;
  height: number;
}

export type ComscoreMetadata = {
  mediaType: ComscoreMediaType;
  uniqueId: string;
  length: number;
  c3?: string;
  c4?: string;
  c6?: string;
  stationTitle: string;
  stationCode?: string;
  networkAffiliate?: string;
  publisherName?: string;
  programTitle: string;
  programId?: string;
  episodeTitle: string;
  episodeId?: string;
  episodeSeasonNumber?: string;
  episodeNumber?: string;
  genreName: string;
  genreId?: string;
  carryTvAdvertisementLoad?: boolean;
  classifyAsCompleteEpisode?: boolean;
  dateOfProduction?: ComscoreDate;
  timeOfProduction?: ComscoreTime;
  dateOfTvAiring?: ComscoreDate;
  timeOfTvAiring?: ComscoreTime;
  dateOfDigitalAiring?: ComscoreDate;
  timeOfDigitalAiring?: ComscoreTime;
  feedType?: ComscoreFeedType;
  classifyAsAudioStream: boolean;
  deliveryMode?: ComscoreDeliveryMode;
  deliverySubscriptionType?: ComscoreDeliverySubscriptionType;
  deliveryComposition?: ComscoreDeliveryComposition;
  deliveryAdvertisementCapability?: ComscoreDeliveryAdvertisementCapability;
  mediaFormat?: ComscoreMediaFormat;
  distributionModel?: ComscoreDistributionModel;
  playlistTitle?: string;
  totalSegments?: number;
  clipUrl?: string;
  videoDimension?: ComscoreDimension;
  customLabels?: CustomComscoreMetadata;
}