package com.theoplayernielsen

import android.content.Context
import android.util.Log
import com.nielsen.app.sdk.AppSdk
import com.theoplayer.android.api.ads.Ad
import com.theoplayer.android.api.event.EventListener
import com.theoplayer.android.api.event.ads.AdBeginEvent
import com.theoplayer.android.api.event.ads.AdBreakBeginEvent
import com.theoplayer.android.api.event.ads.AdBreakEndEvent
import com.theoplayer.android.api.event.ads.AdsEventTypes
import com.theoplayer.android.api.event.player.*
import com.theoplayer.android.api.player.Player
import org.json.JSONException
import org.json.JSONObject

internal enum class NielsenState {
  NEW_STREAM, PLAYING, STOPPED
}

private const val PROP_APPID = "appid"
private const val PROP_APPNAME = "appname"
private const val PROP_SFCODE = "sfcode"
private const val PROP_DEVDEBUG = "nol_devDebug"

class NielsenConnector(
  private val player: Player,
  context: Context,
  config: Map<String, Any>,
  private var metadata: Map<String, Any>?,
  private var channelName: JSONObject?
) {
  private var analytics: AppSdk? = null
  private var adMetadata: Map<String, Any>? = null
  private var currentTime: Long = 0
  private var adOffset = 0
  private var adStart = false
  private var isBuffering = false
  private var state = NielsenState.NEW_STREAM
  private var reportedPlaying = false

  init {
    attachEventListeners()
    initialize(context, config)
    if (metadata != null) {
      analytics?.loadMetadata(JSONObject(metadata as Map))
    }
  }

  private fun initialize(
    context: Context,
    settings: Map<String, Any>
  ) {
    try {
      // Prepare AppSdk configuration object (JSONObject)
      val appSdkConfig = JSONObject()
        .put(PROP_APPID, settings[PROP_APPID])
        .put(PROP_APPNAME, settings[PROP_APPNAME])
      if (settings.containsKey(PROP_SFCODE)) {
        appSdkConfig.put(PROP_SFCODE, settings[PROP_SFCODE])
      }
      if (settings.containsKey(PROP_DEVDEBUG)) {
        appSdkConfig.put(PROP_DEVDEBUG, settings[PROP_DEVDEBUG])
      }
      // Pass appSdkConfig to the AppSdk constructor
      analytics = AppSdk(context, appSdkConfig, NielsenAppNotifier())
    } catch (e: JSONException) {
      Log.e("Nielsen_Error", "Couldn’t prepare JSONObject for appSdkConfig", e)
    }
  }

  fun destroy() {
    analytics?.end()
    removeEventListeners()
  }

  // Needs to be called before the source is changed
  fun update(channelName: JSONObject?, metadata: Map<String, Any>) {
    this.channelName = channelName
    this.metadata = metadata
    analytics?.loadMetadata(JSONObject(metadata))
  }

  private fun stop() {
    if (state === NielsenState.PLAYING) {
      // only call once during the same interruption
      state = NielsenState.STOPPED
      analytics?.stop()
    }
  }

  private fun getAdMetadata(ad: Ad?) {
    val type: String = if (adOffset == 0) {
      "preroll"
    } else if (adOffset < 0) {
      "postroll"
    } else {
      "midroll"
    }
    adMetadata = mapOf(
      "type" to type,
      "assetid" to (ad?.id ?: "")
    )
  }

  private fun attachEventListeners() {
    player.addEventListener(PlayerEventTypes.PLAY, onPlay)
    player.addEventListener(PlayerEventTypes.WAITING, onWaiting)
    player.addEventListener(PlayerEventTypes.PLAYING, onPlaying)
    player.addEventListener(PlayerEventTypes.SEEKING, onSeeking)
    player.addEventListener(PlayerEventTypes.PAUSE, onPaused)
    player.addEventListener(PlayerEventTypes.ENDED, onEnded)
    player.addEventListener(PlayerEventTypes.ERROR, onError)
    player.addEventListener(PlayerEventTypes.DESTROY, onDestroy)
    player.addEventListener(PlayerEventTypes.TIMEUPDATE, onTimeUpdate)
    player.addEventListener(PlayerEventTypes.SOURCECHANGE, onSourceChange)
    player.ads.addEventListener(AdsEventTypes.AD_BREAK_BEGIN, onAdBreakBegin)
    player.ads.addEventListener(AdsEventTypes.AD_BEGIN, onAdBegin)
    player.ads.addEventListener(AdsEventTypes.AD_BREAK_END, onAdBreakEnd)
  }

  private fun removeEventListeners() {
    player.removeEventListener(PlayerEventTypes.PLAY, onPlay)
    player.removeEventListener(PlayerEventTypes.PLAYING, onPlaying)
    player.removeEventListener(PlayerEventTypes.WAITING, onWaiting)
    player.removeEventListener(PlayerEventTypes.SEEKING, onSeeking)
    player.removeEventListener(PlayerEventTypes.PAUSE, onPaused)
    player.removeEventListener(PlayerEventTypes.ENDED, onEnded)
    player.removeEventListener(PlayerEventTypes.ERROR, onError)
    player.removeEventListener(PlayerEventTypes.DESTROY, onDestroy)
    player.removeEventListener(PlayerEventTypes.TIMEUPDATE, onTimeUpdate)
    player.removeEventListener(PlayerEventTypes.SOURCECHANGE, onSourceChange)
    player.ads.removeEventListener(AdsEventTypes.AD_BREAK_BEGIN, onAdBreakBegin)
    player.ads.removeEventListener(AdsEventTypes.AD_BEGIN, onAdBegin)
    player.ads.removeEventListener(AdsEventTypes.AD_BREAK_END, onAdBreakEnd)
  }

  private fun setPlayheadPosition(time: Double) {
    if (currentTime.toInt() != time.toInt()) {
      currentTime = time.toLong()
      if (!player.isPaused && !isBuffering) {
        analytics?.setPlayheadPosition(currentTime)
      }
    }
  }

  private val onPlay: EventListener<PlayEvent> = EventListener<PlayEvent> {
    if (state === NielsenState.NEW_STREAM) {
      state = NielsenState.PLAYING
      analytics?.play(channelName)
    }
  }

  private val onTimeUpdate: EventListener<TimeUpdateEvent> = EventListener<TimeUpdateEvent> { e ->
    if (reportedPlaying) {
      setPlayheadPosition(e.currentTime)
    }
  }

  private val onWaiting: EventListener<WaitingEvent> = EventListener<WaitingEvent> {
    if (reportedPlaying) {
      if (!adStart) {
        isBuffering = true
        stop()
      }
    }
  }

  private val onPlaying: EventListener<PlayingEvent> = EventListener<PlayingEvent> {
    if (!adStart) {
      analytics?.loadMetadata(JSONObject(metadata as Map))
    } else {
      analytics?.loadMetadata(JSONObject(adMetadata as Map))
    }
    isBuffering = false
    state = NielsenState.PLAYING
  }

  private val onSeeking: EventListener<SeekingEvent> = EventListener<SeekingEvent> {
    isBuffering = true
    stop()
  }

  private val onPaused: EventListener<PauseEvent> = EventListener<PauseEvent> {
    stop()
  }

  private val onEnded: EventListener<EndedEvent> = EventListener<EndedEvent> {
    analytics?.end()
  }

  private val onDestroy: EventListener<DestroyEvent> = EventListener<DestroyEvent> { destroy() }

  private val onError: EventListener<ErrorEvent> = EventListener<ErrorEvent> { destroy() }

  private val onSourceChange: EventListener<SourceChangeEvent> = EventListener<SourceChangeEvent> {
    stop()
    state = NielsenState.NEW_STREAM
  }

  private val onAdBreakBegin: EventListener<AdBreakBeginEvent> =
    EventListener<AdBreakBeginEvent> { e ->
      adStart = true
      adOffset = e.adBreak.timeOffset
    }

  private val onAdBegin: EventListener<AdBeginEvent> = EventListener<AdBeginEvent> { e ->
    getAdMetadata(e.ad)
//      analytics?.loadMetadata(adMetadata);
//      setPlayheadPosition()
  }

  private val onAdBreakEnd: EventListener<AdBreakEndEvent> = EventListener<AdBreakEndEvent> {
    adStart = false
    //            analytics.stop(); // Don't update the state as playback isn't stopped
//            analytics.loadMetadata(metadata);
//            setPlayheadPosition();
    reportedPlaying = false
  }
}
