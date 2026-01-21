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
  fun initialize(tag: Int, config: ReadableMap, sourceMetadata: ReadableMap?) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.let { player ->
        // Optionally destroy any existing connector for this player.
        bitmovinConnectors[tag]?.detachPlayer()
        val connector = ITHEOplayerCollector.create(
          view.context,
          BitmovinAdapter.parseConfig(config)
        )
        sourceMetadata?.let {
          connector.sourceMetadata = BitmovinAdapter.parseSourceMetadata(it)
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
    bitmovinConnectors[tag]?.customData = BitmovinAdapter.parseCustomData(customData)
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
