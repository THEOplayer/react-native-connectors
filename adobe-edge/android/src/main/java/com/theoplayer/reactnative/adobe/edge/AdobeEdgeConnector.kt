@file:Suppress("unused")

package com.theoplayer.reactnative.adobe.edge

import com.adobe.marketing.mobile.LoggingMode
import com.adobe.marketing.mobile.MobileCore
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.theoplayer.android.api.ads.Ad
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
import com.theoplayer.reactnative.adobe.edge.api.AdobeAdvertisingDetails
import com.theoplayer.reactnative.adobe.edge.api.AdobeCustomMetadataDetails
import com.theoplayer.reactnative.adobe.edge.api.AdobeErrorDetails
import com.theoplayer.reactnative.adobe.edge.api.AdobeQoeDataDetails
import com.theoplayer.reactnative.adobe.edge.api.AdobeSessionDetails
import com.theoplayer.reactnative.adobe.edge.api.ContentType
import com.theoplayer.reactnative.adobe.edge.api.ErrorSource
import com.theoplayer.reactnative.adobe.edge.api.MediaEdgeAPI
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaType

typealias AddTextTrackEvent = com.theoplayer.android.api.event.track.texttrack.list.AddTrackEvent
typealias RemoveTextTrackEvent = com.theoplayer.android.api.event.track.texttrack.list.RemoveTrackEvent
typealias AddVideoTrackEvent = com.theoplayer.android.api.event.track.mediatrack.video.list.AddTrackEvent
typealias RemoveVideoTrackEvent = com.theoplayer.android.api.event.track.mediatrack.video.list.RemoveTrackEvent

private const val TAG = "AdobeEdgeConnector"
private val JSON_MEDIA_TYPE = "application/json".toMediaType()

class AdobeEdgeConnector(
  private val player: Player,
  debug: Boolean? = false,
  debugSessionId: String? = null
) {
  private var sessionInProgress = false

  private var adBreakPodIndex = 0

  private var adPodPosition = 1

  private var isPlayingAd = false

  private var customMetadata: MutableList<AdobeCustomMetadataDetails> = mutableListOf()

  private var currentChapter: TextTrackCue? = null

  private var customUserAgent: String? = null

  private val scope = CoroutineScope(Dispatchers.Main)

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
  private val onExitCue = EventListener<ExitCueEvent> { handleExitCue(it) }
  private val onError = EventListener<ErrorEvent> { handleError(it) }
  private val onAdBreakBegin =
    EventListener<AdBreakBeginEvent> { event -> handleAdBreakBegin(event) }
  private val onAdBreakEnd = EventListener<AdBreakEndEvent> { event -> handleAdBreakEnd() }
  private val onAdBegin = EventListener<AdBeginEvent> { event -> handleAdBegin(event) }
  private val onAdEnd = EventListener<AdEndEvent> { handleAdEnd(it) }
  private val onAdSkip = EventListener<AdSkipEvent> { event -> handleAdSkip() }

  private val mediaApi: MediaEdgeAPI = MediaEdgeAPI("N/A", debugSessionId)

  init {
    setDebug(debug ?: false)
    addEventListeners()
    Logger.debug("Initialized connector")
  }

  fun setDebug(debug: Boolean) {
    Logger.debug = debug
    MobileCore.setLogLevel(if (debug) LoggingMode.DEBUG else LoggingMode.ERROR)
  }

  fun setDebugSessionId(id: String?) {
    mediaApi.setDebugSessionId(id)
  }

  fun updateMetadata(metadata: List<AdobeCustomMetadataDetails>) {
    customMetadata.addAll(metadata)
  }

  fun setError(errorDetails: AdobeErrorDetails) {
    mediaApi.error(errorDetails)
  }

  fun stopAndStartNewSession(metadata: List<AdobeCustomMetadataDetails>?) {
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
    player.removeEventListener(PlayerEventTypes.ERROR, onError)
    player.ads.apply {
      removeEventListener(AdsEventTypes.AD_BREAK_BEGIN, onAdBreakBegin)
      removeEventListener(AdsEventTypes.AD_BREAK_END, onAdBreakEnd)
      removeEventListener(AdsEventTypes.AD_BEGIN, onAdBegin)
      removeEventListener(AdsEventTypes.AD_END, onAdEnd)
      removeEventListener(AdsEventTypes.AD_SKIP, onAdSkip)
    }
  }

  private fun handlePlaying() {
    // NOTE: In case of a pre-roll ad, the `playing` event will be sent twice: once starting the re-roll, and once
    // starting content. During the pre-roll, all events will be queued. The session will be started after the pre-roll,
    // making sure we can start the session with the correct content duration (not the ad duration).
    Logger.debug("onPlaying")
    scope.launch {
      maybeStartSession(player.duration)
      mediaApi.play()
    }
  }

  private fun handlePause() {
    Logger.debug("onPause")
    mediaApi.pause()
  }

  private fun handleTimeUpdate(event: TimeUpdateEvent) {
    Logger.debug("onWaiting")
    mediaApi.updateCurrentPlayhead(event.currentTime)
  }

  private fun handleWaiting() {
    Logger.debug("onWaiting")
    mediaApi.bufferStart()
  }

  private fun handleSeeking() {
    Logger.debug("handleSeeking")
    mediaApi.seekStart()
  }

  private fun handleSeeked() {
    Logger.debug("handleSeeked")
    mediaApi.seekComplete()
  }

  private fun handleEnded() {
    Logger.debug("onEnded")
    mediaApi.sessionComplete()
    reset()
  }

  private fun handleSourceChange() {
    Logger.debug("onSourceChange")
    maybeEndSession()
  }

  private fun handleQualityChanged(event: ActiveQualityChangedEvent) {
    mediaApi.bitrateChange(
      AdobeQoeDataDetails(
        bitrate = event.quality?.bandwidth?.toInt() ?: 0,
      )
    )
  }

  private fun handleAddTextTrack(event: AddTextTrackEvent) {
    event.track.takeIf { it.kind == TextTrackKind.CHAPTERS.type }?.let { track ->
      Logger.debug("onAddTextTrack - add chapter track ${track.uid}")
      track.addEventListener(TextTrackEventTypes.ENTERCUE, onEnterCue)
      track.addEventListener(TextTrackEventTypes.EXITCUE, onExitCue)
    }
  }

  private fun handleRemoveTextTrack(event: RemoveTextTrackEvent) {
    event.track.takeIf { it.kind == TextTrackKind.CHAPTERS.type }?.let { track ->
      Logger.debug("onRemoveTextTrack - remove chapter track ${track.uid}")
      track.removeEventListener(TextTrackEventTypes.ENTERCUE, onEnterCue)
      track.removeEventListener(TextTrackEventTypes.EXITCUE, onExitCue)
    }
  }

  private fun handleAddVideoTrack(event: AddVideoTrackEvent) {
    Logger.debug("onAddVideoTrack")
    event.track.addEventListener(
      VideoTrackEventTypes.ACTIVEQUALITYCHANGEDEVENT, onActiveVideoQualityChanged
    )
  }

  private fun handleRemoveVideoTrack(event: RemoveVideoTrackEvent) {
    Logger.debug("onRemoveVideoTrack")
    event.track.removeEventListener(
      VideoTrackEventTypes.ACTIVEQUALITYCHANGEDEVENT, onActiveVideoQualityChanged
    )
  }

  private fun handleEnterCue(event: EnterCueEvent) {
    Logger.debug("onEnterCue")
    val chapterCue = event.cue
    if (currentChapter != null && currentChapter?.endTime != chapterCue.startTime) {
      mediaApi.chapterSkip()
    }
    val chapterDetails = calculateChapterDetails(chapterCue)
    mediaApi.chapterStart(chapterDetails, customMetadata)
    currentChapter = chapterCue
  }

  private fun handleExitCue(event: ExitCueEvent) {
    Logger.debug("onExitCue")
    mediaApi.chapterComplete()
  }

  private fun handleError(event: ErrorEvent) {
    Logger.debug("onError")
    mediaApi.error(
      AdobeErrorDetails(
        name = event.errorObject.code.toString(), source = ErrorSource.PLAYER
      )
    )
  }

  private fun handleAdBreakBegin(event: AdBreakBeginEvent) {
    Logger.debug("onAdBreakBegin")
    isPlayingAd = true
    val podDetails = calculateAdvertisingPodDetails(event.adBreak, adBreakPodIndex)
    mediaApi.adBreakStart(podDetails)
    if (podDetails.index > adBreakPodIndex) {
      adBreakPodIndex++
    }
  }

  private fun handleAdBreakEnd() {
    Logger.debug("onAdBreakEnd")
    isPlayingAd = false
    adPodPosition = 1
    mediaApi.adBreakComplete()
  }

  private fun handleAdBegin(event: AdBeginEvent) {
    Logger.debug("onAdBegin")
    mediaApi.adStart(calculateAdvertisingDetails(event.ad, adPodPosition), customMetadata)
    adPodPosition++
  }

  private fun handleAdEnd(event: AdEndEvent) {
    Logger.debug("onAdEnd")
    mediaApi.adComplete()
  }

  private fun handleAdSkip() {
    Logger.debug("onAdSkip")
    mediaApi.adSkip()
  }

  private fun maybeEndSession() {
    Logger.debug("maybeEndSession")
    if (mediaApi.hasSessionStarted()) {
      mediaApi.sessionEnd()
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
  private suspend fun maybeStartSession(mediaLengthSec: Double? = null) {
    val mediaLength = getContentLength(mediaLengthSec)
    val hasValidSource = player.source !== null
    val hasValidDuration = isValidDuration(mediaLengthSec)

    Logger.debug(
      "maybeStartSession - " + "mediaLength: $mediaLength, " + "hasValidSource: $hasValidSource, " + "hasValidDuration: $hasValidDuration, " + "isPlayingAd: ${player.ads.isPlaying}"
    )

    if (sessionInProgress) {
      Logger.debug("maybeStartSession - NOT started: already in progress")
      return
    }

    if (isPlayingAd) {
      Logger.debug("maybeStartSession - NOT started: playing ad")
      return
    }

    if (!hasValidSource || !hasValidDuration) {
      Logger.debug("maybeStartSession - NOT started: invalid ${if (hasValidSource) "duration" else "source"}")
      return
    }

    mediaApi.startSession(
      AdobeSessionDetails(
        ID = "N/A",
        name = player.source?.metadata?.get("title") ?: "N/A",
        channel = "N/A",
        contentType = getContentType(),
        playerName = "THEOplayer",
        length = mediaLength
      ), this.customMetadata
    )

    if (!mediaApi.hasSessionStarted()) {
      Logger.debug("maybeStartSession - session was not started")
      return
    }

    sessionInProgress = true

    Logger.debug("maybeStartSession - STARTED sessionId: ${mediaApi.sessionId}")
  }

  private fun getContentLength(mediaLengthSec: Double?): Int {
    return sanitiseContentLength(mediaLengthSec)
  }

  private fun getContentType(): ContentType {
    return if (player.duration == Double.POSITIVE_INFINITY) ContentType.LIVE else ContentType.VOD
  }

  fun reset() {
    Logger.debug("reset")
    mediaApi.reset()
    adBreakPodIndex = 0
    adPodPosition = 1
    isPlayingAd = false
    sessionInProgress = false
    currentChapter = null
  }

  fun destroy() {
    Logger.debug("destroy")
    scope.launch {
      maybeEndSession()
      removeEventListeners()
    }
  }
}
