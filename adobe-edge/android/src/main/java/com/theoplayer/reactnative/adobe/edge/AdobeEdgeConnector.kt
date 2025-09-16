@file:Suppress("unused")

package com.theoplayer.reactnative.adobe.edge

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

class AdobeEdgeConnector(
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
    player.addEventListener(PlayerEventTypes.PLAYING, this::onPlaying)
    player.addEventListener(PlayerEventTypes.PAUSE, this::onPause)
    player.addEventListener(PlayerEventTypes.ENDED, this::onEnded)
    player.addEventListener(PlayerEventTypes.WAITING, this::onWaiting)
    player.addEventListener(PlayerEventTypes.SOURCECHANGE, this::onSourceChange)
    player.textTracks.addEventListener(TextTrackListEventTypes.ADDTRACK, this::onAddTextTrack)
    player.textTracks.addEventListener(TextTrackListEventTypes.REMOVETRACK, this::onRemoveTextTrack)
    player.videoTracks.addEventListener(VideoTrackListEventTypes.ADDTRACK, this::onAddVideoTrack)
    player.addEventListener(PlayerEventTypes.ERROR, this::onError)
    player.ads.apply {
      addEventListener(AdsEventTypes.AD_BREAK_BEGIN, this@AdobeEdgeConnector::onAdBreakBegin)
      addEventListener(AdsEventTypes.AD_BREAK_END, this@AdobeEdgeConnector::onAdBreakEnd)
      addEventListener(AdsEventTypes.AD_BEGIN, this@AdobeEdgeConnector::onAdBegin)
      addEventListener(AdsEventTypes.AD_END, this@AdobeEdgeConnector::onAdEnd)
      addEventListener(AdsEventTypes.AD_SKIP, this@AdobeEdgeConnector::onAdSkip)
    }
  }

  private fun removeEventListeners() {
    player.removeEventListener(PlayerEventTypes.PLAYING, this::onPlaying)
    player.removeEventListener(PlayerEventTypes.PAUSE, this::onPause)
    player.removeEventListener(PlayerEventTypes.ENDED, this::onEnded)
    player.removeEventListener(PlayerEventTypes.WAITING, this::onWaiting)
    player.removeEventListener(PlayerEventTypes.SOURCECHANGE, this::onSourceChange)
    player.textTracks.removeEventListener(TextTrackListEventTypes.ADDTRACK, this::onAddTextTrack)
    player.textTracks.removeEventListener(TextTrackListEventTypes.REMOVETRACK, this::onRemoveTextTrack)
    player.videoTracks.removeEventListener(VideoTrackListEventTypes.ADDTRACK, this::onAddVideoTrack)
    player.removeEventListener(PlayerEventTypes.ERROR, this::onError)
    player.ads.apply {
      removeEventListener(AdsEventTypes.AD_BREAK_BEGIN, this@AdobeEdgeConnector::onAdBreakBegin)
      removeEventListener(AdsEventTypes.AD_BREAK_END, this@AdobeEdgeConnector::onAdBreakEnd)
      removeEventListener(AdsEventTypes.AD_BEGIN, this@AdobeEdgeConnector::onAdBegin)
      removeEventListener(AdsEventTypes.AD_END, this@AdobeEdgeConnector::onAdEnd)
      removeEventListener(AdsEventTypes.AD_SKIP, this@AdobeEdgeConnector::onAdSkip)
    }
  }

  private fun onPlaying(event: PlayingEvent) {
    Logger.debug("onPlaying")
    handlePlaying()
  }

  private fun handlePlaying() {
    // NOTE: In case of a pre-roll ad, the `playing` event will be sent twice: once starting the re-roll, and once
    // starting content. During the pre-roll, all events will be queued. The session will be started after the pre-roll,
    // making sure we can start the session with the correct content duration (not the ad duration).
    scope.launch {
      maybeStartSession(player.duration)
      mediaApi.play(player.currentTime)
    }
  }

  private fun onPause(event: PauseEvent) {
    Logger.debug("onPause")
    handlePause()
  }

  private fun handlePause() {
    mediaApi.pause(player.currentTime)
  }

  private fun onWaiting(event: WaitingEvent) {
    Logger.debug("onWaiting")
    mediaApi.bufferStart(player.currentTime)
  }

  private fun onEnded(event: EndedEvent) {
    Logger.debug("onEnded")
    mediaApi.sessionComplete(player.currentTime)
    reset()
  }

  private fun onSourceChange(event: SourceChangeEvent) {
    Logger.debug("onSourceChange")
    maybeEndSession()
  }

  private fun onQualityChanged(event: ActiveQualityChangedEvent) {
    mediaApi.bitrateChange(
      player.currentTime, AdobeQoeDataDetails(
        bitrate = event.quality?.bandwidth?.toInt() ?: 0,
      )
    )
  }

  private fun onAddTextTrack(event: AddTextTrackEvent) {
    event.track.takeIf { it.kind == TextTrackKind.CHAPTERS.name }?.let { track ->
      track.addEventListener(TextTrackEventTypes.ENTERCUE, this::onEnterCue)
      track.addEventListener(TextTrackEventTypes.EXITCUE, this::onExitCue)
    }
  }

  private fun onRemoveTextTrack(event: RemoveTextTrackEvent) {
    event.track.takeIf { it.kind == TextTrackKind.CHAPTERS.name }?.let { track ->
      track.removeEventListener(TextTrackEventTypes.ENTERCUE, this::onEnterCue)
      track.removeEventListener(TextTrackEventTypes.EXITCUE, this::onExitCue)
    }
  }

  private fun onAddVideoTrack(event: AddVideoTrackEvent) {
    event.track.addEventListener(
      VideoTrackEventTypes.ACTIVEQUALITYCHANGEDEVENT,
      this::onQualityChanged
    )
  }

  private fun onRemoveVideoTrack(event: RemoveVideoTrackEvent) {
    event.track.removeEventListener(
      VideoTrackEventTypes.ACTIVEQUALITYCHANGEDEVENT,
      this::onQualityChanged
    )
  }

  private fun onEnterCue(event: EnterCueEvent) {
    Logger.debug("onEnterCue")
    val chapterCue = event.cue
    if (currentChapter != null && currentChapter?.endTime != chapterCue.startTime) {
      mediaApi.chapterSkip(this.player.currentTime)
    }
    val chapterDetails = calculateChapterDetails(chapterCue)
    mediaApi.chapterStart(this.player.currentTime, chapterDetails, customMetadata)
    currentChapter = chapterCue
  }

  private fun onExitCue(event: ExitCueEvent) {
    Logger.debug("onExitCue")
    mediaApi.chapterComplete(player.currentTime)
  }

  private fun onError(event: ErrorEvent) {
    Logger.debug("onError")
    mediaApi.error(
      player.currentTime, AdobeErrorDetails(
        name = event.errorObject.code.toString(),
        source = ErrorSource.PLAYER
      )
    )
  }

  private fun onAdBreakBegin(event: AdBreakBeginEvent) {
    Logger.debug("onAdBreakBegin")
    isPlayingAd = true
    startPinger(AD_PING_INTERVAL)
    val podDetails = calculateAdvertisingPodDetails(event.adBreak, adBreakPodIndex)
    mediaApi.adBreakStart(player.currentTime, podDetails)
    if (podDetails.index > adBreakPodIndex) {
      adBreakPodIndex++
    }
  }

  private fun onAdBreakEnd(event: AdBreakEndEvent) {
    Logger.debug("onAdBreakEnd")
    isPlayingAd = false
    adPodPosition = 1
    startPinger(CONTENT_PING_INTERVAL)
    mediaApi.adBreakComplete(player.currentTime)
  }

  private fun onAdBegin(event: AdBeginEvent) {
    Logger.debug("onAdBegin")
    mediaApi.adStart(
      player.currentTime,
      calculateAdvertisingDetails(event.ad, adPodPosition),
      customMetadata
    )
    adPodPosition++
  }

  private fun onAdEnd(event: AdEndEvent) {
    Logger.debug("onAdEnd")
    mediaApi.adComplete(player.currentTime)
  }

  private fun onAdSkip(event: AdSkipEvent) {
    Logger.debug("onAdSkip")
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
