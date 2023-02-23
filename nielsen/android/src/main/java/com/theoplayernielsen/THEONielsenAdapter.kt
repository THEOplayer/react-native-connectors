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

class THEONielsenAdapter(
  private val player: Player,
  context: Context,
  private var metadata: JSONObject?,
  private var channelName: JSONObject?
) {
  private var analytics: AppSdk? = null
  private var adMetadata: JSONObject? = null
  private var currentTime: Long = 0
  private var adOffset = 0
  private var adStart = false
  private var isBuffering = false
  private var state = NielsenState.NEW_STREAM

  init {
    attachEventListeners()
    initNielsen(context)
    analytics?.loadMetadata(metadata)
  }

  private fun initNielsen(context: Context) {
    try {
      // Prepare AppSdk configuration object (JSONObject)
      val appSdkConfig: JSONObject = JSONObject()
        .put("appid", "P17BF4B3C-F873-44BB-83B3-DDC6A699CE0B")
        .put("appname", "Sample App Name")
        .put("sfcode", "it")
        .put("nol_devDebug", "DEBUG") // only for debug builds
      // Pass appSdkConfig to the AppSdk constructor
      analytics = AppSdk(context, appSdkConfig, THEONielsenAppNotifier())
    } catch (e: JSONException) {
      Log.e("Nielsen_Error", "Couldn’t prepare JSONObject for appSdkConfig", e)
    }
  }

  fun destroy() {
    analytics?.end()
    removeEventListeners()
  }

  // Needs to be called before the source is changed
  fun update(channelName: JSONObject?, metadata: JSONObject?) {
    this.channelName = channelName
    this.metadata = metadata
    //        Log.i("THEOEvent", "loadMetadata: on update");
    analytics?.loadMetadata(metadata)
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
    try {
      adMetadata = JSONObject()
        .put("type", type)
        .put("assetid", ad?.id)
    } catch (e: JSONException) {
      e.printStackTrace()
    }
  }

  private fun attachEventListeners() {
    player.addEventListener(PlayerEventTypes.PLAY, onPlay)
    player.addEventListener(PlayerEventTypes.PLAYING, onFirstPlaying)
    player.addEventListener(PlayerEventTypes.SEEKING, onSeeking)
    player.addEventListener(PlayerEventTypes.PAUSE, onPaused)
    player.addEventListener(PlayerEventTypes.ENDED, onEnded)
    player.addEventListener(PlayerEventTypes.ERROR, onError)
    player.addEventListener(PlayerEventTypes.DESTROY, onDestroy)
    player.addEventListener(PlayerEventTypes.SOURCECHANGE, onSourceChange)
    player.ads.addEventListener(AdsEventTypes.AD_BREAK_BEGIN, onAdBreakBegin)
    player.ads.addEventListener(AdsEventTypes.AD_BEGIN, onAdBegin)
    player.ads.addEventListener(AdsEventTypes.AD_BREAK_END, onAdBreakEnd)
  }

  private fun removeEventListeners() {
    player.removeEventListener(PlayerEventTypes.PLAY, onPlay)
    player.removeEventListener(PlayerEventTypes.PLAYING, onOtherPlaying)
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
//        Log.i("THEOEvent", "in set playhead position and currentTime is " + this.currentTime + " while time in event is " + time);
    if (currentTime.toInt() != time.toInt()) {
//            Log.i("THEOEvent", "A SECOND PASSED");
      currentTime = time.toLong()
      //            Log.i("THEOEvent", "Player is paused: "+ this.player.isPaused() + " and is buffering: " + this.isBuffering);
      if (!player.isPaused && !isBuffering) {
//                Log.i("THEOEvent", "SET NEW PLAYHEAD");
        analytics?.setPlayheadPosition(currentTime)
      }
    }
  }

  private val onPlay: EventListener<PlayEvent> = EventListener<PlayEvent> { e ->
//        Log.i("THEOEvent", "Event: play");
    if (state === NielsenState.NEW_STREAM) {
      state = NielsenState.PLAYING
      analytics?.play(channelName)
//            this.analytics.loadMetadata(metadata);
    }
  }

  private val onOtherPlaying: EventListener<PlayingEvent> = EventListener<PlayingEvent> { e ->
//        Log.i("THEOEvent", "Event: other playing");
    if (!adStart) {
//            Log.i("THEOEvent", "loadMetadata: main");
      analytics?.loadMetadata(metadata)
    } else {
//            Log.i("THEOEvent", "loadMetadata: ad");
      analytics?.loadMetadata(adMetadata)
    }

//        setPlayheadPosition();
    isBuffering = false
    state = NielsenState.PLAYING
  }

  private val onTimeUpdate: EventListener<TimeUpdateEvent> = EventListener<TimeUpdateEvent> { e ->
//        Log.i("THEOEvent", "Event: timeupdate" + e.getCurrentTime());
    setPlayheadPosition(e.currentTime)
  }

  private val onWaiting: EventListener<WaitingEvent> = EventListener<WaitingEvent> {
//        Log.i("THEOEvent", "Event: waiting");
    if (!adStart) {
      isBuffering = true
      stop()
    }
  }

  private val onFirstPlaying: EventListener<PlayingEvent> = EventListener<PlayingEvent> {
    Log.i("THEOEvent", "Event: first playing")
    if (!adStart) {
//            Log.i("THEOEvent", "loadMetadata: main");
      analytics?.loadMetadata(metadata)
    } else {
//            Log.i("THEOEvent", "loadMetadata: ad");
      analytics?.loadMetadata(adMetadata)
    }
    isBuffering = false
    state = NielsenState.PLAYING
    player.addEventListener(PlayerEventTypes.PLAYING, onOtherPlaying)
    player.addEventListener(PlayerEventTypes.TIMEUPDATE, onTimeUpdate)
    player.addEventListener(PlayerEventTypes.WAITING, onWaiting)

    // TODO: needs to be initialized first
//    player.removeEventListener(PlayerEventTypes.PLAYING, onFirstPlaying)
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

  private val onAdBreakBegin: EventListener<AdBreakBeginEvent> = EventListener<AdBreakBeginEvent> { e ->
    adStart = true
    adOffset = e.adBreak.timeOffset
  }

  private val onAdBegin: EventListener<AdBeginEvent> = EventListener<AdBeginEvent> { e ->
      getAdMetadata(e.ad)
//      analytics?.loadMetadata(adMetadata);
//      setPlayheadPosition()
  }

  val onAdBreakEnd: EventListener<AdBreakEndEvent> = EventListener<AdBreakEndEvent> {
//            Log.i("THEOEvent", "Event: adbreakend");
      adStart = false
      //            analytics.stop(); // Don't update the state as playback isn't stopped
//            analytics.loadMetadata(metadata);
//            setPlayheadPosition();
      player.removeEventListener(PlayerEventTypes.TIMEUPDATE, onTimeUpdate)
      player.removeEventListener(PlayerEventTypes.PLAYING, onOtherPlaying)
      player.addEventListener(PlayerEventTypes.PLAYING, onFirstPlaying)
  }
}
