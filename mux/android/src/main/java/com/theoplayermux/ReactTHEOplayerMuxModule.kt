package com.theoplayermux

import android.util.Log
import com.facebook.react.bridge.*
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.android.connector.analytics.mux.MuxConfiguration
import com.theoplayer.android.connector.analytics.mux.MuxConnector
import com.theoplayer.util.ViewResolver

private const val TAG = "MuxModule"
private const val PROP_CUSTOMER_KEY = "customerKey"
private const val PROP_DEBUG = "debug"
private const val PROP_GATEWAY_URL = "gatewayUrl"

class ReactTHEOplayerMuxModule(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver

  private var muxConnectors: HashMap<Int, MuxConnector> = HashMap()

  init {
    viewResolver = ViewResolver(context)
  }

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun initialize(tag: Int, muxMetadata: ReadableMap, muxConfig: ReadableMap) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.let { player ->
        val customerKey = muxConfig.getString(PROP_CUSTOMER_KEY) ?: ""
        if (customerKey.isEmpty()) {
          Log.e(TAG, "Invalid $PROP_CUSTOMER_KEY")
        } else {
          val config = MuxConfiguration(
            customerKey,
            muxConfig.getBoolean(PROP_DEBUG),
            muxConfig.getString(PROP_GATEWAY_URL),
          )
          muxConnectors[tag] =
            MuxConnector(reactApplicationContext, player, muxMetadata.toHashMap(), config)
          muxConnectors[tag]?.setContentInfo(muxMetadata.toHashMap())
        }
      }
    }
  }

  @ReactMethod
  fun stopAndStartNewSession(tag: Int, muxMetadata: ReadableMap) {
    muxConnectors[tag]?.stopAndStartNewSession(muxMetadata.toHashMap())
  }

  @ReactMethod
  fun reportPlaybackFailed(tag: Int, message: String?) {
    muxConnectors[tag]?.reportPlaybackFailed(message ?: "")
  }

  @ReactMethod
  fun setContentInfo(tag: Int, muxMetadata: ReadableMap) {
    muxConnectors[tag]?.setContentInfo(muxMetadata.toHashMap())
  }

  @ReactMethod
  fun setAdInfo(tag: Int, muxMetadata: ReadableMap) {
    muxConnectors[tag]?.setAdInfo(muxMetadata.toHashMap())
  }

  @ReactMethod
  fun destroy(tag: Int) {
    muxConnectors[tag]?.destroy()
    muxConnectors.remove(tag)
  }
}
