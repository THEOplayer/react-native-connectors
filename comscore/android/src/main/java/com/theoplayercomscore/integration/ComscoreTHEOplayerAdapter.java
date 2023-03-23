package com.theoplayercomscore.integration;

import android.util.Log;

import com.comscore.streaming.AdvertisementMetadata;
import com.comscore.streaming.AdvertisementType;
import com.comscore.streaming.ContentDistributionModel;
import com.comscore.streaming.ContentMediaFormat;
import com.comscore.streaming.ContentMetadata;
import com.comscore.streaming.ContentType;
import com.comscore.streaming.StreamingAnalytics;
import com.theoplayer.android.api.ads.Ad;
import com.theoplayer.android.api.ads.GoogleImaAd;
import com.theoplayer.android.api.ads.UniversalAdId;
import com.theoplayer.android.api.event.EventListener;
import com.theoplayer.android.api.event.ads.AdsEventTypes;
import com.theoplayer.android.api.event.player.PlayerEventTypes;
import com.theoplayer.android.api.event.player.SeekedEvent;
import com.theoplayer.android.api.player.Player;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

public class ComscoreTHEOplayerAdapter {

    public static final String TAG = "THEOLOG";

    private Player player;
    private ComscoreConfiguration configuration;
    private ComscoreMetaData comscoreMetaData;
    private ContentMetadata currentContentMetadata;
    private StreamingAnalytics streamingAnalytics;
    private ComscoreState comScoreState;
    private Double videoDuration;
    private Double currentAdDuration;
    private Double currentAdOffset;
    private boolean buffering;
    private Double dvrWindowEnd;
    private boolean inAd;

    final EventListener<SeekedEvent> onFirstSeekedAfterEnded = seekedEvent -> {
        if (seekedEvent.getCurrentTime() < 0.5) {
            Log.i(TAG, "DEBUG: SEEKED event to start after an end event, create new session");
            streamingAnalytics.createPlaybackSession();
            currentAdOffset = 0.0; // Set to default value
            setContentMetadata();
        }
        player.removeEventListener(PlayerEventTypes.SEEKED, this.onFirstSeekedAfterEnded);
    };

    private enum ComscoreState {
        INITIALIZED,
        STOPPED,
        PAUSED_AD,
        PAUSED_VIDEO,
        ADVERTISEMENT,
        VIDEO
    }

    public ComscoreTHEOplayerAdapter(Player player, String playerVersion, ComscoreConfiguration configuration, ComscoreMetaData metadata) {
        this.player = player;
        this.configuration = configuration;
        comscoreMetaData = metadata;
        streamingAnalytics = new StreamingAnalytics();
        comScoreState = ComscoreState.INITIALIZED;
        videoDuration = 0.0;
        currentAdDuration = 0.0;
        currentAdOffset = 0.0;
        inAd = false;
        buffering = false;

        streamingAnalytics.setMediaPlayerName("THEOplayer");
        streamingAnalytics.setMediaPlayerVersion(playerVersion);

        addEventListeners();
    }

    public void setMedatata(ComscoreMetaData metadata) {
        Log.i("THEOlog", "DEBUG: setting theo metadata and removing old comscore metadata");
        comscoreMetaData = metadata;
        currentContentMetadata = null;
    }

    public void addEventListeners() {
//        // TODO check if durationchange gives content duration when there's a preroll
//        player.addEventListener(PlayerEventTypes.DURATIONCHANGE, durationChangeEvent -> {
//            Double durationInSeconds = durationChangeEvent.getDuration();
//            Log.i("THEOlog", "DEBUG: DURATIONCHANGE event: " + durationInSeconds);
//            if (!inAd && !durationInSeconds.isNaN() && durationInSeconds > 0) {
//                if (durationInSeconds.isInfinite()) {
//                    videoDuration = 0.0;
//                } else {
//                    videoDuration = durationInSeconds * 1000;
//                }
//                Log.i("THEOlog", "DEBUG: Setting content metadata");
//                setContentMetadata();
//            }
//        });

        player.addEventListener(PlayerEventTypes.SOURCECHANGE, sourceChangeEvent -> {
            Log.i("THEOlog", "DEBUG: SOURCECHANGE event");
            comScoreState = ComscoreState.INITIALIZED;
            currentContentMetadata = null;
            Log.i(TAG, "DEBUG: createPlaybackSession");
            streamingAnalytics.createPlaybackSession();
        });

        player.addEventListener(PlayerEventTypes.LOADEDMETADATA, loadedMetadataEvent -> {
            if (comscoreMetaData.getLength() == 0L && !inAd) {
                Log.i("THEOLog", "DEBUG: detected stream type LIVE");
                try {
                    player.requestSeekable(seekableRanges -> {
                        if (seekableRanges.length() > 0) {
                            double dvrWindowEnd = seekableRanges.getEnd(seekableRanges.length() - 1);
                            double dvrWindowLengthInSeconds = dvrWindowEnd - seekableRanges.getStart(0);
                            if (dvrWindowLengthInSeconds > 0) {
                                Log.i("THEOLog", "DEBUG: set DVR window length of " + dvrWindowLengthInSeconds);
                                streamingAnalytics.setDvrWindowLength(new Double(dvrWindowLengthInSeconds * 1000).longValue());
                            }
                        }
                    });
                } catch (Exception e) {
                    Log.i("THEOLog", "No seekable ranges available");
                }
            }
        });

        player.addEventListener(PlayerEventTypes.PLAYING, playingEvent -> {
            // If in the buffering state, get out of it and notify comscore about this
            if (buffering) {
                buffering = false;
                Log.i(TAG, "DEBUG: notifyBufferStop");
                streamingAnalytics.notifyBufferStop();
            }

            if (inAd) {
                transitionToAdvertisement(); // will set ad metadata and notify play if not done already
            } else if (currentAdOffset < 0.0) {
                Log.i(TAG, "DEBUG: IGNORING PLAYING event after post-roll");
                return; // last played ad was a post-roll so there's no real content coming, return and report nothing
            } else {
                transitionToVideo();// will set content metadata and notify play if not done already
            }
        });

        player.addEventListener(PlayerEventTypes.PAUSE, pauseEvent -> {
            Log.i(TAG, "DEBUG: PAUSE event");
            transitionToPaused();
        });

        player.addEventListener(PlayerEventTypes.SEEKING, seekingEvent -> {
            Log.i(TAG, "DEBUG: notifySeekStart");
            streamingAnalytics.notifySeekStart();
        });

        player.addEventListener(PlayerEventTypes.SEEKED, seekedEvent -> {
            Log.i("THEOlog", "DEBUG: SEEKED to: " + seekedEvent.getCurrentTime());
            Double currentTime = seekedEvent.getCurrentTime();
            if (Double.isNaN(player.getDuration())) {
                player.requestSeekable(seekableRanges -> {
                    double dvrWindowEnd = seekableRanges.getEnd(seekableRanges.length() - 1);
                    Long newDvrWindowOffset = new Double(dvrWindowEnd - currentTime).longValue()*1000;
                    Log.i("THEOlog", "DEBUG: new dvrWindowOffset: " + newDvrWindowOffset.toString());
                    streamingAnalytics.startFromDvrWindowOffset(newDvrWindowOffset);
                });
            } else {
                Long newPosition = new Double(currentTime).longValue()*1000;
                Log.i("THEOlog", "DEBUG: new position: " + newPosition.toString());
                Log.i(TAG, "DEBUG: startFromPosition");
                streamingAnalytics.startFromPosition(newPosition);
            }
        });

        player.addEventListener(PlayerEventTypes.WAITING, waitingEvent -> {
            if ((comScoreState == ComscoreState.ADVERTISEMENT && inAd)|| (comScoreState == ComscoreState.VIDEO && !inAd)) {
                buffering = true;
                Log.i(TAG, "DEBUG: notifyBufferStart");
                streamingAnalytics.notifyBufferStart();
            }
        });

        player.addEventListener(PlayerEventTypes.RATECHANGE, rateChangeEvent -> {
            streamingAnalytics.notifyChangePlaybackRate(new Double(rateChangeEvent.getPlaybackRate()).floatValue());
        });

        player.addEventListener(PlayerEventTypes.ERROR, errorEvent -> {
            Log.i("THEOlog", "DEBUG: ERROR event");
            transitionToStopped();
        });

        player.addEventListener(PlayerEventTypes.CONTENTPROTECTIONERROR, contentProtectionErrorEvent -> {
            Log.i("THEOlog", "DEBUG: DRM ERROR event");
            transitionToStopped();
        });

        player.addEventListener(PlayerEventTypes.ENDED, endedEvent -> {
            Log.i("THEOlog", "DEBUG: ENDED event");
            transitionToStopped();
            player.addEventListener(PlayerEventTypes.SEEKED, onFirstSeekedAfterEnded);
        });

        player.getAds().addEventListener(AdsEventTypes.AD_BREAK_BEGIN, adBreakBeginEvent -> {
            Log.i(TAG, "DEBUG: AD_BREAK_BEGIN event");
            currentAdOffset = new Double(adBreakBeginEvent.getAdBreak().getTimeOffset());
            inAd = true;
            transitionToStopped();
        });

        player.getAds().addEventListener(AdsEventTypes.AD_BREAK_END, adBreakEndEvent -> {
            Log.i(TAG, "DEBUG: AD_BREAK_END event");
            inAd = false;
            transitionToStopped();
        });

        player.getAds().addEventListener(AdsEventTypes.AD_BEGIN, adBeginEvent -> {
            Log.i(TAG, "DEBUG: AD_BEGIN event");
            currentAdDuration = new Double(player.getDuration() * 1000);
            setAdMetadata(currentAdDuration,currentAdOffset, adBeginEvent.getAd().getId());
        });

        Log.i("THEOlog", "DEBUG: done setting up listeners");
    }

    private void setAdMetadata(Double currentAdDuration, Double currentAdOffset, String adId) {
        int advertisementType;
        Log.i("THEOlog", "DEBUG: setting ad metadata ad duration: " + currentAdDuration + " ad offset: " + currentAdOffset);
        if (comscoreMetaData.getLength() == 0L) {
            advertisementType = AdvertisementType.LIVE;
        } else if (currentAdOffset == 0.0) {
            advertisementType = AdvertisementType.ON_DEMAND_PRE_ROLL;
        } else if (currentAdOffset < 0.0) {
            advertisementType = AdvertisementType.ON_DEMAND_POST_ROLL;
        } else {
            advertisementType = AdvertisementType.ON_DEMAND_MID_ROLL;
        }

        if (currentContentMetadata == null) {
            buildContentMetadata();
        }

        AdvertisementMetadata advertisementMetadata = new AdvertisementMetadata.Builder()
                .mediaType(advertisementType)
                .uniqueId(adId)
                .length(currentAdDuration.longValue())
                .relatedContentMetadata(currentContentMetadata)
                .build();

        streamingAnalytics.setMetadata(advertisementMetadata);
    }

    private void setContentMetadata() {
        Log.i(TAG, "DEBUG: setting content metadata with duration " + comscoreMetaData.getLength());
        if (currentContentMetadata == null) {
            buildContentMetadata();
        }
        streamingAnalytics.setMetadata(currentContentMetadata);
    }

    private void buildContentMetadata() {
      currentContentMetadata = comscoreMetaData.toComscoreContentMetadata();
    }


    private void transitionToStopped(){
        switch (comScoreState) {
            case STOPPED:
                Log.i(TAG, "DEBUG: Ignoring transition to STOPPED while in " + comScoreState.toString());
                break;
            default:
                Log.i(TAG, "DEBUG: transition to STOPPED while in " + comScoreState.toString());
                comScoreState = ComscoreState.STOPPED;
                Log.i(TAG, "DEBUG: notifyEnd");
                streamingAnalytics.notifyEnd();
        }
    }

    private void transitionToPaused(){
        switch (comScoreState){
            case VIDEO:
                Log.i(TAG, "DEBUG: transition to PAUSED_VIDEO while in " + comScoreState.toString());
                comScoreState = ComscoreState.PAUSED_VIDEO;
                Log.i(TAG, "DEBUG: notifyPause");
                streamingAnalytics.notifyPause();
                break;
            case ADVERTISEMENT:
                Log.i(TAG, "DEBUG: transition to PAUSED_AD while in " + comScoreState.toString());
                comScoreState = ComscoreState.PAUSED_AD;
                Log.i(TAG, "DEBUG: notifyPause");
                streamingAnalytics.notifyPause();
                break;
            default:
                Log.i(TAG, "DEBUG: Ignore transition to PAUSED while in " + comScoreState.toString());

        }
    }

    private void transitionToAdvertisement(){
        Date date = new Date();
        Timestamp ts = new Timestamp(date.getTime());  // 2021-03-24 16:34:26.666
        Log.i(TAG, "DEBUG: trying to transition to ADVERTISEMENT while in " + comScoreState.toString() + " at " + ts.toString());
        switch (comScoreState) {
            case PAUSED_AD:
            case INITIALIZED:
                Log.i(TAG, "DEBUG: transitioned to ADVERTISEMENT while in " + comScoreState.toString() + " at " + ts.toString());
                comScoreState = ComscoreState.ADVERTISEMENT;
                Log.i(TAG, "DEBUG: notifyPlay");
                streamingAnalytics.notifyPlay();
                break;
            case VIDEO:
            case PAUSED_VIDEO:
            case STOPPED:
                transitionToStopped();
                Log.i(TAG, "DEBUG: transitioned to ADVERTISEMENT while in " + comScoreState.toString() + " at " + ts.toString());
                comScoreState = ComscoreState.ADVERTISEMENT;
                Log.i(TAG, "DEBUG: notifyPlay");
                streamingAnalytics.notifyPlay();
                break;
            case ADVERTISEMENT:
            default:
                break;
        }
    }

    private void transitionToVideo(){
        Log.i(TAG, "DEBUG: trying to transition to VIDEO while in " + comScoreState.toString());
        switch (comScoreState) {
            case PAUSED_VIDEO:
                Log.i(TAG, "DEBUG: transitioned to VIDEO while in " + comScoreState.toString());
                comScoreState = ComscoreState.VIDEO;
                Log.i(TAG, "DEBUG: notifyPlay");
                streamingAnalytics.notifyPlay();
                break;
            case ADVERTISEMENT:
            case PAUSED_AD:
            case STOPPED:
                transitionToStopped();
                Log.i(TAG, "DEBUG: transitioned to VIDEO while in " + comScoreState.toString());
                comScoreState = ComscoreState.VIDEO;
                setContentMetadata();
                Log.i(TAG, "DEBUG: notifyPlay");
                streamingAnalytics.notifyPlay();
                break;
            case INITIALIZED:
                Log.i(TAG, "DEBUG: transitioned to VIDEO while in " + comScoreState.toString());
                comScoreState = ComscoreState.VIDEO;
                break;
            case VIDEO:
            default:
                break;
        }
    }

    public void notifyEnd() {
        Log.i(TAG, "DEBUG: notifyEnd");
        streamingAnalytics.notifyEnd();
    }

    public void notifyPause() {
        Log.i(TAG, "DEBUG: notifyPause");
        streamingAnalytics.notifyPause();
    }

    public void setPersistentLabel(String label, String value) {
        ComscoreUtils.notifyHiddenEvent(configuration.getPublisherId(), label, value);
    }

    public void setPersistentLabels(Map<String,String> labels) {
        ComscoreUtils.notifyHiddenEvents(configuration.getPublisherId(), labels);
    }
}
