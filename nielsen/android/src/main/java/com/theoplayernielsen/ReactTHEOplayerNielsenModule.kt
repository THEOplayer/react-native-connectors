package com.theoplayernielsen

import com.facebook.react.bridge.*
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.android.connector.analytics.nielsen.NielsenConnector
import com.theoplayer.util.ViewResolver

private const val PROP_DEBUG = "nol_sdkDebug"

private const val TAG = "NielsenModule"

class ReactTHEOplayerNielsenModule(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver = ViewResolver(context)

  private var nielsenConnectors: HashMap<Int, NielsenConnector> = HashMap()

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun initialize(tag: Int, appId: String, instanceName: String, options: ReadableMap) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.let { player ->
        val debug = if (options.hasKey(PROP_DEBUG)) options.getString(PROP_DEBUG) == "debug" else false

        // Optionally destroy any existing connector for this player.
        nielsenConnectors[tag]?.destroy()
        nielsenConnectors[tag] = NielsenConnector(view.context, player, appId, debug)
      }
    }
  }

  @ReactMethod
  fun updateMetadata(tag: Int, metadata: ReadableMap) {
    nielsenConnectors[tag]?.updateMetadata(metadata.toHashMap() as HashMap<String, Any>)
  }

  @ReactMethod
  fun destroy(tag: Int) {
    nielsenConnectors[tag]?.destroy()
  }
}
