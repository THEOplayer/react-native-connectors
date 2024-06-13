package com.theoplayeryospace

import android.util.Log
import com.facebook.react.bridge.*
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.android.api.event.EventDispatcher
import com.theoplayer.android.api.event.ads.AdEvent
import com.theoplayer.android.connector.analytics.yospace.YospaceConfiguration
import com.theoplayer.android.connector.analytics.yospace.YospaceConnector
import com.theoplayer.util.ViewResolver

private const val TAG = "YospaceModule"
private const val PROP_CUSTOMER_KEY = "customerKey"
private const val PROP_DEBUG = "debug"
private const val PROP_GATEWAY_URL = "gatewayUrl"

class ReactTHEOplayerYospaceModule(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver

  private var yospaceConnectors: HashMap<Int, YospaceConnector> = HashMap()

  init {
    viewResolver = ViewResolver(context)
  }

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun initialize(tag: Int, yospaceMetadata: ReadableMap, yospaceConfig: ReadableMap) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.let { player ->
        val customerKey = yospaceConfig.getString(PROP_CUSTOMER_KEY) ?: ""
        if (customerKey.isEmpty()) {
          Log.e(TAG, "Invalid $PROP_CUSTOMER_KEY")
        } else {
          // Install broadcast as ad event extension

          val config = YospaceConfiguration(
            customerKey,
            yospaceConfig.getBoolean(PROP_DEBUG),
            yospaceConfig.getString(PROP_GATEWAY_URL),
          )
          yospaceConnectors[tag] =
            YospaceConnector(
              reactApplicationContext,
              player,
              yospaceMetadata.toHashMap(),
              config,
              view.broadcast as EventDispatcher<AdEvent<*>>
            )
          yospaceConnectors[tag]?.setContentInfo(yospaceMetadata.toHashMap())
        }
      }
    }
  }

  @ReactMethod
  fun stopAndStartNewSession(tag: Int, yospaceMetadata: ReadableMap) {
    yospaceConnectors[tag]?.stopAndStartNewSession(yospaceMetadata.toHashMap())
  }

  @ReactMethod
  fun reportPlaybackFailed(tag: Int, message: String?) {
    yospaceConnectors[tag]?.reportPlaybackFailed(message ?: "")
  }

  @ReactMethod
  fun reportPlaybackEvent(tag: Int, eventName: String, eventDetail: ReadableMap) {
    yospaceConnectors[tag]?.reportPlaybackEvent(eventName, eventDetail.toHashMap())
  }

  @ReactMethod
  fun setContentInfo(tag: Int, yospaceMetadata: ReadableMap) {
    yospaceConnectors[tag]?.setContentInfo(yospaceMetadata.toHashMap())
  }

  @ReactMethod
  fun setAdInfo(tag: Int, yospaceMetadata: ReadableMap) {
    yospaceConnectors[tag]?.setAdInfo(yospaceMetadata.toHashMap())
  }

  @ReactMethod
  fun destroy(tag: Int) {
    // Destroy connector
    yospaceConnectors[tag]?.destroy()
    yospaceConnectors.remove(tag)
  }
}
