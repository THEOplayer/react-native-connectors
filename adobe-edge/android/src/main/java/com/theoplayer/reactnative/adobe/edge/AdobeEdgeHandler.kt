package com.theoplayer.reactnative.adobe.edge

import android.util.Log
import com.adobe.marketing.mobile.LoggingMode
import com.adobe.marketing.mobile.MobileCore
import com.adobe.marketing.mobile.edge.identity.Identity
import com.adobe.marketing.mobile.edge.identity.IdentityMap
import com.adobe.marketing.mobile.edge.media.Media
import com.adobe.marketing.mobile.edge.media.Media.Event
import com.adobe.marketing.mobile.edge.media.MediaConstants
import com.theoplayer.android.api.ads.LinearAd
import com.theoplayer.android.api.event.EventListener
import com.theoplayer.android.api.event.ads.AdBeginEvent
import com.theoplayer.android.api.event.ads.AdBreakBeginEvent
import com.theoplayer.android.api.event.ads.AdBreakEndEvent
import com.theoplayer.android.api.event.ads.AdEndEvent
import com.theoplayer.android.api.event.ads.AdSkipEvent
import com.theoplayer.android.api.event.ads.AdsEventTypes
import com.theoplayer.android.api.event.player.EndedEvent
import com.theoplayer.android.api.event.player.ErrorEvent
import com.theoplayer.android.api.event.player.PauseEvent
import com.theoplayer.android.api.event.player.PlayerEventTypes
import com.theoplayer.android.api.event.player.PlayingEvent
import com.theoplayer.android.api.event.player.SeekedEvent
import com.theoplayer.android.api.event.player.SeekingEvent
import com.theoplayer.android.api.event.player.SourceChangeEvent
import com.theoplayer.android.api.event.player.TimeUpdateEvent
import com.theoplayer.android.api.event.player.WaitingEvent
import com.theoplayer.android.api.event.track.mediatrack.video.ActiveQualityChangedEvent
import com.theoplayer.android.api.event.track.mediatrack.video.VideoTrackEventTypes
import com.theoplayer.android.api.event.track.mediatrack.video.list.VideoTrackListEventTypes
import com.theoplayer.android.api.event.track.texttrack.EnterCueEvent
import com.theoplayer.android.api.event.track.texttrack.ExitCueEvent
import com.theoplayer.android.api.event.track.texttrack.TextTrackEventTypes
import com.theoplayer.android.api.event.track.texttrack.list.TextTrackListEventTypes
import com.theoplayer.android.api.player.Player
import com.theoplayer.android.api.player.track.texttrack.TextTrackKind
import com.theoplayer.android.api.player.track.texttrack.cue.TextTrackCue
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

typealias AddTextTrackEvent = com.theoplayer.android.api.event.track.texttrack.list.AddTrackEvent
typealias RemoveTextTrackEvent = com.theoplayer.android.api.event.track.texttrack.list.RemoveTrackEvent
typealias AddVideoTrackEvent = com.theoplayer.android.api.event.track.mediatrack.video.list.AddTrackEvent
typealias RemoveVideoTrackEvent = com.theoplayer.android.api.event.track.mediatrack.video.list.RemoveTrackEvent

private const val TAG = "AdobeEdgeConnector"

enum class EventType {
  PLAY,
  PAUSE,
  AD_BREAK_START,
  AD_BREAK_COMPLETE,
  AD_START,
  AD_COMPLETE,
  AD_SKIP,
  CHAPTER_START,
  CHAPTER_COMPLETE,
  CHAPTER_SKIP,
  SEEK_START,
  SEEK_COMPLETE,
  BUFFER_START,
  BUFFER_COMPLETE,
  BITRATE_CHANGE,
  STATE_START,
  STATE_END,
  PLAYHEAD_UPDATE,
  ERROR,
  COMPLETE,
  QOE_UPDATE,
  SESSION_END,
}

data class QueuedEvent(
  val type: EventType,
  val info: Map<String, Any>?,
  val metadata: Map<String, String>?
)

const val PROP_CURRENT_TIME = "currentTime"
const val PROP_ERROR_ID = "errorId"
const val PROP_NA = "NA"

class AdobeEdgeHandler(
  private val player: Player,
  trackerConfig: Map<String, String> = emptyMap(),
  customIdentityMap: IdentityMap? = null
) {
  private var sessionInProgress = false

  private var adBreakPodIndex = 0

  private var adPodPosition = 1

  private var isPlayingAd = false
  private var customMetadata: MutableMap<String, String> = mutableMapOf()
  private var currentChapter: TextTrackCue? = null
  private var loggingMode: LoggingMode = LoggingMode.ERROR
  private val onPlaying = EventListener<PlayingEvent> { handlePlaying() }
  private val onPause = EventListener<PauseEvent> { handlePause() }
  private val onEnded = EventListener<EndedEvent> { handleEnded() }
  private val onTimeUpdate = EventListener<TimeUpdateEvent> { handleTimeUpdate(it) }
  private val onWaiting = EventListener<WaitingEvent> { handleWaiting() }
  private val onSeeking = EventListener<SeekingEvent> { handleSeeking() }
  private val onSeeked = EventListener<SeekedEvent> { handleSeeked() }
  private val onSourceChange = EventListener<SourceChangeEvent> { handleSourceChange() }
  private val onAddTextTrack = EventListener<AddTextTrackEvent> { handleAddTextTrack(it) }
  private val onRemoveTextTrack = EventListener<RemoveTextTrackEvent> { handleRemoveTextTrack(it) }
  private val onAddVideoTrack = EventListener<AddVideoTrackEvent> { handleAddVideoTrack(it) }
  private val onRemoveVideoTrack =
    EventListener<RemoveVideoTrackEvent> { handleRemoveVideoTrack(it) }
  private val onActiveVideoQualityChanged =
    EventListener<ActiveQualityChangedEvent> { handleQualityChanged(it) }
  private val onEnterCue = EventListener<EnterCueEvent> { handleEnterCue(it) }
  private val onExitCue = EventListener<ExitCueEvent> { handleExitCue() }
  private val onError = EventListener<ErrorEvent> { handleError(it) }
  private val onAdBreakBegin =
    EventListener<AdBreakBeginEvent> { event -> handleAdBreakBegin(event) }
  private val onAdBreakEnd = EventListener<AdBreakEndEvent> { handleAdBreakEnd() }
  private val onAdBegin = EventListener<AdBeginEvent> { event -> handleAdBegin(event) }
  private val onAdEnd = EventListener<AdEndEvent> { handleAdEnd() }
  private val onAdSkip = EventListener<AdSkipEvent> { handleAdSkip() }

  private val scope = CoroutineScope(Dispatchers.Main)
  private val tracker = Media.createTracker(trackerConfig)
  private val eventQueue = mutableListOf<QueuedEvent>()
  private fun logDebug(message: String) {
    if (loggingMode >= LoggingMode.DEBUG) {
      Log.d(TAG, message)
    }
  }

  init {
    addEventListeners()
    customIdentityMap?.let { setCustomIdentityMap(it) }
    logDebug("Initialized connector")
  }

  fun setLoggingMode(loggingMode: LoggingMode) {
    this.loggingMode = loggingMode
    MobileCore.setLogLevel(loggingMode)
  }

  fun updateMetadata(metadata: Map<String, String>) {
    customMetadata += metadata
  }

  fun setCustomIdentityMap(customIdentityMap: IdentityMap) {
    /**
     * https://developer.adobe.com/client-sdks/edge/identity-for-edge-network/api-reference/#updateidentities
     */
    Identity.updateIdentities(customIdentityMap)
  }

  fun setError(errorId: String) {
    queueOrSendEvent(EventType.ERROR, mapOf(PROP_ERROR_ID to errorId), null)
  }

  fun stopAndStartNewSession(metadata: Map<String, String>?) {
    scope.launch {
      maybeEndSession()
      metadata?.let {
        updateMetadata(it)
      }
      maybeStartSession()
      if (player.isPaused) {
        handlePause()
      } else {
        handlePlaying()
      }
    }
  }

  private fun addEventListeners() {
    player.addEventListener(PlayerEventTypes.PLAYING, onPlaying)
    player.addEventListener(PlayerEventTypes.PAUSE, onPause)
    player.addEventListener(PlayerEventTypes.ENDED, onEnded)
    player.addEventListener(PlayerEventTypes.WAITING, onWaiting)
    player.addEventListener(PlayerEventTypes.SEEKING, onSeeking)
    player.addEventListener(PlayerEventTypes.SEEKED, onSeeked)
    player.addEventListener(PlayerEventTypes.TIMEUPDATE, onTimeUpdate)
    player.addEventListener(PlayerEventTypes.SOURCECHANGE, onSourceChange)
    player.textTracks.addEventListener(TextTrackListEventTypes.ADDTRACK, onAddTextTrack)
    player.textTracks.addEventListener(TextTrackListEventTypes.REMOVETRACK, onRemoveTextTrack)
    player.videoTracks.addEventListener(VideoTrackListEventTypes.ADDTRACK, onAddVideoTrack)
    player.videoTracks.addEventListener(VideoTrackListEventTypes.REMOVETRACK, onRemoveVideoTrack)
    player.addEventListener(PlayerEventTypes.ERROR, onError)
    player.ads.apply {
      addEventListener(AdsEventTypes.AD_BREAK_BEGIN, onAdBreakBegin)
      addEventListener(AdsEventTypes.AD_BREAK_END, onAdBreakEnd)
      addEventListener(AdsEventTypes.AD_BEGIN, onAdBegin)
      addEventListener(AdsEventTypes.AD_END, onAdEnd)
      addEventListener(AdsEventTypes.AD_SKIP, onAdSkip)
    }
  }

  private fun removeEventListeners() {
    player.removeEventListener(PlayerEventTypes.PLAYING, onPlaying)
    player.removeEventListener(PlayerEventTypes.PAUSE, onPause)
    player.removeEventListener(PlayerEventTypes.ENDED, onEnded)
    player.removeEventListener(PlayerEventTypes.WAITING, onWaiting)
    player.removeEventListener(PlayerEventTypes.SEEKING, onSeeking)
    player.removeEventListener(PlayerEventTypes.SEEKED, onSeeked)
    player.removeEventListener(PlayerEventTypes.TIMEUPDATE, onTimeUpdate)
    player.removeEventListener(PlayerEventTypes.SOURCECHANGE, onSourceChange)
    player.textTracks.removeEventListener(TextTrackListEventTypes.ADDTRACK, onAddTextTrack)
    player.textTracks.removeEventListener(
      TextTrackListEventTypes.REMOVETRACK, onRemoveTextTrack
    )
    player.videoTracks.removeEventListener(VideoTrackListEventTypes.ADDTRACK, onAddVideoTrack)
    player.videoTracks.removeEventListener(VideoTrackListEventTypes.REMOVETRACK, onRemoveVideoTrack)
    player.removeEventListener(PlayerEventTypes.ERROR, onError)
    player.ads.apply {
      removeEventListener(AdsEventTypes.AD_BREAK_BEGIN, onAdBreakBegin)
      removeEventListener(AdsEventTypes.AD_BREAK_END, onAdBreakEnd)
      removeEventListener(AdsEventTypes.AD_BEGIN, onAdBegin)
      removeEventListener(AdsEventTypes.AD_END, onAdEnd)
      removeEventListener(AdsEventTypes.AD_SKIP, onAdSkip)
    }
  }

  private fun sendEvent(
    event: EventType,
    info: Map<String, Any>? = null,
    metadata: Map<String, String>? = null
  ) {
    when (event) {
      EventType.AD_BREAK_START -> tracker.trackEvent(Event.AdBreakStart, info, metadata)
      EventType.AD_BREAK_COMPLETE -> tracker.trackEvent(Event.AdBreakComplete, info, metadata)
      EventType.AD_START -> tracker.trackEvent(Event.AdStart, info, metadata)
      EventType.AD_COMPLETE -> tracker.trackEvent(Event.AdComplete, info, metadata)
      EventType.AD_SKIP -> tracker.trackEvent(Event.AdSkip, info, metadata)
      EventType.CHAPTER_START -> tracker.trackEvent(Event.ChapterStart, info, metadata)
      EventType.CHAPTER_COMPLETE -> tracker.trackEvent(Event.ChapterComplete, info, metadata)
      EventType.CHAPTER_SKIP -> tracker.trackEvent(Event.ChapterSkip, info, metadata)
      EventType.SEEK_START -> tracker.trackEvent(Event.SeekStart, info, metadata)
      EventType.SEEK_COMPLETE -> tracker.trackEvent(Event.SeekComplete, info, metadata)
      EventType.BUFFER_START -> tracker.trackEvent(Event.BufferStart, info, metadata)
      EventType.BUFFER_COMPLETE -> tracker.trackEvent(Event.BufferComplete, info, metadata)
      EventType.BITRATE_CHANGE -> tracker.trackEvent(Event.BitrateChange, info, metadata)
      EventType.STATE_START -> tracker.trackEvent(Event.StateStart, info, metadata)
      EventType.STATE_END -> tracker.trackEvent(Event.StateEnd, info, metadata)
      EventType.PLAYHEAD_UPDATE -> tracker.updateCurrentPlayhead(
        (info?.get(PROP_CURRENT_TIME) as Int?) ?: 0
      )

      EventType.ERROR -> tracker.trackError(info?.get(PROP_ERROR_ID) as String? ?: PROP_NA)
      EventType.COMPLETE -> tracker.trackComplete()
      EventType.QOE_UPDATE -> tracker.updateQoEObject(info ?: emptyMap())
      EventType.SESSION_END -> tracker.trackSessionEnd()
      EventType.PLAY -> tracker.trackPlay()
      EventType.PAUSE -> tracker.trackPause()
    }
  }

  private fun queueOrSendEvent(
    type: EventType,
    info: Map<String, Any>? = null,
    metadata: Map<String, String>? = null
  ) {
    if (sessionInProgress) {
      sendEvent(type, info, metadata)
    } else {
      eventQueue.add(QueuedEvent(type, info, metadata))
    }
  }

  private fun handlePlaying() {
    // NOTE: In case of a pre-roll ad, the `playing` event will be sent twice: once starting the re-roll, and once
    // starting content. During the pre-roll, all events will be queued. The session will be started after the pre-roll,
    // making sure we can start the session with the correct content duration (not the ad duration).
    logDebug("onPlaying")
    maybeStartSession(player.duration)
    queueOrSendEvent(EventType.PLAY)
  }

  private fun handlePause() {
    logDebug("onPause")
    queueOrSendEvent(EventType.PAUSE)
  }

  private fun handleTimeUpdate(event: TimeUpdateEvent) {
    logDebug("onTimeUpdate")
    queueOrSendEvent(
      EventType.PLAYHEAD_UPDATE,
      mapOf(PROP_CURRENT_TIME to sanitisePlayhead(event.currentTime, player.duration))
    )
  }

  private fun handleWaiting() {
    logDebug("onWaiting")
    queueOrSendEvent(EventType.BUFFER_START)
  }

  private fun handleSeeking() {
    logDebug("handleSeeking")
    queueOrSendEvent(EventType.SEEK_START)
  }

  private fun handleSeeked() {
    logDebug("handleSeeked")
    queueOrSendEvent(EventType.SEEK_COMPLETE)
  }

  private fun handleEnded() {
    logDebug("onEnded")
    /**
     * Tracks the completion of the media playback session. Call this method only when the media has
     * been completely viewed. If the viewing session is ended before the media is completely viewed,
     * use trackSessionEnd instead.
     */
    queueOrSendEvent(EventType.COMPLETE)
    reset()
  }

  private fun handleSourceChange() {
    logDebug("onSourceChange")
    maybeEndSession()
  }

  private fun handleQualityChanged(event: ActiveQualityChangedEvent) {
    queueOrSendEvent(
      EventType.QOE_UPDATE, Media.createQoEObject(
        event.quality?.bandwidth?.toInt() ?: 0,
        0,
        0,
        0
      )
    )
  }

  private fun handleAddTextTrack(event: AddTextTrackEvent) {
    event.track.takeIf { it.kind == TextTrackKind.CHAPTERS.type }?.let { track ->
      logDebug("onAddTextTrack - add chapter track ${track.uid}")
      track.addEventListener(TextTrackEventTypes.ENTERCUE, onEnterCue)
      track.addEventListener(TextTrackEventTypes.EXITCUE, onExitCue)
    }
  }

  private fun handleRemoveTextTrack(event: RemoveTextTrackEvent) {
    event.track.takeIf { it.kind == TextTrackKind.CHAPTERS.type }?.let { track ->
      logDebug("onRemoveTextTrack - remove chapter track ${track.uid}")
      track.removeEventListener(TextTrackEventTypes.ENTERCUE, onEnterCue)
      track.removeEventListener(TextTrackEventTypes.EXITCUE, onExitCue)
    }
  }

  private fun handleAddVideoTrack(event: AddVideoTrackEvent) {
    logDebug("onAddVideoTrack")
    event.track.addEventListener(
      VideoTrackEventTypes.ACTIVEQUALITYCHANGEDEVENT, onActiveVideoQualityChanged
    )
  }

  private fun handleRemoveVideoTrack(event: RemoveVideoTrackEvent) {
    logDebug("onRemoveVideoTrack")
    event.track.removeEventListener(
      VideoTrackEventTypes.ACTIVEQUALITYCHANGEDEVENT, onActiveVideoQualityChanged
    )
  }

  private fun handleEnterCue(event: EnterCueEvent) {
    logDebug("onEnterCue")
    val chapterCue = event.cue
    if (currentChapter != null && currentChapter?.endTime != chapterCue.startTime) {
      queueOrSendEvent(EventType.CHAPTER_SKIP)
    }
    queueOrSendEvent(
      EventType.CHAPTER_START,
      Media.createChapterObject(
        chapterCue.id.ifEmpty { PROP_NA },
        chapterCue.id.toIntOrNull() ?: 1,
        chapterCue.endTime.toInt(),
        (chapterCue.endTime - chapterCue.startTime).toInt()
      ),
      customMetadata
    )
    currentChapter = chapterCue
  }

  private fun handleExitCue() {
    logDebug("onExitCue")
    queueOrSendEvent(EventType.CHAPTER_COMPLETE)
  }

  private fun handleError(event: ErrorEvent) {
    logDebug("onError")
    queueOrSendEvent(EventType.ERROR, mapOf("errorId" to event.errorObject.code.toString()))
  }

  private fun handleAdBreakBegin(event: AdBreakBeginEvent) {
    logDebug("onAdBreakBegin")
    isPlayingAd = true
    val currentAdBreakTimeOffset = event.adBreak.timeOffset
    val index = when {
      currentAdBreakTimeOffset == 0 -> 0
      currentAdBreakTimeOffset < 0 -> -1
      else -> adBreakPodIndex + 1
    }
    queueOrSendEvent(
      EventType.AD_BREAK_START, Media.createAdBreakObject(
        PROP_NA,
        index,
        currentAdBreakTimeOffset
      )
    )

    if (index > adBreakPodIndex) {
      adBreakPodIndex++
    }
  }

  private fun handleAdBreakEnd() {
    logDebug("onAdBreakEnd")
    isPlayingAd = false
    adPodPosition = 1
    queueOrSendEvent(EventType.AD_BREAK_COMPLETE)
  }

  private fun handleAdBegin(event: AdBeginEvent) {
    logDebug("onAdBegin")
    queueOrSendEvent(
      EventType.AD_START,
      Media.createAdObject(
        PROP_NA,
        PROP_NA,
        adPodPosition,
        (event.ad as? LinearAd)?.duration ?: 0
      ),
      customMetadata
    )
    adPodPosition++
  }

  private fun handleAdEnd() {
    logDebug("onAdEnd")
    queueOrSendEvent(EventType.AD_COMPLETE)
  }

  private fun handleAdSkip() {
    logDebug("onAdSkip")
    queueOrSendEvent(EventType.AD_SKIP)
  }

  private fun maybeEndSession() {
    logDebug("maybeEndSession")
    if (sessionInProgress) {
      /**
       * Tracks the end of a media playback session. Call this method when the viewing session ends,
       * even if the user has not viewed the media to completion. If the media is viewed to completion,
       * use trackComplete instead.
       */
      queueOrSendEvent(EventType.SESSION_END)
    }
    reset()
  }

  /**
   * Start a new session, but only if:
   * - no existing session has is in progress;
   * - the player has a valid source;
   * - no ad is playing, otherwise the ad's media duration will be picked up;
   * - the player's content media duration is known.
   *
   * @param mediaLengthSec
   * @private
   */
  private fun maybeStartSession(mediaLengthSec: Double? = null) {
    val mediaLength = getContentLength(mediaLengthSec)
    val hasValidSource = player.source !== null
    val hasValidDuration = isValidDuration(mediaLengthSec)

    logDebug(
      "maybeStartSession - " + "mediaLength: $mediaLength, " + "hasValidSource: $hasValidSource, " + "hasValidDuration: $hasValidDuration, " + "isPlayingAd: ${player.ads.isPlaying}"
    )

    if (sessionInProgress) {
      logDebug("maybeStartSession - NOT started: already in progress")
      return
    }

    if (isPlayingAd) {
      logDebug("maybeStartSession - NOT started: playing ad")
      return
    }

    if (!hasValidSource || !hasValidDuration) {
      logDebug("maybeStartSession - NOT started: invalid ${if (hasValidSource) "duration" else "source"}")
      return
    }

    // Allow overriding metadata with custom metadata set via updateMetadata().
    val mergedMetadata = (player.source?.metadata?.data?.mapValues { it.value as String } ?: emptyMap()) + customMetadata
    tracker.trackSessionStart(
      Media.createMediaObject(
        mergedMetadata["friendlyName"] ?: mergedMetadata["title"] ?: PROP_NA,
        mergedMetadata["name"] ?: mergedMetadata["id"] ?: PROP_NA,
        mediaLength,
        calculateStreamType(),
        Media.MediaType.Video,
      ),
      customMetadata
    )

    sessionInProgress = true

    if (eventQueue.isNotEmpty()) {
      val queuedEvents = eventQueue.toList()
      eventQueue.clear()
      queuedEvents.forEach { event -> sendEvent(event.type, event.info, event.metadata) }
    }

    logDebug("maybeStartSession - STARTED")
  }

  private fun getContentLength(mediaLengthSec: Double?): Int {
    return sanitiseContentLength(mediaLengthSec)
  }

  private fun calculateStreamType(): String {
    return if (player.duration == Double.POSITIVE_INFINITY)
      MediaConstants.StreamType.LIVE
    else
      MediaConstants.StreamType.VOD
  }

  fun reset() {
    logDebug("reset")
    eventQueue.clear()
    adBreakPodIndex = 0
    adPodPosition = 1
    isPlayingAd = false
    sessionInProgress = false
    currentChapter = null
    customMetadata = mutableMapOf()
  }

  fun destroy() {
    logDebug("destroy")
    maybeEndSession()
    removeEventListeners()
  }
}
