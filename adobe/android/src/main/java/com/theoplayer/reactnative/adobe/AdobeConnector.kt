@file:Suppress("unused")

package com.theoplayer.reactnative.adobe

import android.util.Log
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
import com.theoplayer.android.api.player.track.texttrack.TextTrackMode
import com.theoplayer.android.api.player.track.texttrack.cue.TextTrackCue
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import kotlin.collections.orEmpty
import kotlin.collections.plus
import kotlin.collections.toMutableMap
import kotlinx.serialization.json.*

typealias AddTextTrackEvent = com.theoplayer.android.api.event.track.texttrack.list.AddTrackEvent
typealias RemoveTextTrackEvent = com.theoplayer.android.api.event.track.texttrack.list.RemoveTrackEvent
typealias AddVideoTrackEvent = com.theoplayer.android.api.event.track.mediatrack.video.list.AddTrackEvent
typealias RemoveVideoTrackEvent = com.theoplayer.android.api.event.track.mediatrack.video.list.RemoveTrackEvent

private const val TAG = "AdobeConnector"
private const val CONTENT_PING_INTERVAL = 10000L
private const val AD_PING_INTERVAL = 1000L
private val JSON_MEDIA_TYPE = "application/json".toMediaType()
private const val NA = "N/A"

enum class ContentType(val value: String) {
  VOD("VOD"),
  Live("Live"),
  Linear("Linear"),
}

class AdobeConnector(
  private val player: Player,

  /** Media Collection APIs end point */
  uri: String,

  /** Visitor Experience Cloud Org ID */
  private val ecid: String,

  /** Analytics Report Suite ID */
  private val sid: String,

  /** Analytics Tracking Server URL */
  private val trackingUrl: String,

  metadata: AdobeMetaData?,

  userAgent: String?,

  private var debug: Boolean? = false
) {

  private val uri: String = "https://${uri}/api/v1/sessions"

  /** The id of the current session */
  private var sessionId = ""

  /** Queue for events that happened before sessionid has been obtained */
  private val eventQueue: MutableList<AdobeEventRequestBody> = mutableListOf()

  /** Timer handling the ping event request */
  private var pingJob: Job? = null

  /** Whether we are in a current session or not */
  private var sessionInProgress = false

  private var adBreakPodIndex = 0

  private var adPodPosition = 1

  private var isPlayingAd = false

  private var currentMetadata: AdobeMetaData = AdobeMetaData()

  private var currentChapter: TextTrackCue? = null

  private var customUserAgent: String? = null

  private val scope = CoroutineScope(Dispatchers.Main)

  private val client = OkHttpClient()

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
  private val onError: EventListener<ErrorEvent> = EventListener { handleError(it) }
  private val onAdBreakBegin: EventListener<AdBreakBeginEvent> =
    EventListener<AdBreakBeginEvent> { event -> handleAdBreakBegin(event) }
  private val onAdBreakEnd: EventListener<AdBreakEndEvent> =
    EventListener { event -> handleAdBreakEnd() }
  private val onAdBegin: EventListener<AdBeginEvent> =
    EventListener { event -> handleAdBegin(event) }
  private val onAdEnd: EventListener<AdEndEvent> = EventListener { handleAdEnd(it) }
  private val onAdSkip: EventListener<AdSkipEvent> = EventListener { event -> handleAdSkip() }

  init {
    this.currentMetadata = metadata ?: AdobeMetaData()
    this.customUserAgent = userAgent ?: buildUserAgent()

    addEventListeners()

    logDebug("Initialized connector")
  }

  fun setDebug(debug: Boolean) {
    this.debug = debug
  }

  fun updateMetadata(metadata: AdobeMetaData) {
    currentMetadata.add(metadata)
  }

  fun setError(metadata: AdobeMetaData) {
    sendEventRequestAsync(AdobeEventTypes.ERROR, metadata)
  }

  fun stopAndStartNewSession(metadata: AdobeMetaData?) {
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
    logDebug("onPlaying")
    scope.launch {
      maybeStartSession(player.duration)
      sendEventRequest(AdobeEventTypes.PLAY)
    }
  }

  private fun handlePause() {
    logDebug("onPause")
    sendEventRequestAsync(AdobeEventTypes.PAUSE_START)
  }

  private fun handleWaiting() {
    logDebug("onWaiting")
    sendEventRequestAsync(AdobeEventTypes.BUFFER_START)
  }

  private fun handleEnded() {
    logDebug("onEnded")
    sendEventRequestAsync(AdobeEventTypes.SESSION_COMPLETE)
    reset()
  }

  private fun handleSourceChange() {
    logDebug("onSourceChange")
    scope.launch {
      maybeEndSession()
    }
  }

  private fun handleQualityChanged(event: ActiveQualityChangedEvent) {
    logDebug("onQualityChanged")
    sendEventRequestAsync(AdobeEventTypes.BITRATE_CHANGE)
  }

  private fun handleAddTextTrack(event: AddTextTrackEvent) {
    event.track.takeIf { it.kind == TextTrackKind.CHAPTERS.type }?.let { track ->
      logDebug("onAddTextTrack - add chapter track ${track.uid}")
      track.mode = TextTrackMode.HIDDEN
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
      VideoTrackEventTypes.ACTIVEQUALITYCHANGEDEVENT,
      onActiveVideoQualityChanged
    )
  }

  private fun handleRemoveVideoTrack(event: RemoveVideoTrackEvent) {
    logDebug("onRemoveVideoTrack")
    event.track.removeEventListener(
      VideoTrackEventTypes.ACTIVEQUALITYCHANGEDEVENT,
      onActiveVideoQualityChanged
    )
  }

  private fun handleEnterCue(event: EnterCueEvent) {
    val chapterCue = event.cue
    val metadata = calculateChapterStartMetadata(chapterCue)
    logDebug("onEnterCue $metadata")
    if (currentChapter != null && currentChapter?.endTime != chapterCue.startTime) {
      sendEventRequestAsync(AdobeEventTypes.CHAPTER_SKIP)
    }
    sendEventRequestAsync(AdobeEventTypes.CHAPTER_START, metadata)
    this.currentChapter = chapterCue
  }

  private fun handleExitCue(event: ExitCueEvent) {
    logDebug("onExitCue")
    sendEventRequestAsync(AdobeEventTypes.CHAPTER_COMPLETE)
  }

  private fun handleError(event: ErrorEvent) {
    logDebug("onError ${event.errorObject.message}")
    sendEventRequestAsync(
      AdobeEventTypes.ERROR, AdobeMetaData(
        qoeData = mutableMapOf(
          "media.qoe.errorID" to event.errorObject.code.toString(),
          "media.qoe.errorSource" to "player"
        )
      )
    )
  }

  private fun handleAdBreakBegin(event: AdBreakBeginEvent) {
    logDebug("onAdBreakBegin")
    isPlayingAd = true
    startPinger(AD_PING_INTERVAL)
    val metadata: AdobeMetaData = calculateAdBreakBeginMetadata(event.adBreak, adBreakPodIndex)
    sendEventRequestAsync(AdobeEventTypes.AD_BREAK_START, metadata)
    if (((metadata.params?.get("media.ad.podIndex") as? Int) ?: 0) > adBreakPodIndex) {
      adBreakPodIndex++
    }
  }

  private fun handleAdBreakEnd() {
    logDebug("onAdBreakEnd")
    isPlayingAd = false
    adPodPosition = 1
    startPinger(CONTENT_PING_INTERVAL)
    sendEventRequestAsync(AdobeEventTypes.AD_BREAK_COMPLETE)
  }

  private fun handleAdBegin(event: AdBeginEvent) {
    logDebug("onAdBegin")
    val metadata = calculateAdBeginMetadata(event.ad, adPodPosition)
    sendEventRequestAsync(AdobeEventTypes.AD_START, metadata)
    adPodPosition++
  }

  private fun handleAdEnd(event: AdEndEvent) {
    logDebug("onAdEnd")
    sendEventRequestAsync(AdobeEventTypes.AD_COMPLETE)
  }

  private fun handleAdSkip() {
    logDebug("onAdSkip")
    sendEventRequestAsync(AdobeEventTypes.AD_SKIP)
  }

  private suspend fun maybeEndSession() {
    logDebug("maybeEndSession - sessionId: '$sessionId'")
    sessionInProgress = false
    isPlayingAd = false
    if (sessionId.isNotEmpty()) {
      sendEventRequest(AdobeEventTypes.SESSION_END)
    }
    reset()
  }

  private fun createBaseRequest(eventType: AdobeEventTypes): AdobeEventRequestBody {
    return AdobeEventRequestBody().apply {
      this.playerTime = mutableMapOf("playhead" to getCurrentTime(), "ts" to System.currentTimeMillis())
      this.eventType = eventType.value
      this.qoeData = mutableMapOf()
    }
  }

  private fun getCurrentTime(): Int {
    return when (player.currentTime) {
      Double.POSITIVE_INFINITY -> (System.currentTimeMillis() / 1000) % 86400
      else -> player.currentTime
    }.toInt()
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

    logDebug(
      "maybeStartSession -" +
        "mediaLength: $mediaLength, " +
        "hasValidSource: $hasValidSource, " +
        "hasValidDuration: $hasValidDuration, " +
        "isPlayingAd: ${player.ads.isPlaying}"
    )

    if (sessionInProgress || !hasValidSource || !hasValidDuration || isPlayingAd) {
      logDebug("maybeStartSession - NOT started")
      return
    }
    val initialBody = createBaseRequest(AdobeEventTypes.SESSION_START)
    initialBody.params = mutableMapOf(
      "analytics.reportSuite" to sid,
      "analytics.trackingServer" to trackingUrl,
      "media.channel" to NA,
      "media.contentType" to getContentType().value,
      "media.id" to NA,
      "media.length" to mediaLength,
      "media.playerName" to "THEOplayer",
      "visitor.marketingCloudOrgId" to this.ecid,
    )
    player.source?.metadata?.get<String>("title")?.let {
      initialBody.params?.put("media.name", it)
    }

    val body = addCustomMetadata(AdobeEventTypes.SESSION_START, initialBody)

    val response = sendRequest(this.uri, body)
    if (response?.code != 201) {
      Log.e(TAG, "Error during session creation: ${response?.message}")
      return
    }
    sessionInProgress = true
    logDebug("maybeStartSession - sessionInProgress")

    val splitResponseUrl = response.headers["location"]?.split("/sessions/")
    if (splitResponseUrl == null || splitResponseUrl.isEmpty()) {
      Log.e(TAG, "No location header present")
      return
    }
    sessionId = splitResponseUrl[splitResponseUrl.size - 1]
    logDebug("maybeStartSession - STARTED sessionId: $sessionId")

    if (eventQueue.isNotEmpty()) {
      val url = "$uri/$sessionId/events"
      // toList is added to copy the collection and avoid ConcurrentModificationException
      val queuedEvents = eventQueue.toList()
      eventQueue.clear()
      queuedEvents.forEach { body ->
        sendRequest(url, body)
      }

    }

    if (!isPlayingAd) {
      startPinger(CONTENT_PING_INTERVAL)
    } else {
      startPinger(AD_PING_INTERVAL)
    }
  }

  private fun addCustomMetadata(
    eventType: AdobeEventTypes,
    body: AdobeEventRequestBody
  ): AdobeEventRequestBody {
    if (eventType != AdobeEventTypes.PING &&
      eventType in listOf(
        AdobeEventTypes.AD_BREAK_START,
        AdobeEventTypes.CHAPTER_START,
        AdobeEventTypes.AD_START,
        AdobeEventTypes.SESSION_START
      )
    ) {
      body.customMetadata = currentMetadata.customMetadata ?: mutableMapOf()
    }
    body.qoeData = (body.qoeData.orEmpty() + currentMetadata.qoeData.orEmpty()).toMutableMap()
    return body
  }

  private fun sendEventRequestAsync(
    eventType: AdobeEventTypes,
    metadata: AdobeMetaData? = null
  ) {
    scope.launch {
      sendEventRequest(eventType, metadata)
    }
  }

  private suspend fun sendEventRequest(
    eventType: AdobeEventTypes,
    metadata: AdobeMetaData? = null
  ) {
    val initialBody = createBaseRequest(eventType).apply {
      metadata?.let {
        params = it.params
        qoeData = it.qoeData
        customMetadata = it.customMetadata
      }
    }
    val body = addCustomMetadata(eventType, initialBody)

    if (sessionId.isEmpty()) {
      // Session hasn't started yet but no session id --> add to queue
      eventQueue.add(body)
      return
    }

    val response = sendRequest("${uri}/$sessionId/events", body)

    if (response?.code == 404 || response?.code == 410) {
      // Faulty session id, store in queue and remake session
      eventQueue.add(body)
      if (sessionId.isNotEmpty() && sessionInProgress) {
        // Avoid calling multiple startSessions close together
        sessionId = ""
        sessionInProgress = false
        maybeStartSession()
      }
    }
  }

  private fun startPinger(intervalMs: Long) {
    pingJob?.cancel()
    pingJob = scope.launch {
      while (isActive) {
        sendEventRequest(AdobeEventTypes.PING)
        delay(intervalMs)
      }
    }
  }

  private suspend fun sendRequest(
    url: String,
    body: AdobeEventRequestBody
  ): Response? = withContext(Dispatchers.IO) {
    val response = try {
      val requestBodyStr = Json.encodeToString(body)
      logDebug("sendRequest $url - $requestBodyStr")
      val request = Request.Builder()
        .url(url)
        .post(requestBodyStr.toRequestBody(JSON_MEDIA_TYPE))
        .addHeader("Content-Type", "application/json")
        .apply {
          customUserAgent?.let {
            addHeader("User-Agent", it)
          }
        }
        .build()
      client.newCall(request).execute()
    } catch (e: Exception) {
      logDebug("sendRequest failed: ${e.message}")
      return@withContext null
    }
    logDebug("sendRequest result: ${response.code}")
    return@withContext response
  }

  /**
   * Get the current media length in seconds.
   *
   * - In case of a live stream, set it to 24h.
   *
   * @param mediaLengthSec optional mediaLength provided by a player event.
   * @private
   */
  private fun getContentLength(mediaLengthSec: Double?): Int {
    val length = mediaLengthSec ?: player.duration
    return when {
      length == Double.POSITIVE_INFINITY -> 86400
      length.isNaN() -> 0
      else -> length.toInt()
    }
  }

  private fun getContentType(): ContentType {
    return if (player.duration == Double.POSITIVE_INFINITY) ContentType.Live else ContentType.VOD
  }

  fun reset() {
    logDebug("reset")
    adBreakPodIndex = 0
    adPodPosition = 1
    isPlayingAd = false
    sessionId = ""
    sessionInProgress = false
    pingJob?.cancel()
    currentChapter = null
  }

  fun destroy() {
    scope.launch {
      maybeEndSession()
      removeEventListeners()
    }
  }

  private fun logDebug(message: String) {
    if (debug ?: false) {
      Log.d(TAG, message)
    }
  }
}
