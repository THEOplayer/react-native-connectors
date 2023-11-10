package com.theoplayercomscore.integration

import android.util.Log
import com.comscore.streaming.AdvertisementMetadata
import com.comscore.streaming.AdvertisementType
import com.comscore.streaming.ContentMetadata
import com.comscore.streaming.StreamingAnalytics
import com.theoplayer.android.api.ads.AdBreak
import com.theoplayer.android.api.ads.GoogleImaAd
import com.theoplayer.android.api.ads.ima.GoogleImaAdEvent
import com.theoplayer.android.api.ads.ima.GoogleImaAdEventType
import com.theoplayer.android.api.event.EventListener
import com.theoplayer.android.api.event.player.*
import com.theoplayer.android.api.player.Player
import com.theoplayercomscore.BuildConfig
import java.lang.Double.isNaN
import java.sql.Timestamp
import java.util.*

private const val TAG = "ComscoreConnector"

class ComscoreAdapter(
  private val player: Player,
  playerVersion: String?,
  private val configuration: ComscoreConfiguration,
  private var comscoreMetaData: ComscoreMetaData
) {
  private var currentContentMetadata: ContentMetadata? = null
  private val streamingAnalytics: StreamingAnalytics = StreamingAnalytics()
  private var comScoreState: ComscoreState = ComscoreState.INITIALIZED
  private var currentAdDuration: Double = 0.0
  private var currentAdOffset: Double = 0.0
  private var buffering: Boolean = false
  private var ended: Boolean = false
  private var inAd: Boolean = false
  private var currentAdBreak: AdBreak? = null

  private val onSourceChange: EventListener<SourceChangeEvent>
  private val onLoadedMetadata: EventListener<LoadedMetadataEvent>
  private val onDurationChange: EventListener<DurationChangeEvent>
  private val onPlay: EventListener<PlayEvent>
  private val onPlaying: EventListener<PlayingEvent>
  private val onPause: EventListener<PauseEvent>
  private val onSeeking: EventListener<SeekingEvent>
  private val onSeeked: EventListener<SeekedEvent>
  private val onWaiting: EventListener<WaitingEvent>
  private val onRateChange: EventListener<RateChangeEvent>
  private val onError: EventListener<ErrorEvent>
  private val onContentProtectionError: EventListener<ContentProtectionErrorEvent>
  private val onEnded: EventListener<EndedEvent>
  private val onAdStarted: EventListener<GoogleImaAdEvent>
  private val onContentResume: EventListener<GoogleImaAdEvent>

  private enum class ComscoreState {
    INITIALIZED, STOPPED, PAUSED_AD, PAUSED_VIDEO, ADVERTISEMENT, VIDEO
  }

  init {
    streamingAnalytics.setMediaPlayerName("THEOplayer")
    streamingAnalytics.setMediaPlayerVersion(playerVersion)

    onSourceChange = EventListener { handleSourceChange() }
    onLoadedMetadata = EventListener { handleMetadataLoaded() }
    onDurationChange = EventListener { event -> handleDurationChange(event) }
    onPlay = EventListener { handlePlay() }
    onPlaying = EventListener { handlePlaying() }
    onPause = EventListener { handlePause() }
    onSeeking = EventListener { handleSeeking() }
    onSeeked = EventListener { event -> handleSeeked(event) }
    onWaiting = EventListener { handleWaiting() }
    onRateChange = EventListener { event -> handleRateChange(event) }
    onError = EventListener { handleError() }
    onContentProtectionError = EventListener { handleError() }
    onEnded = EventListener { handleEnded() }
    onAdStarted = EventListener { event -> handleAdBegin(event.ad) }
    onContentResume = EventListener { handleContentResume() }

    addEventListeners()
  }

  fun destroy() {
    player.removeEventListener(PlayerEventTypes.SOURCECHANGE, onSourceChange)
    player.removeEventListener(PlayerEventTypes.LOADEDMETADATA, onLoadedMetadata)
    player.removeEventListener(PlayerEventTypes.DURATIONCHANGE, onDurationChange)
    player.removeEventListener(PlayerEventTypes.PLAY, onPlay)
    player.removeEventListener(PlayerEventTypes.PLAYING, onPlaying)
    player.removeEventListener(PlayerEventTypes.PAUSE, onPause)
    player.removeEventListener(PlayerEventTypes.SEEKING, onSeeking)
    player.removeEventListener(PlayerEventTypes.SEEKED, onSeeked)
    player.removeEventListener(PlayerEventTypes.WAITING, onWaiting)
    player.removeEventListener(PlayerEventTypes.RATECHANGE, onRateChange)
    player.removeEventListener(PlayerEventTypes.ERROR, onError)
    player.removeEventListener(PlayerEventTypes.CONTENTPROTECTIONERROR, onContentProtectionError)
    player.removeEventListener(PlayerEventTypes.ENDED, onEnded)
    player.ads.removeEventListener(GoogleImaAdEventType.STARTED, onAdStarted)
    player.ads.removeEventListener(GoogleImaAdEventType.CONTENT_RESUME_REQUESTED, onContentResume)
  }

  fun setMedatata(metadata: ComscoreMetaData) {
    if (BuildConfig.DEBUG) {
      Log.i(TAG, "DEBUG: setting theo metadata and removing old comscore metadata")
    }
    comscoreMetaData = metadata
    currentContentMetadata = null
  }

  private fun addEventListeners() {
    player.addEventListener(PlayerEventTypes.SOURCECHANGE, onSourceChange)
    player.addEventListener(PlayerEventTypes.LOADEDMETADATA, onLoadedMetadata)
    player.addEventListener(PlayerEventTypes.DURATIONCHANGE, onDurationChange)
    player.addEventListener(PlayerEventTypes.PLAY, onPlay)
    player.addEventListener(PlayerEventTypes.PLAYING, onPlaying)
    player.addEventListener(PlayerEventTypes.PAUSE, onPause)
    player.addEventListener(PlayerEventTypes.SEEKING, onSeeking)
    player.addEventListener(PlayerEventTypes.SEEKED, onSeeked)
    player.addEventListener(PlayerEventTypes.WAITING, onWaiting)
    player.addEventListener(PlayerEventTypes.RATECHANGE, onRateChange)
    player.addEventListener(PlayerEventTypes.ERROR, onError)
    player.addEventListener(PlayerEventTypes.CONTENTPROTECTIONERROR, onContentProtectionError)
    player.addEventListener(PlayerEventTypes.ENDED, onEnded)
    player.ads.addEventListener(GoogleImaAdEventType.STARTED, onAdStarted)
    player.ads.addEventListener(GoogleImaAdEventType.CONTENT_RESUME_REQUESTED, onContentResume)
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
      ComscoreState.ADVERTISEMENT -> { /* Already in ADVERTISEMENT*/ }
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
        if (BuildConfig.DEBUG) {
          Log.i(TAG, "DEBUG: notifyPlay")
        }
        streamingAnalytics.notifyPlay()
      }
      ComscoreState.VIDEO -> {}
    }
  }

  private fun handleSourceChange() {
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

  private fun handleMetadataLoaded() {
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

  private fun handleDurationChange(durationChangeEvent: DurationChangeEvent) {
    // TODO check if durationchange gives content duration when there's a preroll
//      val durationInSeconds = durationChangeEvent.getDuration();
//      Log.i(TAG, "DEBUG: DURATIONCHANGE event: " + durationInSeconds);
//      if (!inAd && !durationInSeconds.isNaN() && durationInSeconds > 0) {
//          if (durationInSeconds.isInfinite()) {
//              videoDuration = 0.0;
//          } else {
//              videoDuration = durationInSeconds * 1000;
//          }
//          Log.i(TAG, "DEBUG: Setting content metadata");
//          setContentMetadata();
//      }
  }

  private fun handlePlay() {
    if (ended) {
      // Create new session when replaying an asset
      ended = false

      if (BuildConfig.DEBUG) {
        Log.i(TAG, "DEBUG: PLAY event to start after an end event, create new session")
      }
      streamingAnalytics.createPlaybackSession()
      currentAdOffset = 0.0 // Set to default value
      setContentMetadata()
    }
  }

  private fun handlePlaying() {
    // If in the buffering state, get out of it and notify comscore about this
    if (buffering) {
      buffering = false
      if (BuildConfig.DEBUG) {
        Log.i(TAG, "DEBUG: notifyBufferStop")
      }
      streamingAnalytics.notifyBufferStop()
      if (comScoreState == ComscoreState.VIDEO) {
        if (BuildConfig.DEBUG) {
          Log.i(TAG, "DEBUG: notifyPlay")
        }
        streamingAnalytics.notifyPlay()
      }
    }
    if (inAd) {
      transitionToAdvertisement() // will set ad metadata and notify play if not done already
    } else if (currentAdOffset < 0.0) {
      if (BuildConfig.DEBUG) {
        Log.i(TAG, "DEBUG: IGNORING PLAYING event after post-roll")
      }
      return   // last played ad was a post-roll so there's no real content coming, return and report nothing
    } else {
      transitionToVideo() // will set content metadata and notify play if not done already
    }
  }

  private fun handlePause() {
    if (BuildConfig.DEBUG) {
      Log.i(TAG, "DEBUG: PAUSE event")
    }
    transitionToPaused()
  }

  private fun handleSeeking() {
    if (BuildConfig.DEBUG) {
      Log.i(TAG, "DEBUG: notifySeekStart")
    }
    streamingAnalytics.notifySeekStart()
  }

  private fun handleSeeked(seekedEvent: SeekedEvent) {
    if (BuildConfig.DEBUG) {
      Log.i(TAG, "DEBUG: SEEKED to: " + seekedEvent.currentTime)
    }
    val currentTime = seekedEvent.currentTime
    if (isNaN(player.duration)) {
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

  private fun handleWaiting() {
    if (comScoreState == ComscoreState.ADVERTISEMENT && inAd || comScoreState == ComscoreState.VIDEO && !inAd) {
      buffering = true
      if (BuildConfig.DEBUG) {
        Log.i(TAG, "DEBUG: notifyBufferStart")
      }
      streamingAnalytics.notifyBufferStart()
    }
  }

  private fun handleRateChange(rateChangeEvent: RateChangeEvent) {
    streamingAnalytics.notifyChangePlaybackRate(
      java.lang.Double.valueOf(rateChangeEvent.playbackRate).toFloat()
    )
  }

  private fun handleError() {
    if (BuildConfig.DEBUG) {
      Log.i(TAG, "DEBUG: ERROR event")
    }
    transitionToStopped()
  }

  private fun handleEnded() {
    if (BuildConfig.DEBUG) {
      Log.i(TAG, "DEBUG: ENDED event")
    }
    transitionToStopped()
    ended = true
  }

  private fun handleAdBreakBegin(adBreak: AdBreak?) {
    this.currentAdBreak = adBreak

    if (BuildConfig.DEBUG) {
      Log.i(TAG, "DEBUG: AD_BREAK_BEGIN event")
    }
    currentAdOffset = adBreak?.timeOffset?.toDouble() ?: 0.0
    inAd = true
    transitionToAdvertisement()
  }

  private fun handleAdBegin(ad: GoogleImaAd?) {
    if (currentAdBreak == null && ad?.imaAd != null) {
      handleAdBreakBegin(ad.adBreak)
    }
    if (BuildConfig.DEBUG) {
      Log.i(TAG, "DEBUG: AD_BEGIN event")
    }
    currentAdDuration = (ad?.imaAd?.duration ?: 0.0) * 1000
    setAdMetadata(currentAdDuration, currentAdOffset, ad?.id ?: "")
  }

  private fun handleContentResume() {
    if (BuildConfig.DEBUG) {
      Log.i(TAG, "DEBUG: CONTENT_RESUME event")
    }
    inAd = false
    transitionToVideo()
  }

  fun setPersistentLabel(label: String, value: String) {
    ComscoreUtils.notifyHiddenEvent(configuration.publisherId, label, value)
  }

  fun setPersistentLabels(labels: Map<String, String>) {
    ComscoreUtils.notifyHiddenEvents(configuration.publisherId, labels)
  }
}
