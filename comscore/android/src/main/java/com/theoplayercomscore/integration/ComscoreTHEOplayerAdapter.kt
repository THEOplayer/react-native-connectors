package com.theoplayercomscore.integration

import android.util.Log
import com.comscore.BuildConfig
import com.comscore.streaming.AdvertisementMetadata
import com.comscore.streaming.AdvertisementType
import com.comscore.streaming.ContentMetadata
import com.comscore.streaming.StreamingAnalytics
import com.theoplayer.android.api.event.EventListener
import com.theoplayer.android.api.event.ads.AdBeginEvent
import com.theoplayer.android.api.event.ads.AdBreakBeginEvent
import com.theoplayer.android.api.event.ads.AdsEventTypes
import com.theoplayer.android.api.event.player.*
import com.theoplayer.android.api.player.Player
import java.sql.Timestamp
import java.util.*

private const val TAG = "ComscoreConnector"

class ComscoreTHEOplayerAdapter(
  private val player: Player,
  playerVersion: String?,
  private val configuration: ComscoreConfiguration,
  private var comscoreMetaData: ComscoreMetaData
) {
  private var currentContentMetadata: ContentMetadata? = null
  private val streamingAnalytics: StreamingAnalytics = StreamingAnalytics()
  private var comScoreState: ComscoreState
  private var currentAdDuration: Double
  private var currentAdOffset: Double
  private var buffering: Boolean
  private val dvrWindowEnd: Double? = null
  private var inAd: Boolean

  private val onFirstSeekedAfterEnded = EventListener { seekedEvent: SeekedEvent ->
    if (seekedEvent.currentTime < 0.5) {
      if (BuildConfig.DEBUG) {
        Log.i(TAG, "DEBUG: SEEKED event to start after an end event, create new session")
      }
      streamingAnalytics.createPlaybackSession()
      currentAdOffset = 0.0 // Set to default value
      setContentMetadata()
    }
    player.removeEventListener(PlayerEventTypes.SEEKED, onFirstSeekedAfterEnded)
  }

  private enum class ComscoreState {
    INITIALIZED, STOPPED, PAUSED_AD, PAUSED_VIDEO, ADVERTISEMENT, VIDEO
  }

  init {
    comScoreState = ComscoreState.INITIALIZED
    val videoDuration = 0.0
    currentAdDuration = 0.0
    currentAdOffset = 0.0
    inAd = false
    buffering = false
    streamingAnalytics.setMediaPlayerName("THEOplayer")
    streamingAnalytics.setMediaPlayerVersion(playerVersion)
    addEventListeners()
  }

  fun setMedatata(metadata: ComscoreMetaData) {
    if (BuildConfig.DEBUG) {
      Log.i(TAG, "DEBUG: setting theo metadata and removing old comscore metadata")
    }
    comscoreMetaData = metadata
    currentContentMetadata = null
  }

  private fun addEventListeners() {
//        // TODO check if durationchange gives content duration when there's a preroll
//        player.addEventListener(PlayerEventTypes.DURATIONCHANGE, durationChangeEvent -> {
//            Double durationInSeconds = durationChangeEvent.getDuration();
//            Log.i(TAG, "DEBUG: DURATIONCHANGE event: " + durationInSeconds);
//            if (!inAd && !durationInSeconds.isNaN() && durationInSeconds > 0) {
//                if (durationInSeconds.isInfinite()) {
//                    videoDuration = 0.0;
//                } else {
//                    videoDuration = durationInSeconds * 1000;
//                }
//                Log.i(TAG, "DEBUG: Setting content metadata");
//                setContentMetadata();
//            }
//        });
    player.addEventListener(PlayerEventTypes.SOURCECHANGE) {
      if (BuildConfig.DEBUG) {
        Log.i(TAG, "DEBUG: SOURCECHANGE event")
      }
      comScoreState = ComscoreState.INITIALIZED
      currentContentMetadata = null
      if (BuildConfig.DEBUG) {
        Log.i(TAG, "DEBUG: createPlaybackSession")
      }
      streamingAnalytics.createPlaybackSession()
    }
    player.addEventListener(PlayerEventTypes.LOADEDMETADATA) {
      if (comscoreMetaData.length == 0L && !inAd) {
        if (BuildConfig.DEBUG) {
          Log.i(TAG, "DEBUG: detected stream type LIVE")
        }
        try {
          val seekableRanges = player.seekable
          if (seekableRanges.length() > 0) {
            val dvrWindowEnd = seekableRanges.getEnd(seekableRanges.length() - 1)
            val dvrWindowLengthInSeconds = dvrWindowEnd - seekableRanges.getStart(0)
            if (dvrWindowLengthInSeconds > 0) {
              if (BuildConfig.DEBUG) {
                Log.i(
                  TAG,
                  "DEBUG: set DVR window length of $dvrWindowLengthInSeconds"
                )
              }
              streamingAnalytics.setDvrWindowLength(
                java.lang.Double.valueOf(
                  dvrWindowLengthInSeconds * 1000
                ).toLong()
              )
            }
          }
        } catch (e: Exception) {
          if (BuildConfig.DEBUG) {
            Log.e(TAG, "No seekable ranges available")
          }
        }
      }
    }
    player.addEventListener(PlayerEventTypes.PLAYING) {
      // If in the buffering state, get out of it and notify comscore about this
      if (buffering) {
        buffering = false
        if (BuildConfig.DEBUG) {
          Log.i(TAG, "DEBUG: notifyBufferStop")
        }
        streamingAnalytics.notifyBufferStop()
      }
      if (inAd) {
        transitionToAdvertisement() // will set ad metadata and notify play if not done already
      } else if (currentAdOffset < 0.0) {
        if (BuildConfig.DEBUG) {
          Log.i(TAG, "DEBUG: IGNORING PLAYING event after post-roll")
        }
        return@addEventListener   // last played ad was a post-roll so there's no real content coming, return and report nothing
      } else {
        transitionToVideo() // will set content metadata and notify play if not done already
      }
    }
    player.addEventListener(PlayerEventTypes.PAUSE) {
      if (BuildConfig.DEBUG) {
        Log.i(TAG, "DEBUG: PAUSE event")
      }
      transitionToPaused()
    }
    player.addEventListener(PlayerEventTypes.SEEKING) {
      if (BuildConfig.DEBUG) {
        Log.i(TAG, "DEBUG: notifySeekStart")
      }
      streamingAnalytics.notifySeekStart()
    }
    player.addEventListener(/* p0 = */ PlayerEventTypes.SEEKED) { seekedEvent: SeekedEvent ->
      if (BuildConfig.DEBUG) {
        Log.i(TAG, "DEBUG: SEEKED to: " + seekedEvent.currentTime)
      }
      val currentTime = seekedEvent.currentTime
      if (java.lang.Double.isNaN(player.duration)) {
        val seekableRanges = player.seekable
        val dvrWindowEnd = seekableRanges.getEnd(seekableRanges.length() - 1)
        val newDvrWindowOffset =
          java.lang.Double.valueOf(dvrWindowEnd - currentTime).toLong() * 1000
        if (BuildConfig.DEBUG) {
          Log.i(TAG, "DEBUG: new dvrWindowOffset: $newDvrWindowOffset")
        }
        streamingAnalytics.startFromDvrWindowOffset(newDvrWindowOffset)
      } else {
        val newPosition = java.lang.Double.valueOf(currentTime).toLong() * 1000
        if (BuildConfig.DEBUG) {
          Log.i(TAG, "DEBUG: new position: $newPosition")
          Log.i(TAG, "DEBUG: startFromPosition")
        }
        streamingAnalytics.startFromPosition(newPosition)
      }
    }
    player.addEventListener(PlayerEventTypes.WAITING) {
      if (comScoreState == ComscoreState.ADVERTISEMENT && inAd || comScoreState == ComscoreState.VIDEO && !inAd) {
        buffering = true
        if (BuildConfig.DEBUG) {
          Log.i(TAG, "DEBUG: notifyBufferStart")
        }
        streamingAnalytics.notifyBufferStart()
      }
    }
    player.addEventListener(PlayerEventTypes.RATECHANGE) { rateChangeEvent: RateChangeEvent ->
      streamingAnalytics.notifyChangePlaybackRate(
        java.lang.Double.valueOf(rateChangeEvent.playbackRate).toFloat()
      )
    }
    player.addEventListener(PlayerEventTypes.ERROR) {
      if (BuildConfig.DEBUG) {
        Log.i(TAG, "DEBUG: ERROR event")
      }
      transitionToStopped()
    }
    player.addEventListener(PlayerEventTypes.CONTENTPROTECTIONERROR) {
      if (BuildConfig.DEBUG) {
        Log.i(TAG, "DEBUG: DRM ERROR event")
      }
      transitionToStopped()
    }
    player.addEventListener(PlayerEventTypes.ENDED) {
      if (BuildConfig.DEBUG) {
        Log.i(TAG, "DEBUG: ENDED event")
      }
      transitionToStopped()
      player.addEventListener(PlayerEventTypes.SEEKED, onFirstSeekedAfterEnded)
    }
    player.ads.addEventListener(AdsEventTypes.AD_BREAK_BEGIN) { adBreakBeginEvent: AdBreakBeginEvent ->
      if (BuildConfig.DEBUG) {
        Log.i(TAG, "DEBUG: AD_BREAK_BEGIN event")
      }
      currentAdOffset = adBreakBeginEvent.adBreak.timeOffset.toDouble()
      inAd = true
      transitionToStopped()
    }
    player.ads.addEventListener(AdsEventTypes.AD_BREAK_END) {
      if (BuildConfig.DEBUG) {
        Log.i(TAG, "DEBUG: AD_BREAK_END event")
      }
      inAd = false
      transitionToStopped()
    }
    player.ads.addEventListener(AdsEventTypes.AD_BEGIN) { adBeginEvent: AdBeginEvent ->
      if (BuildConfig.DEBUG) {
        Log.i(TAG, "DEBUG: AD_BEGIN event")
      }
      currentAdDuration = player.duration * 1000
      setAdMetadata(currentAdDuration, currentAdOffset, adBeginEvent.ad!!.id)
    }
    if (BuildConfig.DEBUG) {
      Log.i(TAG, "DEBUG: done setting up listeners")
    }
  }

  private fun setAdMetadata(currentAdDuration: Double, currentAdOffset: Double, adId: String) {
    if (BuildConfig.DEBUG) {
      Log.i(
        TAG,
        "DEBUG: setting ad metadata ad duration: $currentAdDuration ad offset: $currentAdOffset"
      )
    }
    val advertisementType: Int = if (comscoreMetaData.length == 0L) {
      AdvertisementType.LIVE
    } else if (currentAdOffset == 0.0) {
      AdvertisementType.ON_DEMAND_PRE_ROLL
    } else if (currentAdOffset < 0.0) {
      AdvertisementType.ON_DEMAND_POST_ROLL
    } else {
      AdvertisementType.ON_DEMAND_MID_ROLL
    }
    if (currentContentMetadata == null) {
      buildContentMetadata()
    }
    val advertisementMetadata = AdvertisementMetadata.Builder()
      .mediaType(advertisementType)
      .uniqueId(adId)
      .length(currentAdDuration.toLong())
      .relatedContentMetadata(currentContentMetadata)
      .build()
    streamingAnalytics.setMetadata(advertisementMetadata)
  }

  private fun setContentMetadata() {
    if (BuildConfig.DEBUG) {
      Log.i(TAG, "DEBUG: setting content metadata with duration " + comscoreMetaData.length)
    }
    if (currentContentMetadata == null) {
      buildContentMetadata()
    }
    streamingAnalytics.setMetadata(currentContentMetadata)
  }

  private fun buildContentMetadata() {
    currentContentMetadata = comscoreMetaData.toComscoreContentMetadata()
  }

  private fun transitionToStopped() {
    when (comScoreState) {
      ComscoreState.STOPPED -> if (BuildConfig.DEBUG) {
        Log.i(TAG, "DEBUG: Ignoring transition to STOPPED while in $comScoreState")
      }
      else -> {
        if (BuildConfig.DEBUG) {
          Log.i(TAG, "DEBUG: transition to STOPPED while in $comScoreState")
        }
        comScoreState = ComscoreState.STOPPED
        if (BuildConfig.DEBUG) {
          Log.i(TAG, "DEBUG: notifyEnd")
        }
        streamingAnalytics.notifyEnd()
      }
    }
  }

  private fun transitionToPaused() {
    when (comScoreState) {
      ComscoreState.VIDEO -> {
        if (BuildConfig.DEBUG) {
          Log.i(TAG, "DEBUG: transition to PAUSED_VIDEO while in $comScoreState")
        }
        comScoreState = ComscoreState.PAUSED_VIDEO
        if (BuildConfig.DEBUG) {
          Log.i(TAG, "DEBUG: notifyPause")
        }
        streamingAnalytics.notifyPause()
      }
      ComscoreState.ADVERTISEMENT -> {
        if (BuildConfig.DEBUG) {
          Log.i(TAG, "DEBUG: transition to PAUSED_AD while in $comScoreState")
        }
        comScoreState = ComscoreState.PAUSED_AD
        if (BuildConfig.DEBUG) {
          Log.i(TAG, "DEBUG: notifyPause")
        }
        streamingAnalytics.notifyPause()
      }
      else -> if (BuildConfig.DEBUG) {
        Log.i(TAG, "DEBUG: Ignore transition to PAUSED while in $comScoreState")
      }
    }
  }

  private fun transitionToAdvertisement() {
    val date = Date()
    val ts = Timestamp(date.time) // 2021-03-24 16:34:26.666
    if (BuildConfig.DEBUG) {
      Log.i(
        TAG,
        "DEBUG: trying to transition to ADVERTISEMENT while in $comScoreState at $ts"
      )
    }
    when (comScoreState) {
      ComscoreState.PAUSED_AD, ComscoreState.INITIALIZED -> {
        if (BuildConfig.DEBUG) {
          Log.i(
            TAG,
            "DEBUG: transitioned to ADVERTISEMENT while in $comScoreState at $ts"
          )
        }
        comScoreState = ComscoreState.ADVERTISEMENT
        if (BuildConfig.DEBUG) {
          Log.i(TAG, "DEBUG: notifyPlay")
        }
        streamingAnalytics.notifyPlay()
      }
      ComscoreState.VIDEO, ComscoreState.PAUSED_VIDEO, ComscoreState.STOPPED -> {
        transitionToStopped()
        if (BuildConfig.DEBUG) {
          Log.i(
            TAG,
            "DEBUG: transitioned to ADVERTISEMENT while in $comScoreState at $ts"
          )
        }
        comScoreState = ComscoreState.ADVERTISEMENT
        if (BuildConfig.DEBUG) {
          Log.i(TAG, "DEBUG: notifyPlay")
        }
        streamingAnalytics.notifyPlay()
      }
      ComscoreState.ADVERTISEMENT -> {}
    }
  }

  private fun transitionToVideo() {
    if (BuildConfig.DEBUG) {
      Log.i(TAG, "DEBUG: trying to transition to VIDEO while in $comScoreState")
    }
    when (comScoreState) {
      ComscoreState.PAUSED_VIDEO -> {
        if (BuildConfig.DEBUG) {
          Log.i(TAG, "DEBUG: transitioned to VIDEO while in $comScoreState")
        }
        comScoreState = ComscoreState.VIDEO
        if (BuildConfig.DEBUG) {
          Log.i(TAG, "DEBUG: notifyPlay")
        }
        streamingAnalytics.notifyPlay()
      }
      ComscoreState.ADVERTISEMENT, ComscoreState.PAUSED_AD, ComscoreState.STOPPED -> {
        transitionToStopped()
        if (BuildConfig.DEBUG) {
          Log.i(TAG, "DEBUG: transitioned to VIDEO while in $comScoreState")
        }
        comScoreState = ComscoreState.VIDEO
        setContentMetadata()
        if (BuildConfig.DEBUG) {
          Log.i(TAG, "DEBUG: notifyPlay")
        }
        streamingAnalytics.notifyPlay()
      }
      ComscoreState.INITIALIZED -> {
        if (BuildConfig.DEBUG) {
          Log.i(TAG, "DEBUG: transitioned to VIDEO while in $comScoreState")
        }
        comScoreState = ComscoreState.VIDEO
        setContentMetadata()
        streamingAnalytics.notifyPlay()
      }
      ComscoreState.VIDEO -> {}
    }
  }

  fun notifyEnd() {
    if (BuildConfig.DEBUG) {
      Log.i(TAG, "DEBUG: notifyEnd")
    }
    streamingAnalytics.notifyEnd()
  }

  fun notifyPause() {
    if (BuildConfig.DEBUG) {
      Log.i(TAG, "DEBUG: notifyPause")
    }
    streamingAnalytics.notifyPause()
  }

  fun setPersistentLabel(label: String?, value: String?) {
    ComscoreUtils.notifyHiddenEvent(configuration.publisherId, label, value)
  }

  fun setPersistentLabels(labels: Map<String, String>) {
    ComscoreUtils.notifyHiddenEvents(configuration.publisherId, labels)
  }
}
