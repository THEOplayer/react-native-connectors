@file:Suppress("unused")
package com.theoplayer.reactnative.bitmovin

import com.facebook.react.bridge.*
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.util.ViewResolver

private const val TAG = "BitmovinModule"

class ReactTHEOplayerBitmovinModule(val context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver = ViewResolver(context)
  private var bitmovinConnectors: HashMap<Int, BitmovinHandler> = HashMap()

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun initialize(tag: Int, config: ReadableMap, defaultMetadata: ReadableMap?) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.let { player ->
        // Optionally destroy any existing connector for this player.
        bitmovinConnectors[tag]?.destroy()
        bitmovinConnectors[tag] = BitmovinHandler(
          context = view.context,
          player = player,
          config = BitmovinAdapter.parseConfig(config),
          defaultMetadata = BitmovinAdapter.parseDefaultMetadata(defaultMetadata)
        )
      }
    }
  }

  @ReactMethod
  fun updateSourceMetadata(tag: Int, metadata: ReadableMap) {
    context.runOnUiQueueThread {
      bitmovinConnectors[tag]?.currentSourceMetadata = BitmovinAdapter.parseSourceMetadata(metadata)
    }
  }

  @ReactMethod
  fun updateCustomData(tag: Int, customData: ReadableMap) {
    context.runOnUiQueueThread {
      bitmovinConnectors[tag]?.customData = BitmovinAdapter.parseCustomData(customData)
    }
  }

  @ReactMethod
  fun programChange(tag: Int, sourceMetadata: ReadableMap) {
    context.runOnUiQueueThread {
      bitmovinConnectors[tag]?.programChange(BitmovinAdapter.parseSourceMetadata(sourceMetadata))
    }
  }

  @ReactMethod
  fun sendCustomDataEvent(tag: Int, customData: ReadableMap) {
    context.runOnUiQueueThread {
      bitmovinConnectors[tag]?.sendCustomDataEvent(BitmovinAdapter.parseCustomData(customData))
    }
  }

  @ReactMethod
  fun destroy(tag: Int) {
    context.runOnUiQueueThread {
      bitmovinConnectors[tag]?.destroy()
    }
  }
}
