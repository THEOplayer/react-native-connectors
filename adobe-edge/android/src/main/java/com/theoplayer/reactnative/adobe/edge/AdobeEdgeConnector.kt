@file:Suppress("unused")

package com.theoplayer.reactnative.adobe.edge

import com.theoplayer.android.api.ads.Ad
import com.theoplayer.android.api.ads.AdBreak
import com.theoplayer.android.api.event.EventListener
import com.theoplayer.android.api.event.ads.AdBeginEvent
import com.theoplayer.android.api.event.ads.AdBreakBeginEvent
import com.theoplayer.android.api.event.ads.AdBreakEndEvent
import com.theoplayer.android.api.event.ads.AdEndEvent
import com.theoplayer.android.api.event.ads.AdSkipEvent
import com.theoplayer.android.api.event.ads.AdsEventTypes
import com.theoplayer.android.api.event.player.EndedEvent
import com.theoplayer.android.api.event.player.ErrorEvent
import com.theoplayer.android.api.event.player.LoadedMetadataEvent
import com.theoplayer.android.api.event.player.PauseEvent
import com.theoplayer.android.api.event.player.PlayerEventTypes
import com.theoplayer.android.api.event.player.PlayingEvent
import com.theoplayer.android.api.event.player.SourceChangeEvent
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
import com.theoplayer.reactnative.adobe.edge.api.AdobeCustomMetadataDetails
import com.theoplayer.reactnative.adobe.edge.api.AdobeErrorDetails
import com.theoplayer.reactnative.adobe.edge.api.AdobeQoeDataDetails
import com.theoplayer.reactnative.adobe.edge.api.AdobeSessionDetails
import com.theoplayer.reactnative.adobe.edge.api.ContentType
import com.theoplayer.reactnative.adobe.edge.api.ErrorSource
import com.theoplayer.reactnative.adobe.edge.api.MediaEdgeAPI
import com.theoplayer.reactnative.adobe.edge.api.buildUserAgent
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient

typealias AddTextTrackEvent = com.theoplayer.android.api.event.track.texttrack.list.AddTrackEvent
typealias RemoveTextTrackEvent = com.theoplayer.android.api.event.track.texttrack.list.RemoveTrackEvent
typealias AddVideoTrackEvent = com.theoplayer.android.api.event.track.mediatrack.video.list.AddTrackEvent
typealias RemoveVideoTrackEvent = com.theoplayer.android.api.event.track.mediatrack.video.list.RemoveTrackEvent

private const val TAG = "AdobeEdgeConnector"
private const val CONTENT_PING_INTERVAL = 10000L
private const val AD_PING_INTERVAL = 1000L
private val JSON_MEDIA_TYPE = "application/json".toMediaType()

class AdobeConnector(
  private val player: Player,
  baseUrl: String,
  configId: String,
  userAgent: String?,
  debug: Boolean? = false,
  debugSessionId: String? = null
) {
  private var pingJob: Job? = null

  private var sessionInProgress = false

  private var adBreakPodIndex = 0

  private var adPodPosition = 1

  private var isPlayingAd = false

  private var customMetadata: MutableList<AdobeCustomMetadataDetails> = mutableListOf()

  private var currentChapter: TextTrackCue? = null

  private var customUserAgent: String? = null

  private val scope = CoroutineScope(Dispatchers.Main)

  private val client = OkHttpClient()

  private val mediaApi: MediaEdgeAPI =
    MediaEdgeAPI(baseUrl, configId, userAgent ?: buildUserAgent(), debugSessionId)

  private val onPlaying: EventListener<PlayingEvent> = EventListener { handlePlaying() }
  private val onPause: EventListener<PauseEvent> = EventListener { handlePause() }
  private val onEnded: EventListener<EndedEvent> = EventListener { handleEnded() }
  private val onWaiting: EventListener<WaitingEvent> = EventListener { handleWaiting() }
  private val onSourceChange: EventListener<SourceChangeEvent> =
    EventListener { handleSourceChange() }
  private val onAddTextTrack: EventListener<AddTextTrackEvent> =
    EventListener { handleAddTextTrack(it) }
  private val onRemoveTextTrack: EventListener<RemoveTextTrackEvent> =
    EventListener { handleRemoveTextTrack(it) }
  private val onAddVideoTrack: EventListener<AddVideoTrackEvent> =
    EventListener { handleAddVideoTrack(it) }
  private val onRemoveVideoTrack: EventListener<RemoveVideoTrackEvent> =
    EventListener { handleRemoveVideoTrack(it) }
  private val onActiveVideoQualityChanged: EventListener<ActiveQualityChangedEvent> =
    EventListener { handleQualityChanged(it) }
  private val onEnterCue: EventListener<EnterCueEvent> = EventListener { handleEnterCue(it) }
  private val onExitCue: EventListener<ExitCueEvent> = EventListener { handleExitCue(it) }
  private val onLoadedMetadata: EventListener<LoadedMetadataEvent> =
    EventListener { handleLoadedMetadata() }
  private val onError: EventListener<ErrorEvent> = EventListener { event -> handleError(event) }
  private val onAdBreakBegin: EventListener<AdBreakBeginEvent> =
    EventListener<AdBreakBeginEvent> { event -> handleAdBreakBegin(event.adBreak) }
  private val onAdBreakEnd: EventListener<AdBreakEndEvent> =
    EventListener { event -> handleAdBreakEnd() }
  private val onAdBegin: EventListener<AdBeginEvent> =
    EventListener { event -> handleAdBegin(event.ad) }
  private val onAdEnd: EventListener<AdEndEvent> = EventListener { event -> handleAdEnd(event.ad) }
  private val onAdSkip: EventListener<AdSkipEvent> = EventListener { event -> handleAdSkip() }

  init {
    setDebug(debug ?: false)
    addEventListeners()
    Logger.debug("Initialized connector")
  }

  fun setDebug(debug: Boolean) {
    Logger.debug = debug
  }

  fun setDebugSessionId(id: String?) {
    mediaApi.setDebugSessionId(id)
  }

  fun updateMetadata(metadata: List<AdobeCustomMetadataDetails>) {
    customMetadata.addAll(metadata)
  }

  fun setError(errorDetails: AdobeErrorDetails) {
    mediaApi.error(player.currentTime, errorDetails)
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
    player.addEventListener(PlayerEventTypes.SOURCECHANGE, onSourceChange)
    player.textTracks.addEventListener(TextTrackListEventTypes.ADDTRACK, onAddTextTrack)
    player.textTracks.addEventListener(TextTrackListEventTypes.REMOVETRACK, onRemoveTextTrack)
    player.videoTracks.addEventListener(VideoTrackListEventTypes.ADDTRACK, onAddVideoTrack)
    player.addEventListener(PlayerEventTypes.LOADEDMETADATA, onLoadedMetadata)
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
    player.removeEventListener(PlayerEventTypes.SOURCECHANGE, onSourceChange)
    player.textTracks.removeEventListener(TextTrackListEventTypes.ADDTRACK, onAddTextTrack)
    player.textTracks.removeEventListener(TextTrackListEventTypes.REMOVETRACK, onRemoveTextTrack)
    player.videoTracks.removeEventListener(VideoTrackListEventTypes.ADDTRACK, onAddVideoTrack)
    player.removeEventListener(PlayerEventTypes.LOADEDMETADATA, onLoadedMetadata)
    player.removeEventListener(PlayerEventTypes.ERROR, onError)
    player.ads.apply {
      removeEventListener(AdsEventTypes.AD_BREAK_BEGIN, onAdBreakBegin)
      removeEventListener(AdsEventTypes.AD_BREAK_END, onAdBreakEnd)
      removeEventListener(AdsEventTypes.AD_BEGIN, onAdBegin)
      removeEventListener(AdsEventTypes.AD_END, onAdEnd)
      removeEventListener(AdsEventTypes.AD_SKIP, onAdSkip)
    }
  }

  private fun handleLoadedMetadata() {
    Logger.debug("onLoadedMetadata")
    scope.launch {
      // NOTE: In case of a pre-roll ad:
      // - on Android & iOS, the onLoadedMetadata is sent *after* a pre-roll has finished;
      // - on Web, onLoadedMetadata is sent twice, once before the pre-roll, where player.duration is still NaN,
      //   and again after the pre-roll with a correct duration.
      maybeStartSession(player.duration)
    }
  }

  private fun handlePlaying() {
    Logger.debug("onPlaying")
    mediaApi.play(player.currentTime)
  }

  private fun handlePause() {
    Logger.debug("onPause")
    mediaApi.pause(player.currentTime)
  }

  private fun handleWaiting() {
    Logger.debug("onWaiting")
    mediaApi.bufferStart(player.currentTime)
  }

  private fun handleEnded() {
    Logger.debug("onEnded")
    mediaApi.sessionComplete(player.currentTime)
    reset()
  }

  private fun handleSourceChange() {
    Logger.debug("onSourceChange")
    maybeEndSession()
  }

  private fun handleQualityChanged(event: ActiveQualityChangedEvent) {
    mediaApi.bitrateChange(
      player.currentTime, AdobeQoeDataDetails(
        bitrate = event.quality?.bandwidth?.toInt() ?: 0,
      )
    )
  }

  private fun handleAddTextTrack(event: AddTextTrackEvent) {
    event.track.takeIf { it.kind == TextTrackKind.CHAPTERS.name }?.let { track ->
      track.addEventListener(TextTrackEventTypes.ENTERCUE, onEnterCue)
      track.addEventListener(TextTrackEventTypes.EXITCUE, onExitCue)
    }
  }

  private fun handleRemoveTextTrack(event: RemoveTextTrackEvent) {
    event.track.takeIf { it.kind == TextTrackKind.CHAPTERS.name }?.let { track ->
      track.removeEventListener(TextTrackEventTypes.ENTERCUE, onEnterCue)
      track.removeEventListener(TextTrackEventTypes.EXITCUE, onExitCue)
    }
  }

  private fun handleAddVideoTrack(event: AddVideoTrackEvent) {
    event.track.addEventListener(
      VideoTrackEventTypes.ACTIVEQUALITYCHANGEDEVENT,
      onActiveVideoQualityChanged
    )
  }

  private fun handleRemoveVideoTrack(event: RemoveVideoTrackEvent) {
    event.track.removeEventListener(
      VideoTrackEventTypes.ACTIVEQUALITYCHANGEDEVENT,
      onActiveVideoQualityChanged
    )
  }

  private fun handleEnterCue(event: EnterCueEvent) {
    Logger.debug("handleEnterCue")
    val chapterCue = event.cue
    if (currentChapter != null && currentChapter?.endTime != chapterCue.startTime) {
      mediaApi.chapterSkip(this.player.currentTime)
    }
    val chapterDetails = calculateChapterDetails(chapterCue)
    mediaApi.chapterStart(this.player.currentTime, chapterDetails, customMetadata)
    currentChapter = chapterCue
  }

  private fun handleExitCue(event: ExitCueEvent) {
    Logger.debug("handleExitCue")
    mediaApi.chapterComplete(player.currentTime)
  }

  private fun handleError(event: ErrorEvent) {
    Logger.debug("handleError")
    mediaApi.error(
      player.currentTime, AdobeErrorDetails(
        name = event.errorObject.code.toString(),
        source = ErrorSource.PLAYER
      )
    )
  }

  private fun handleAdBreakBegin(adBreak: AdBreak?) {
    Logger.debug("handleAdBreakBegin")
    isPlayingAd = true
    startPinger(AD_PING_INTERVAL)
    val podDetails = calculateAdvertisingPodDetails(adBreak, adBreakPodIndex)
    mediaApi.adBreakStart(player.currentTime, podDetails)
    if (podDetails.index > adBreakPodIndex) {
      adBreakPodIndex++
    }
  }

  private fun handleAdBreakEnd() {
    Logger.debug("handleAdBreakEnd")
    isPlayingAd = false
    adPodPosition = 1
    startPinger(CONTENT_PING_INTERVAL)
    mediaApi.adBreakComplete(player.currentTime)
  }

  private fun handleAdBegin(ad: Ad?) {
    Logger.debug("handleAdBegin")
    mediaApi.adStart(
      player.currentTime,
      calculateAdvertisingDetails(ad, adPodPosition),
      customMetadata
    )
    adPodPosition++
  }

  private fun handleAdEnd(ad: Ad?) {
    Logger.debug("handleAdEnd")
    mediaApi.adComplete(player.currentTime)
  }

  private fun handleAdSkip() {
    Logger.debug("handleAdSkip")
    mediaApi.adSkip(player.currentTime)
  }

  private fun maybeEndSession() {
    Logger.debug("maybeEndSession")
    if (mediaApi.hasSessionStarted()) {
      mediaApi.sessionEnd(player.currentTime)
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
      "maybeStartSession - " +
        "mediaLength: $mediaLength, " +
        "hasValidSource: $hasValidSource, " +
        "hasValidDuration: $hasValidDuration, " +
        "isPlayingAd: ${player.ads.isPlaying}"
    )

    if (sessionInProgress || !hasValidSource || !hasValidDuration || isPlayingAd) {
      Logger.debug("maybeStartSession - NOT started")
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

    if (!isPlayingAd) {
      startPinger(CONTENT_PING_INTERVAL)
    } else {
      startPinger(AD_PING_INTERVAL)
    }
  }

  private fun startPinger(intervalMs: Long) {
    pingJob?.cancel()
    pingJob = scope.launch {
      while (isActive) {
        mediaApi.ping(player.currentTime)
        delay(intervalMs)
      }
    }
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
    pingJob?.cancel()
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
