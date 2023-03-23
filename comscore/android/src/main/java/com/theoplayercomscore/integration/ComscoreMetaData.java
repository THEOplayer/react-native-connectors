package com.theoplayercomscore.integration;

import androidx.annotation.NonNull;

import com.comscore.streaming.ContentMetadata;

import java.util.Map;

public class ComscoreMetaData {

  private ComscoreMediaType mediaType;
  private String uniqueId;
  private long length;
  private String c3 = null;
  private String c4 = null;
  private String c6 = null;
  private String stationTitle;
  private String stationCode = null;
  private String networkAffiliate = null;
  private String publisherName = null;
  private String programTitle;
  private String programId = null;
  private String episodeTitle;
  private String episodeId = null;
  private String episodeSeasonNumber = null;
  private String episodeNumber = null;
  private String genreName;
  private String genreId = null;
  private Boolean carryTvAdvertisementLoad = null;
  private Boolean classifyAsCompleteEpisode = null;
  private ComscoreDate dateOfProduction = null;
  private ComscoreTime timeOfProduction = null;
  private ComscoreDate dateOfTvAiring = null;
  private ComscoreTime timeOfTvAiring = null;
  private ComscoreDate dateOfDigitalAiring = null;
  private ComscoreTime timeOfDigitalAiring = null;
  private ComscoreFeedType feedType = null;
  private Boolean classifyAsAudioStream;
  private ComscoreDeliveryMode deliveryMode = null;
  private ComscoreDeliverySubscriptionType deliverySubscriptionType = null;
  private ComscoreDeliveryComposition deliveryComposition = null;
  private ComscoreDeliveryAdvertisementCapability deliveryAdvertisementCapability = null;
  private ComscoreMediaFormat mediaFormat = null;
  private ComscoreDistributionModel distributionModel = null;
  private String playlistTitle = null;
  private Integer totalSegments = null;
  private String clipUrl = null;
  private ComscoreDimension videoDimension = null;
  private Map<String,String> customLabels = null;

    public ComscoreMetaData(
      ComscoreMediaType mediaType,
      String uniqueId,
      long length,
      String c3,
      String c4,
      String c6,
      String stationTitle,
      String stationCode,
      String networkAffiliate,
      String publisherName,
      String programTitle,
      String programId,
      String episodeTitle,
      String episodeId,
      String episodeSeasonNumber,
      String episodeNumber,
      String genreName,
      String genreId,
      Boolean carryTvAdvertisementLoad,
      Boolean classifyAsCompleteEpisode,
      ComscoreDate dateOfProduction,
      ComscoreTime timeOfProduction,
      ComscoreDate dateOfTvAiring,
      ComscoreTime timeOfTvAiring,
      ComscoreDate dateOfDigitalAiring,
      ComscoreTime timeOfDigitalAiring,
      ComscoreFeedType feedType,
      Boolean classifyAsAudioStream,
      ComscoreDeliveryMode deliveryMode,
      ComscoreDeliverySubscriptionType deliverySubscriptionType,
      ComscoreDeliveryComposition deliveryComposition,
      ComscoreDeliveryAdvertisementCapability deliveryAdvertisementCapability,
      ComscoreMediaFormat mediaFormat,
      ComscoreDistributionModel distributionModel,
      String playlistTitle,
      Integer totalSegments,
      String clipUrl,
      ComscoreDimension videoDimension,
      Map<String,String> customLabels
    ) {
      this.mediaType = mediaType;
      this.uniqueId = uniqueId;
      this.length = length;
      this.c3 = c3;
      this.c4 = c4;
      this.c6 = c6;
      this.stationTitle = stationTitle;
      this.stationCode = stationCode;
      this.networkAffiliate = networkAffiliate;
      this.publisherName = publisherName;
      this.programTitle = programTitle;
      this.programId = programId;
      this.episodeTitle = episodeTitle;
      this.episodeId = episodeId;
      this.episodeSeasonNumber = episodeSeasonNumber;
      this.episodeNumber = episodeNumber;
      this.genreName = genreName;
      this.genreId = genreId;
      this.carryTvAdvertisementLoad = carryTvAdvertisementLoad;
      this.classifyAsCompleteEpisode = classifyAsCompleteEpisode;
      this.dateOfProduction = dateOfProduction;
      this.timeOfProduction = timeOfProduction;
      this.dateOfTvAiring = dateOfTvAiring;
      this.timeOfTvAiring = timeOfTvAiring;
      this.dateOfDigitalAiring = dateOfDigitalAiring;
      this.timeOfDigitalAiring = timeOfDigitalAiring;
      this.feedType = feedType;
      this.classifyAsAudioStream = classifyAsAudioStream;
      this.deliveryMode = deliveryMode;
      this.deliverySubscriptionType = deliverySubscriptionType;
      this.deliveryComposition = deliveryComposition;
      this.deliveryAdvertisementCapability = deliveryAdvertisementCapability;
      this.mediaFormat = mediaFormat;
      this.distributionModel = distributionModel;
      this.playlistTitle = playlistTitle;
      this.totalSegments = totalSegments;
      this.clipUrl = clipUrl;
      this.videoDimension = videoDimension;
      this.customLabels = customLabels;
    }

    public ContentMetadata toComscoreContentMetadata() {
      ContentMetadata.Builder cm = new ContentMetadata.Builder();
      cm.mediaType(mediaType.toComscore());
      cm.uniqueId(uniqueId);
      cm.length(length);
      if(c3 != null) cm.dictionaryClassificationC3(c3);
      if(c4 != null) cm.dictionaryClassificationC4(c4);
      if(c6 != null) cm.dictionaryClassificationC6(c6);
      cm.stationTitle(stationTitle);
      if(stationCode != null) cm.stationCode(stationCode);
      if(networkAffiliate != null) cm.networkAffiliate(networkAffiliate);
      if(publisherName != null) cm.publisherName(publisherName);
      cm.programTitle(programTitle);
      if(programId != null) cm.programId(programId);
      cm.episodeTitle(episodeTitle);
      if(episodeId != null) cm.episodeId(episodeId);
      if(episodeSeasonNumber != null) cm.episodeSeasonNumber(episodeSeasonNumber);
      if(episodeNumber != null) cm.episodeNumber(episodeNumber);
      cm.genreName(genreName);
      if(genreId != null) cm.genreId(genreId);
      if(carryTvAdvertisementLoad != null) cm.carryTvAdvertisementLoad(carryTvAdvertisementLoad);
      if(classifyAsCompleteEpisode != null) cm.classifyAsCompleteEpisode(classifyAsCompleteEpisode);
      if(dateOfProduction != null) cm.dateOfProduction(dateOfProduction.getYear(),dateOfProduction.getMonth(),dateOfProduction.getDay());
      if(timeOfProduction != null) cm.timeOfProduction(timeOfProduction.getHours(),timeOfProduction.getMinutes());
      if(dateOfTvAiring != null) cm.dateOfTvAiring(dateOfTvAiring.getYear(),dateOfTvAiring.getMonth(),dateOfTvAiring.getDay());
      if(timeOfTvAiring != null) cm.timeOfTvAiring(timeOfTvAiring.getHours(),timeOfTvAiring.getMinutes());
      if(dateOfDigitalAiring != null) cm.dateOfDigitalAiring(dateOfDigitalAiring.getYear(),dateOfDigitalAiring.getMonth(),dateOfDigitalAiring.getDay());
      if(timeOfDigitalAiring != null) cm.timeOfDigitalAiring(timeOfDigitalAiring.getHours(),timeOfDigitalAiring.getMinutes());
      if(feedType != null) cm.feedType(feedType.toComscore());
      cm.classifyAsAudioStream(classifyAsAudioStream);
      if(deliveryMode != null) cm.deliveryMode(deliveryMode.toComscore());
      if(deliverySubscriptionType != null) cm.deliverySubscriptionType(deliverySubscriptionType.toComscore());
      if(deliveryComposition != null) cm.deliveryComposition(deliveryComposition.toComscore());
      if(deliveryAdvertisementCapability != null) cm.deliveryAdvertisementCapability(deliveryAdvertisementCapability.toComscore());
      if(mediaFormat != null) cm.mediaFormat(mediaFormat.toComscore());
      if(distributionModel != null) cm.distributionModel(distributionModel.toComscore());
      if(playlistTitle != null) cm.playlistTitle(playlistTitle);
      if(totalSegments != null) cm.totalSegments(totalSegments);
      if(clipUrl != null) cm.clipUrl(clipUrl);
      if(videoDimension != null) cm.videoDimensions(videoDimension.getWidth(),videoDimension.getHeight());
      if(!customLabels.isEmpty()){
        cm.customLabels(customLabels);
      }
      return cm.build();
    }

  public long getLength() {
      return length;
  }

  /**
     * The builder for {@link ComscoreMetaData}.
     */
    public static class Builder {
      private ComscoreMediaType mediaType;
      private String uniqueId;
      private long length;
      private String c3 = null;
      private String c4 = null;
      private String c6 = null;
      private String stationTitle;
      private String stationCode = null;
      private String networkAffiliate = null;
      private String publisherName = null;
      private String programTitle;
      private String programId = null;
      private String episodeTitle;
      private String episodeId = null;
      private String episodeSeasonNumber = null;
      private String episodeNumber = null;
      private String genreName;
      private String genreId = null;
      private Boolean carryTvAdvertisementLoad = null;
      private Boolean classifyAsCompleteEpisode = null;
      private ComscoreDate dateOfProduction = null;
      private ComscoreTime timeOfProduction = null;
      private ComscoreDate dateOfTvAiring = null;
      private ComscoreTime timeOfTvAiring = null;
      private ComscoreDate dateOfDigitalAiring = null;
      private ComscoreTime timeOfDigitalAiring = null;
      private ComscoreFeedType feedType = null;
      private Boolean classifyAsAudioStream;
      private ComscoreDeliveryMode deliveryMode = null;
      private ComscoreDeliverySubscriptionType deliverySubscriptionType = null;
      private ComscoreDeliveryComposition deliveryComposition = null;
      private ComscoreDeliveryAdvertisementCapability deliveryAdvertisementCapability = null;
      private ComscoreMediaFormat mediaFormat = null;
      private ComscoreDistributionModel distributionModel = null;
      private String playlistTitle = null;
      private Integer totalSegments = null;
      private String clipUrl = null;
      private ComscoreDimension videoDimension = null;
      private Map<String,String> customLabels = null;

        @NonNull
        private static ComscoreMetaData createComscoreMetadata(ComscoreMediaType mediaType, String uniqueId, long length, String c3, String c4, String c6, String stationTitle, String stationCode, String networkAffiliate, String publisherName, String programTitle, String programId, String episodeTitle, String episodeId, String episodeSeasonNumber, String episodeNumber, String genreName, String genreId, Boolean carryTvAdvertisementLoad, Boolean classifyAsCompleteEpisode, ComscoreDate dateOfProduction, ComscoreTime timeOfProduction, ComscoreDate dateOfTvAiring, ComscoreTime timeOfTvAiring, ComscoreDate dateOfDigitalAiring, ComscoreTime timeOfDigitalAiring, ComscoreFeedType feedType, Boolean classifyAsAudioStream, ComscoreDeliveryMode deliveryMode, ComscoreDeliverySubscriptionType deliverySubscriptionType, ComscoreDeliveryComposition deliveryComposition, ComscoreDeliveryAdvertisementCapability deliveryAdvertisementCapability, ComscoreMediaFormat mediaFormat, ComscoreDistributionModel distributionModel, String playlistTitle, Integer totalSegments, String clipUrl, ComscoreDimension videoDimension, Map<String,String> customLabels) {
            return new ComscoreMetaData(mediaType,uniqueId,length,c3,c4,c6,stationTitle,stationCode,networkAffiliate,publisherName,programTitle,programId,episodeTitle,episodeId,episodeSeasonNumber,episodeNumber,genreName,genreId,carryTvAdvertisementLoad,classifyAsCompleteEpisode,dateOfProduction,timeOfProduction,dateOfTvAiring,timeOfTvAiring,dateOfDigitalAiring,timeOfDigitalAiring,feedType,classifyAsAudioStream,deliveryMode,deliverySubscriptionType,deliveryComposition,deliveryAdvertisementCapability,mediaFormat,distributionModel,playlistTitle,totalSegments,clipUrl,videoDimension,customLabels);
        }

        /**
         * Creates a builder for a default Comscore metadata object.
         *
         * @remarks
         * <pre>
         *     - This configuration does not contain any sources.
         * </pre>
         */
        @NonNull
        public static Builder comscoreMetadata() {
            return new Builder();
        }

      public Builder mediaType(@NonNull ComscoreMediaType mediaType) {
        this.mediaType = mediaType;
        return this;
      }
      public Builder uniqueId(@NonNull String uniqueId) {
        this.uniqueId = uniqueId;
        return this;
      }
      public Builder length(@NonNull long length) {
        this.length = length;
        return this;
      }
      public Builder c3(@NonNull String c3) {
        this.c3 = c3;
        return this;
      }
      public Builder c4(@NonNull String c4) {
        this.c4 = c4;
        return this;
      }
      public Builder c6(@NonNull String c6) {
        this.c6 = c6;
        return this;
      }
      public Builder stationTitle(@NonNull String stationTitle) {
        this.stationTitle = stationTitle;
        return this;
      }
      public Builder stationCode(@NonNull String stationCode) {
        this.stationCode = stationCode;
        return this;
      }
      public Builder networkAffiliate(@NonNull String networkAffiliate) {
        this.networkAffiliate = networkAffiliate;
        return this;
      }
      public Builder publisherName(@NonNull String publisherName) {
        this.publisherName = publisherName;
        return this;
      }
      public Builder programTitle(@NonNull String programTitle) {
        this.programTitle = programTitle;
        return this;
      }
      public Builder programId(@NonNull String programId) {
        this.programId = programId;
        return this;
      }
      public Builder episodeTitle(@NonNull String episodeTitle) {
        this.episodeTitle = episodeTitle;
        return this;
      }
      public Builder episodeId(@NonNull String episodeId) {
        this.episodeId = episodeId;
        return this;
      }
      public Builder episodeSeasonNumber(@NonNull String episodeSeasonNumber) {
        this.episodeSeasonNumber = episodeSeasonNumber;
        return this;
      }
      public Builder episodeNumber(@NonNull String episodeNumber) {
        this.episodeNumber = episodeNumber;
        return this;
      }
      public Builder genreName(@NonNull String genreName) {
        this.genreName = genreName;
        return this;
      }
      public Builder genreId(@NonNull String genreId) {
        this.genreId = genreId;
        return this;
      }
      public Builder carryTvAdvertisementLoad(@NonNull Boolean carryTvAdvertisementLoad) {
        this.carryTvAdvertisementLoad = carryTvAdvertisementLoad;
        return this;
      }
      public Builder classifyAsCompleteEpisode(@NonNull Boolean classifyAsCompleteEpisode) {
        this.classifyAsCompleteEpisode = classifyAsCompleteEpisode;
        return this;
      }
      public Builder dateOfProduction(@NonNull ComscoreDate dateOfProduction) {
        this.dateOfProduction = dateOfProduction;
        return this;
      }
      public Builder timeOfProduction(@NonNull ComscoreTime timeOfProduction) {
        this.timeOfProduction = timeOfProduction;
        return this;
      }
      public Builder dateOfTvAiring(@NonNull ComscoreDate dateOfTvAiring) {
        this.dateOfTvAiring = dateOfTvAiring;
        return this;
      }
      public Builder timeOfTvAiring(@NonNull ComscoreTime timeOfTvAiring) {
        this.timeOfTvAiring = timeOfTvAiring;
        return this;
      }
      public Builder dateOfDigitalAiring(@NonNull ComscoreDate dateOfDigitalAiring) {
        this.dateOfDigitalAiring = dateOfDigitalAiring;
        return this;
      }
      public Builder timeOfDigitalAiring(@NonNull ComscoreTime timeOfDigitalAiring) {
        this.timeOfDigitalAiring = timeOfDigitalAiring;
        return this;
      }
      public Builder feedType(@NonNull ComscoreFeedType feedType) {
        this.feedType = feedType;
        return this;
      }
      public Builder classifyAsAudioStream(@NonNull Boolean classifyAsAudioStream) {
        this.classifyAsAudioStream = classifyAsAudioStream;
        return this;
      }
      public Builder deliveryMode(@NonNull ComscoreDeliveryMode deliveryMode) {
        this.deliveryMode = deliveryMode;
        return this;
      }
      public Builder deliverySubscriptionType(@NonNull ComscoreDeliverySubscriptionType deliverySubscriptionType) {
        this.deliverySubscriptionType = deliverySubscriptionType;
        return this;
      }
      public Builder deliveryComposition(@NonNull ComscoreDeliveryComposition deliveryComposition) {
        this.deliveryComposition = deliveryComposition;
        return this;
      }
      public Builder deliveryAdvertisementCapability(@NonNull ComscoreDeliveryAdvertisementCapability deliveryAdvertisementCapability) {
        this.deliveryAdvertisementCapability = deliveryAdvertisementCapability;
        return this;
      }
      public Builder mediaFormat(@NonNull ComscoreMediaFormat mediaFormat) {
        this.mediaFormat = mediaFormat;
        return this;
      }
      public Builder distributionModel(@NonNull ComscoreDistributionModel distributionModel) {
        this.distributionModel = distributionModel;
        return this;
      }
      public Builder playlistTitle(@NonNull String playlistTitle) {
        this.playlistTitle = playlistTitle;
        return this;
      }
      public Builder totalSegments(@NonNull Integer totalSegments) {
        this.totalSegments = totalSegments;
        return this;
      }
      public Builder clipUrl(@NonNull String clipUrl) {
        this.clipUrl = clipUrl;
        return this;
      }
      public Builder videoDimension(@NonNull ComscoreDimension videoDimension) {
        this.videoDimension = videoDimension;
        return this;
      }
      public Builder customLabels(@NonNull Map<String,String> customLabels) {
        this.customLabels = customLabels;
        return this;
      }

      public ComscoreMetaData build() {
          return createComscoreMetadata(mediaType,uniqueId,length,c3,c4,c6,stationTitle,stationCode,networkAffiliate,publisherName,programTitle,programId,episodeTitle,episodeId,episodeSeasonNumber,episodeNumber,genreName,genreId,carryTvAdvertisementLoad,classifyAsCompleteEpisode,dateOfProduction,timeOfProduction,dateOfTvAiring,timeOfTvAiring,dateOfDigitalAiring,timeOfDigitalAiring,feedType,classifyAsAudioStream,deliveryMode,deliverySubscriptionType,deliveryComposition,deliveryAdvertisementCapability,mediaFormat,distributionModel,playlistTitle,totalSegments,clipUrl,videoDimension,customLabels);
      }

    }
}
