package com.theoplayercomscore.integration;

import androidx.annotation.NonNull;

import com.comscore.streaming.ContentDistributionModel;
import com.comscore.streaming.ContentMediaFormat;
import com.comscore.streaming.ContentType;

import java.util.HashMap;
import java.util.Map;

public class ComscoreMetaData {

    private static final String AUDIENCE_MEASUREMENT_PROJECT_KEY = "cs_proid";
    private static final String BROADCASTER_PLATFORM_KEY = "oce_bpf";
    private static final String COMPLETE_EPISODE_KEY = "ns_st_ce";
    private static final String CONTENT_DISTRIBUTION_MODEL_KEY = "ns_st_cdm";
    private static final String CONTENT_GENRE_KEY = "ns_st_ge";
    private static final String DIGITAL_AIR_DATE_KEY = "ns_st_ddt";
    private static final String EPISODE_ID_KEY = "ns_st_tep";
    private static final String EPISODE_NUMBER_KEY = "ns_st_en";
    private static final String EPISODE_SEASON_NUMBER_KEY = "ns_st_sn";
    private static final String EPISODE_TITLE_KEY = "ns_st_ep";
    private static final String FEED_TYPE_KEY = "ns_st_ft";
    private static final String ON_DEMAND_TYPE_KEY = "oce_odt";
    private static final String PROGRAM_ID_KEY = "ns_st_tpr";
    private static final String PROGRAM_TITLE_KEY = "ns_st_pr";
    private static final String PUBLISHER_BRAND_NAME_KEY = "ns_st_pu";
    private static final String RAI_MEDIA_TYPE_KEY = "ns_st_cmt";
    private static final String STATION_CODE_KEY = "ns_st_stc";
    private static final String STATION_TITLE_KEY = "ns_st_st";
    private static final String TV_AIR_DATE_KEY = "ns_st_tdt";
    private static final String UNIQUE_CONTENT_ID_KEY = "ns_st_ci";

    private Boolean advertisementLoad = false;
    private String c3 = null;
    private String c4 = null;
    private String c6 = null;
    private Boolean completeEpisode = false;
    private int contentDistributionModel = 0;
    private String contentGenre = null;
    private int contentMediaType;
    private String digitalAirdate = null;
    private String episodeId = null;
    private String episodeNumber = null;
    private String episodeSeasonNumber = null;
    private String episodeTitle = null;
    private String feedType = null;
    private Long length;
    private String programId = null;
    private String programTitle = null;
    private String publisherBrandName = null;
    private String stationCode;
    private String stationTitle = null;
    private String tvAirdate = null;
    private String uniqueContentId = null;

    public String getC3() {
        return c3;
    }

    public String getC4() {
        return c4;
    }

    public String getC6() {
        return c6;
    }

    public int getContentDistributionModel() { return contentDistributionModel; }

    public String getContentGenre() { return contentGenre; }

    public int getContentMediaType() { return contentMediaType; }

    public String getEpisodeId() { return episodeId; }

    public String getEpisodeSeasonNumber() { return episodeSeasonNumber; }

    public String getEpisodeNumber() { return episodeNumber; }

    public String getEpisodeTitle() { return episodeTitle; }

    public String getGenre() { return contentGenre; }

    public long getLength() {
        return length;
    }

    public String getProgramTitle() { return programTitle; }

    public String getPublisherBrandName() {
        return publisherBrandName;
    }

    public String getStationCode() { return stationCode; }

    public String getStationTitle() { return stationTitle; }

    public String getUniqueContentId() { return uniqueContentId; }

    public boolean isCompleteEpisode() { return completeEpisode; }

    public ComscoreMetaData(String uniqueContentId, String publisherBrandName, String programTitle, String programId, String episodeTitle, String episodeId, String episodeSeasonNumber, String episodeNumber, String contentGenre, Boolean advertisementLoad, String digitalAirdate, String tvAirdate, String stationTitle, String c3, String c4, String c6, Boolean completeEpisode, String feedType, int contentDistributionModel, String stationCode, int contentMediaType, Long length) {
        this.advertisementLoad = advertisementLoad;
        this.c3 = c3;
        this.c4 = c4;
        this.c6 = c6;
        this.completeEpisode = completeEpisode;
        this.contentDistributionModel = contentDistributionModel;
        this.contentGenre = contentGenre;
        this.contentMediaType = contentMediaType;
        this.digitalAirdate = digitalAirdate;
        this.episodeId = episodeId;
        this.episodeNumber = episodeNumber;
        this.episodeSeasonNumber = episodeSeasonNumber;
        this.episodeTitle = episodeTitle;
        this.feedType = feedType;
        this.length = length;
        this.programId = programId;
        this.programTitle = programTitle;
        this.publisherBrandName = publisherBrandName;
        this.stationCode = stationCode;
        this.stationTitle = stationTitle;
        this.tvAirdate = tvAirdate;
        this.uniqueContentId = uniqueContentId;
    }

    public Map<String,String> toMap() {
        Map<String,String> metadataMap = new HashMap<String,String>();

        // Default fields
        metadataMap.put(AUDIENCE_MEASUREMENT_PROJECT_KEY,"kwp-it");
        metadataMap.put(BROADCASTER_PLATFORM_KEY,"Raiplay app Android");

        // Configurable fields
        if(advertisementLoad != null && advertisementLoad) metadataMap.put("ns_st_ia", "1");
        if(c3 != null) metadataMap.put("c3", c3);
        if(c4 != null) metadataMap.put("c4", c4);
        if(c6 != null) metadataMap.put("c5", c6);
        if(completeEpisode != null) {
            if (completeEpisode) {
                metadataMap.put(COMPLETE_EPISODE_KEY, "1");
            } else {
                metadataMap.put(COMPLETE_EPISODE_KEY, "0");
            }
        }
        if(contentDistributionModel == ContentDistributionModel.TV_AND_ONLINE) {
            metadataMap.put(CONTENT_DISTRIBUTION_MODEL_KEY, "to");
        } else if(contentDistributionModel == ContentDistributionModel.EXCLUSIVELY_ONLINE) {
            metadataMap.put(CONTENT_DISTRIBUTION_MODEL_KEY, "eo");
        } else {
            metadataMap.put(CONTENT_DISTRIBUTION_MODEL_KEY, "df");
        }
        if(contentGenre != null) metadataMap.put(CONTENT_GENRE_KEY, contentGenre);
        if(digitalAirdate != null) metadataMap.put(DIGITAL_AIR_DATE_KEY, digitalAirdate);
        if(episodeId != null) metadataMap.put(EPISODE_ID_KEY, episodeId);
        if(episodeNumber != null) metadataMap.put(EPISODE_NUMBER_KEY, episodeNumber);
        if(episodeSeasonNumber != null) metadataMap.put(EPISODE_SEASON_NUMBER_KEY, episodeSeasonNumber);
        if(episodeTitle != null) metadataMap.put(EPISODE_TITLE_KEY, episodeTitle);
        if(feedType != null) metadataMap.put(FEED_TYPE_KEY, feedType);
        if(programId != null) metadataMap.put(PROGRAM_ID_KEY, programId);
        if(programTitle != null) metadataMap.put(PROGRAM_TITLE_KEY, programTitle);
        if(publisherBrandName != null) metadataMap.put(PUBLISHER_BRAND_NAME_KEY, publisherBrandName);
        if(stationCode != null) metadataMap.put(STATION_CODE_KEY, stationCode);
        if(stationTitle != null) metadataMap.put(STATION_TITLE_KEY, stationTitle);
        if(tvAirdate != null) metadataMap.put(TV_AIR_DATE_KEY, tvAirdate);
        if(uniqueContentId != null) metadataMap.put(UNIQUE_CONTENT_ID_KEY, uniqueContentId);

        return metadataMap;
    }

    public Map<String,String> buildCustomLabelMap() {
        Map<String,String> customMap = new HashMap<String,String>();

        // Default fields
        customMap.put(AUDIENCE_MEASUREMENT_PROJECT_KEY,"kwp-it");
        customMap.put(BROADCASTER_PLATFORM_KEY,"Raiplay app Android");

        // Configurable fields
        if(contentDistributionModel == ContentDistributionModel.TV_AND_ONLINE) {
            customMap.put(CONTENT_DISTRIBUTION_MODEL_KEY, "to");
        } else if(contentDistributionModel == ContentDistributionModel.EXCLUSIVELY_ONLINE) {
            customMap.put(CONTENT_DISTRIBUTION_MODEL_KEY, "eo");
        } else {
            customMap.put(CONTENT_DISTRIBUTION_MODEL_KEY, "df");
        }

        return customMap;
    }


    /**
     * The builder for {@link ComscoreMetaData}.
     */
    public static class Builder {
        private Boolean advertisementLoad;
        private String c3;
        private String c4;
        private String c6;
        private Boolean completeEpisode;
        private int contentDistributionModel;
        private String contentGenre;
        private int contentMediaType;
        private String digitalAirdate;
        private String episodeId;
        private String episodeNumber;
        private String episodeSeasonNumber;
        private String episodeTitle;
        private String feedType;
        private Long length;
        private String onDemandType;
        private String programId;
        private String programTitle;
        private String publisherBrandName;
        private String raiMediaType;
        private String stationCode;
        private String stationTitle;
        private String tvAirdate;
        private String uniqueContentId;

        @NonNull
        private static ComscoreMetaData createComscoreMetadata(String uniqueContentId, String publisherBrandName, String programTitle, String programId, String episodeTitle, String episodeId, String episodeSeasonNumber, String episodeNumber, String contentGenre, Boolean advertisementLoad, String digitalAirdate, String tvAirdate, String stationTitle, String c3, String c4, String c6, Boolean completeEpisode, String feedType, int contentDistributionModel, String stationCode, int contentMediaType, Long length) {
            return new ComscoreMetaData(uniqueContentId,publisherBrandName,programTitle,programId,episodeTitle,episodeId,episodeSeasonNumber,episodeNumber,contentGenre,advertisementLoad,digitalAirdate,tvAirdate,stationTitle,c3,c4,c6,completeEpisode,feedType, contentDistributionModel, stationCode, contentMediaType, length);
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

        public Builder advertisementLoad(@NonNull boolean advertisementLoad) {
            this.advertisementLoad = advertisementLoad;
            return this;
        };
        public Builder c3(@NonNull String c3) {
            this.c3 = c3;
            return this;
        };
        public Builder c4(@NonNull String c4) {
            this.c4 = c4;
            return this;
        };
        public Builder c6(@NonNull String c6) {
            this.c6 = c6;
            return this;
        };
        public Builder completeEpisode(@NonNull boolean completeEpisode) {
            this.completeEpisode = completeEpisode;
            return this;
        };
        public Builder contentDistributionModel(@NonNull int contentDistributionModel) {
            this.contentDistributionModel = contentDistributionModel;
            return this;
        };
        public Builder contentGenre(@NonNull String contentGenre) {
            this.contentGenre = contentGenre;
            return this;
        };
        public Builder contentMediaType(@NonNull int contentMediaType) {
            this.contentMediaType = contentMediaType;
            return this;
        }
        public Builder digitalAirdate(@NonNull String digitalAirdate) {
            this.digitalAirdate = digitalAirdate;
            return this;
        };
        public Builder episodeId(@NonNull String episodeId) {
            this.episodeId = episodeId;
            return this;
        };
        public Builder episodeNumber(@NonNull String episodeNumber) {
            this.episodeNumber = episodeNumber;
            return this;
        };
        public Builder episodeSeasonNumber(@NonNull String episodeSeasonNumber) {
            this.episodeSeasonNumber = episodeSeasonNumber;
            return this;
        };
        public Builder episodeTitle(@NonNull String episodeTitle) {
            this.episodeTitle = episodeTitle;
            return this;
        };
        public Builder feedType(@NonNull String feedType) {
            this.feedType = feedType;
            return this;
        };
        public Builder length(@NonNull Long length) {
            this.length = length;
            return this;
        };
        public Builder onDemandType(@NonNull String onDemandType) {
            this.onDemandType = onDemandType;
            return this;
        };
        public Builder programId(@NonNull String programId) {
            this.programId = programId;
            return this;
        };
        public Builder programTitle(@NonNull String programTitle) {
            this.programTitle = programTitle;
            return this;
        };
        public Builder publisherBrandName(@NonNull String publisherBrandName) {
            this.publisherBrandName = publisherBrandName;
            return this;
        };
        public Builder raiMediaType(@NonNull String raiMediaType) {
            this.raiMediaType = raiMediaType;
            return this;
        };
        public Builder stationCode(@NonNull String stationCode) {
            this.stationCode = stationCode;
            return this;
        };
        public Builder stationTitle(@NonNull String stationTitle) {
            this.stationTitle = stationTitle;
            return this;
        };
        public Builder tvAirdate(@NonNull String tvAirdate) {
            this.tvAirdate = tvAirdate;
            return this;
        };
        public Builder uniqueContentId(@NonNull String uniqueContentId) {
            this.uniqueContentId = uniqueContentId;
            return this;
        };

        public ComscoreMetaData build() {
            return createComscoreMetadata(uniqueContentId,publisherBrandName,programTitle,programId,episodeTitle,episodeId,episodeSeasonNumber,episodeNumber,contentGenre,advertisementLoad,digitalAirdate,tvAirdate,stationTitle,c3,c4,c6,completeEpisode,feedType,contentDistributionModel,stationCode,contentMediaType, length);
        }

    }
}
