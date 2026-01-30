package com.theoplayer.reactnative.bitmovin

import com.bitmovin.analytics.theoplayer.api.ITHEOplayerCollector
import com.facebook.react.bridge.*
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.util.ViewResolver

private const val TAG = "BitmovinModule"

class ReactTHEOplayerBitmovinModule(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver = ViewResolver(context)
  private var bitmovinConnectors: HashMap<Int, ITHEOplayerCollector> = HashMap()

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun initialize(tag: Int, config: ReadableMap, defaultMetadata: ReadableMap?) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.let { player ->
        // Optionally destroy any existing connector for this player.
        bitmovinConnectors[tag]?.detachPlayer()
        val connector = ITHEOplayerCollector.create(
          view.context,
          BitmovinAdapter.parseConfig(config)
        )
        defaultMetadata?.let {
          connector.defaultMetadata = BitmovinAdapter.parseDefaultMetadata(it)
        }
        connector.attachPlayer(player)
        bitmovinConnectors[tag] = connector
      }
    }
  }

  @ReactMethod
  fun updateSourceMetadata(tag: Int, metadata: ReadableMap) {
    bitmovinConnectors[tag]?.sourceMetadata = BitmovinAdapter.parseSourceMetadata(metadata)
  }

  @ReactMethod
  fun updateCustomData(tag: Int, customData: ReadableMap) {
    // TODO: resolve threading issue first
    //bitmovinConnectors[tag]?.customData = BitmovinAdapter.parseCustomData(customData)
  }

  @ReactMethod
  fun programChange(tag: Int, sourceMetadata: ReadableMap) {
    // NYI
    //bitmovinConnectors[tag]?.programChange(BitmovinAdapter.parseSourceMetadata(sourceMetadata))
  }

  @ReactMethod
  fun sendCustomDataEvent(tag: Int, customData: ReadableMap) {
    bitmovinConnectors[tag]?.sendCustomDataEvent(BitmovinAdapter.parseCustomData(customData))
  }

  @ReactMethod
  fun destroy(tag: Int) {
    bitmovinConnectors[tag]?.detachPlayer()
  }
}
