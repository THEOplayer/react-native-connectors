package com.theoplayerconviva

import android.util.Log
import com.facebook.react.bridge.*
import com.theoplayer.ReactTHEOplayerView
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
          val config = ConvivaConfiguration(
            customerKey,
            convivaConfig.getBoolean(PROP_DEBUG),
            convivaConfig.getString(PROP_GATEWAY_URL),
          )
          convivaConnectors[tag] =
            ConvivaConnector(reactApplicationContext, player, convivaMetadata.toHashMap(), config)
          convivaConnectors[tag]?.setContentInfo(convivaMetadata.toHashMap())
        }
      }
    }
  }

  @ReactMethod
  fun stopAndStartNewSession(tag: Int, convivaMetadata: ReadableMap) {
    convivaConnectors[tag]?.stopAndStartNewSession(convivaMetadata.toHashMap())
  }

  @ReactMethod
  fun reportPlaybackFailed(tag: Int, message: String?) {
    convivaConnectors[tag]?.reportPlaybackFailed(message ?: "")
  }

  @ReactMethod
  fun setContentInfo(tag: Int, convivaMetadata: ReadableMap) {
    convivaConnectors[tag]?.setContentInfo(convivaMetadata.toHashMap())
  }

  @ReactMethod
  fun setAdInfo(tag: Int, convivaMetadata: ReadableMap) {
    convivaConnectors[tag]?.setAdInfo(convivaMetadata.toHashMap())
  }

  @ReactMethod
  fun destroy(tag: Int) {
    convivaConnectors[tag]?.destroy()
    convivaConnectors.remove(tag)
  }
}
