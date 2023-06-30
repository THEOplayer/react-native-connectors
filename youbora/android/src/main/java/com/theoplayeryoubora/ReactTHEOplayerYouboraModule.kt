package com.theoplayeryoubora

import android.os.Bundle
import com.facebook.react.bridge.*
import com.npaw.youbora.lib6.YouboraLog
import com.npaw.youbora.lib6.extensions.putNotNullString
import com.npaw.youbora.lib6.plugin.Options
import com.npaw.youbora.lib6.plugin.Plugin
import com.npaw.youbora.lib6.theoplayer.TheoplayerAdapter
import com.npaw.youbora.lib6.theoplayer.TheoplayerAdsAdapter
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.android.api.THEOplayerView
import com.theoplayer.util.ViewResolver

private const val TAG = "YouboraModule"

class ReactTHEOplayerYouboraModule(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver

  private var youboraPlugin: HashMap<Int, Plugin> = HashMap()

  init {
    viewResolver = ViewResolver(context)
  }

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun initialize(tag: Int, options: ReadableMap, debugLevel: Int?) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.playerContext?.playerView?.let { playerView ->
        youboraPlugin[tag] =
          initializeYoubora(playerView, parseOptions(options), parseDebugLevel(debugLevel))
      }
    }
  }

  @ReactMethod
  fun setDebugLevel(level: Int?) {
    YouboraLog.setDebugLevel(parseDebugLevel(level))
  }

  private fun parseDebugLevel(logLevel: Int?): YouboraLog.Level {
    return when (logLevel) {
      1 -> YouboraLog.Level.VERBOSE
      2 -> YouboraLog.Level.DEBUG
      3 -> YouboraLog.Level.NOTICE
      4 -> YouboraLog.Level.WARNING
      5 -> YouboraLog.Level.ERROR
      else -> YouboraLog.Level.SILENT
    }
  }

  private fun parseOptions(map: ReadableMap): Options {
    return Options(convertMapToBundle(map.toHashMap()))
  }

  private fun initializeYoubora(
    view: THEOplayerView,
    options: Options,
    logLevel: YouboraLog.Level
  ): Plugin {
    YouboraLog.setDebugLevel(logLevel)
//    val options: Options? = YouboraConfigManager.Companion.instance.getOptions(reactApplicationContext)
    val plugin = Plugin(options, reactApplicationContext).apply {
      activity = reactApplicationContext.currentActivity
      adapter = TheoplayerAdapter(view)
      adsAdapter = TheoplayerAdsAdapter(view.player)
    }
    return plugin
  }

  private fun convertMapToBundle(map: HashMap<*, *>): Bundle {
    return Bundle().apply {
      for ((key, value) in map.entries) {
        if (key is String) {
          when (value) {
            is String -> putNotNullString(key, value)
            is Double -> putDouble(key, value)
            is Int -> putInt(key, value)
            is Long -> putLong(key, value)
            is Boolean -> putBoolean(key, value)
            is HashMap<*, *> -> {
              val b = convertMapToBundle(value)
              putBundle(key, b)
            }
          }
        }
      }
    }
  }

  @ReactMethod
  fun destroy(tag: Int) {
    youboraPlugin[tag]?.disable()
  }
}
