package com.theoplayerconviva

import android.util.Log
import com.facebook.react.bridge.*
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.android.api.event.EventDispatcher
import com.theoplayer.android.api.event.ads.AdEvent
import com.theoplayer.android.connector.analytics.conviva.ConvivaConfiguration
import com.theoplayer.android.connector.analytics.conviva.ConvivaConnector
import com.theoplayer.util.ViewResolver

private const val TAG = "ConvivaModule"
private const val PROP_CUSTOMER_KEY = "customerKey"
private const val PROP_DEBUG = "debug"
private const val PROP_GATEWAY_URL = "gatewayUrl"

class ReactTHEOplayerConvivaModule(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver

  private var convivaConnectors: HashMap<Int, ConvivaConnector> = HashMap()

  init {
    viewResolver = ViewResolver(context)
  }

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun initialize(tag: Int, convivaMetadata: ReadableMap, convivaConfig: ReadableMap) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.let { player ->
        val customerKey = convivaConfig.getString(PROP_CUSTOMER_KEY) ?: ""
        if (customerKey.isEmpty()) {
          Log.e(TAG, "Invalid $PROP_CUSTOMER_KEY")
        } else {
          // Install broadcast as ad event extension

          val config = ConvivaConfiguration(
            customerKey,
            if (convivaConfig.hasKey(PROP_DEBUG)) convivaConfig.getBoolean(PROP_DEBUG) else false,
            convivaConfig.getString(PROP_GATEWAY_URL),
          )
          convivaConnectors[tag] =
            ConvivaConnector(
              reactApplicationContext,
              player,
              convivaMetadata.toHashMap(),
              config,
              view.broadcast as EventDispatcher<AdEvent<*>>
            )
          convivaConnectors[tag]?.setContentInfo(convivaMetadata.toHashMap())
        }
      }
    }
  }

  @ReactMethod
  fun stopAndStartNewSession(tag: Int, convivaMetadata: ReadableMap) {
    viewResolver.resolveViewByTag(tag) { _: ReactTHEOplayerView? ->
      convivaConnectors[tag]?.stopAndStartNewSession(convivaMetadata.toHashMap())
    }
  }

  @ReactMethod
  fun reportPlaybackFailed(tag: Int, message: String?) {
    viewResolver.resolveViewByTag(tag) { _: ReactTHEOplayerView? ->
      convivaConnectors[tag]?.reportPlaybackFailed(message ?: "")
    }
  }

  @ReactMethod
  fun reportPlaybackEvent(tag: Int, eventName: String, eventDetail: ReadableMap) {
    viewResolver.resolveViewByTag(tag) { _: ReactTHEOplayerView? ->
      convivaConnectors[tag]?.reportPlaybackEvent(eventName, eventDetail.toHashMap())
    }
  }

  @ReactMethod
  fun setContentInfo(tag: Int, convivaMetadata: ReadableMap) {
    viewResolver.resolveViewByTag(tag) { _: ReactTHEOplayerView? ->
      convivaConnectors[tag]?.setContentInfo(convivaMetadata.toHashMap())
    }
  }

  @ReactMethod
  fun setAdInfo(tag: Int, convivaMetadata: ReadableMap) {
    viewResolver.resolveViewByTag(tag) { _: ReactTHEOplayerView? ->
      convivaConnectors[tag]?.setAdInfo(convivaMetadata.toHashMap())
    }
  }

  @ReactMethod
  fun destroy(tag: Int) {
    // Destroy connector
    viewResolver.resolveViewByTag(tag) { _: ReactTHEOplayerView? ->
      convivaConnectors[tag]?.destroy()
      convivaConnectors.remove(tag)
    }
  }
}
