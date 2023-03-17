package com.theoplayernielsen

import com.facebook.react.bridge.*
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.util.ViewResolver

private const val TAG = "NielsenModule"

class ReactTHEOplayerNielsenModule(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver

  private var nielsenConnectors: HashMap<Int, NielsenConnector> = HashMap()

  init {
    viewResolver = ViewResolver(context)
  }

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun initialize(tag: Int, appId: String, debug: Boolean = false) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.let { player ->
        nielsenConnectors[tag] = NielsenConnector(view.context, player, appId, debug)
      }
    }
  }

  @ReactMethod
  fun updateMetadata(tag: Int, metadata: ReadableMap) {
    nielsenConnectors[tag]?.updateMetadata(metadata.toHashMap())
  }

  @ReactMethod
  fun destroy(tag: Int) {
    nielsenConnectors[tag]?.destroy()
  }
}
