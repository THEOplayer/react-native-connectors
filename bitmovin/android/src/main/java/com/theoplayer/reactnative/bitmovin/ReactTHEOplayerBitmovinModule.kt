package com.theoplayer.reactnative.bitmovin

import com.facebook.react.bridge.*
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.util.ViewResolver

private const val TAG = "BitmovinModule"

class ReactTHEOplayerBitmovinModule(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver = ViewResolver(context)

  //private var bitmovinConnectors: HashMap<Int, BitmovinConnector> = HashMap()

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun initialize(tag: Int, config: ReadableMap) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.let { player ->
        // Optionally destroy any existing connector for this player.
        //bitmovinConnectors[tag]?.destroy()
        //bitmovinConnectors[tag] = BitmovinConnector(view.context, debug)
      }
    }
  }

  @ReactMethod
  fun updateMetadata(tag: Int, metadata: ReadableMap) {
    //bitmovinConnectors[tag]?.updateMetadata(metadata.toHashMap() as HashMap<String, Any>)
  }

  @ReactMethod
  fun destroy(tag: Int) {
    //bitmovinConnectors[tag]?.destroy()
  }
}
