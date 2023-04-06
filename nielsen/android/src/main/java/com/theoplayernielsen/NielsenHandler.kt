package com.theoplayernielsen

import android.content.Context
import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.LifecycleObserver
import androidx.lifecycle.ProcessLifecycleOwner
import com.nielsen.app.sdk.AppLaunchMeasurementManager
import com.nielsen.app.sdk.AppSdk
import com.theoplayer.android.api.ads.ima.GoogleImaAdEvent
import com.theoplayer.android.api.ads.ima.GoogleImaAdEventType
import com.theoplayer.android.api.event.EventListener
import com.theoplayer.android.api.event.player.*
import com.theoplayer.android.api.event.track.texttrack.EnterCueEvent
import com.theoplayer.android.api.event.track.texttrack.TextTrackEventTypes
import com.theoplayer.android.api.event.track.texttrack.list.AddTrackEvent
import com.theoplayer.android.api.event.track.texttrack.list.TextTrackListEventTypes
import com.theoplayer.android.api.player.Player
import com.theoplayer.android.api.player.track.texttrack.TextTrackMode
import com.theoplayer.android.api.player.track.texttrack.TextTrackType
import org.json.JSONObject

private const val TAG = "NielsenHandler"

private const val PROP_APP_ID = "appid"
private const val PROP_DEBUG = "nol_devDebug"
private const val PROP_CHANNEL_NAME = "channelname"
private const val PROP_TYPE = "type"
private const val PROP_ADMODEL = "adModel"
private const val PROP_ASSET_ID = "assetid"
private const val PROP_PREROLL = "preroll"
private const val PROP_MIDROLL = "midroll"
private const val PROP_POSTROLL = "postroll"

/**
 * NielsenHandler
 *
 * @param appContext  Application context.
 * @param player      THEOplayer instance.
 * @param appId       Unique Nielsen ID for the application. The ID is a GUID data type.
 * @param debug       Enables Nielsen console logging. Only required for testing
 */
class NielsenHandler(
  appContext: Context,
  private val player: Player,
  appId: String,
  debug: Boolean = false,
) {
  private val onPlay: EventListener<PlayEvent>
  private val onPause: EventListener<PauseEvent>
  private val onEnded: EventListener<EndedEvent>
  private val onSourceChange: EventListener<SourceChangeEvent>
  private val onDurationChange: EventListener<DurationChangeEvent>
  private val onLoadedMetadata: EventListener<LoadedMetadataEvent>
  private val onAddTrack: EventListener<AddTrackEvent>
  private val onAdBegin: EventListener<GoogleImaAdEvent>
  private val onAdEnd: EventListener<GoogleImaAdEvent>
  private val onCueEnter: EventListener<EnterCueEvent>

  private var lastPosition: Long = -1
  private var appSdk: AppSdk? = null

  private var sessionInProgress: Boolean = false
  private val mainHandler = Handler(Looper.getMainLooper())
  private var lifecycleObserver: LifecycleObserver

  init {
    if (BuildConfig.DEBUG) {
      Log.d(TAG, "Initializing appSDK")
    }

    // Initialize SDK
    val appInfo = JSONObject().apply {
      put(PROP_APP_ID, appId)
      if (debug) {
        put(PROP_DEBUG, "DEBUG")
      }
    }
    appSdk = AppSdk(appContext, appInfo) { _, _, _ -> }

    onPlay = EventListener<PlayEvent> {
      maybeSendPlayEvent()
    }
    onPause = EventListener<PauseEvent> {
      if (BuildConfig.DEBUG) {
        Log.d(TAG, "onPause")
      }
      appSdk?.stop()
    }
    onDurationChange = EventListener<DurationChangeEvent> {
      maybeSendPlayEvent()
    }
    onEnded = EventListener<EndedEvent> {
      if (BuildConfig.DEBUG) {
        Log.d(TAG, "onEnded")
      }
      endSession()
    }
    onSourceChange = EventListener<SourceChangeEvent> {
      if (BuildConfig.DEBUG) {
        Log.d(TAG, "onSourceChange")
      }
      endSession()
    }
    onLoadedMetadata = EventListener<LoadedMetadataEvent> {
      if (BuildConfig.DEBUG) {
        Log.d(TAG, "onLoadedMetadata - duration ${player.duration.toInt()}")
      }

      // contentMetadataObject contains the JSON metadata for the content being played
      appSdk?.loadMetadata(buildMetadata())
    }
    onCueEnter = EventListener<EnterCueEvent> { event ->
      if (BuildConfig.DEBUG) {
        Log.d(TAG, "onCueEnter content: ${event.cue.content}")
      }
      event.cue.content?.optJSONObject("content")?.let { cueContent ->
        cueContent.optString("ownerIdentifier").let {
          if (it.contains("www.nielsen.com")) {
            appSdk?.sendID3(it)
          }
        }
      }
    }
    onAddTrack = EventListener<AddTrackEvent> { event ->
      if (BuildConfig.DEBUG) {
        Log.d(TAG, "onAddTrack track type: ${event.track.type}")
      }
      if (event.track.type == TextTrackType.ID3) {
        if (event.track.mode == TextTrackMode.DISABLED) {
          event.track.mode = TextTrackMode.HIDDEN
        }
        event.track.addEventListener(TextTrackEventTypes.ENTERCUE, onCueEnter)
      }
    }
    onAdBegin = EventListener<GoogleImaAdEvent> { event ->
      val ad = event.ad
      if (BuildConfig.DEBUG) {
        Log.d(TAG, "onAdBegin - type: ${ad?.type}")
      }
      if (ad?.type == "linear") {
        val timeOffset = ad.adBreak?.timeOffset ?: 0
        appSdk?.stop()
        appSdk?.loadMetadata(buildMetadata().apply {
          put(
            PROP_TYPE, when {
              timeOffset == 0 -> PROP_PREROLL
              timeOffset > 0 -> PROP_MIDROLL
              else -> PROP_POSTROLL
            }
          )
          put(PROP_ASSET_ID, ad.id)
        })
      }
    }
    onAdEnd = EventListener<GoogleImaAdEvent> { event ->
      val ad = event.ad
      if (BuildConfig.DEBUG) {
        Log.d(TAG, "onAdEnd - type: ${ad?.type}")
      }
      if (ad?.type == "linear") {
        appSdk?.stop()
      }
    }

    // Observe app switches between background and foreground
    lifecycleObserver = LifecycleEventObserver { _, event ->
      when (event) {
        Lifecycle.Event.ON_PAUSE -> {
          if (BuildConfig.DEBUG) {
            Log.d(TAG, "lifecycleObserver - pause")
          }
          @Suppress("DEPRECATION")
          AppLaunchMeasurementManager.appInBackground(appContext)
        }
        Lifecycle.Event.ON_RESUME -> {
          if (BuildConfig.DEBUG) {
            Log.d(TAG, "lifecycleObserver - resume")
          }
          @Suppress("DEPRECATION")
          AppLaunchMeasurementManager.appInForeground(appContext)
        }
        else -> {/*ignore*/
        }
      }
    }

    addEventListeners()
  }

  fun updateMetadata(metadata: Map<String, Any>) {
    if (BuildConfig.DEBUG) {
      Log.d(TAG, "updateMetadata $metadata")
    }
    appSdk?.loadMetadata(buildMetadata(metadata))
  }

  fun destroy() {
    if (BuildConfig.DEBUG) {
      Log.d(TAG, "destroy")
    }
    removeEventListeners()
    endSession()
  }

  private fun addEventListeners() {
    if (BuildConfig.DEBUG) {
      Log.d(TAG, "addEventListeners")
    }
    player.addEventListener(PlayerEventTypes.PLAY, onPlay)
    player.addEventListener(PlayerEventTypes.PAUSE, onPause)
    player.addEventListener(PlayerEventTypes.DURATIONCHANGE, onDurationChange)
    player.addEventListener(PlayerEventTypes.ENDED, onEnded)
    player.addEventListener(PlayerEventTypes.SOURCECHANGE, onSourceChange)
    player.addEventListener(PlayerEventTypes.LOADEDMETADATA, onLoadedMetadata)
    player.textTracks.addEventListener(TextTrackListEventTypes.ADDTRACK, onAddTrack)
    player.ads.addEventListener(GoogleImaAdEventType.STARTED, onAdBegin)
    player.ads.addEventListener(GoogleImaAdEventType.COMPLETED, onAdEnd)
    mainHandler.post {
      ProcessLifecycleOwner.get().lifecycle.addObserver(lifecycleObserver)
    }
  }

  private fun removeEventListeners() {
    if (BuildConfig.DEBUG) {
      Log.d(TAG, "removeEventListeners")
    }
    player.removeEventListener(PlayerEventTypes.PLAY, onPlay)
    player.removeEventListener(PlayerEventTypes.PAUSE, onPause)
    player.removeEventListener(PlayerEventTypes.DURATIONCHANGE, onDurationChange)
    player.removeEventListener(PlayerEventTypes.ENDED, onEnded)
    player.removeEventListener(PlayerEventTypes.SOURCECHANGE, onSourceChange)
    player.removeEventListener(PlayerEventTypes.LOADEDMETADATA, onLoadedMetadata)
    player.textTracks.removeEventListener(TextTrackListEventTypes.ADDTRACK, onAddTrack)
    player.ads.removeEventListener(GoogleImaAdEventType.STARTED, onAdBegin)
    player.ads.removeEventListener(GoogleImaAdEventType.COMPLETED, onAdEnd)
    mainHandler.post {
      ProcessLifecycleOwner.get().lifecycle.removeObserver(lifecycleObserver)
    }
  }

  private fun maybeSendPlayEvent() {
    if (!sessionInProgress && !player.duration.isNaN()) {
      sessionInProgress = true

      if (BuildConfig.DEBUG) {
        Log.d(TAG, "play - channelName: ${player.src}, length: ${player.duration}")
      }

      // stream starts
      appSdk?.play(JSONObject().apply {
        put(PROP_CHANNEL_NAME, player.src)
      })
    }
  }

  private fun endSession() {
    if (sessionInProgress) {
      if (BuildConfig.DEBUG) {
        Log.d(TAG, "end")
      }
      lastPosition = -1
      sessionInProgress = false
      appSdk?.end()
    }
  }

  private fun buildMetadata(metadata: Map<String, Any> = mapOf()): JSONObject {
    return JSONObject(metadata).apply {
      put(PROP_TYPE, "content")
      put(PROP_ADMODEL, "1")
    }
  }
}
