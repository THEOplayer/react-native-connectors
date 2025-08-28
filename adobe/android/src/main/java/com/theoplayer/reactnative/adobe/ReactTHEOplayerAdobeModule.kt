
package com.theoplayer.reactnative.adobe

import com.facebook.react.bridge.*
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.util.ViewResolver

private const val TAG = "AdobeModule"

@Suppress("unused")
class ReactTHEOplayerAdobeModule(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver = ViewResolver(context)

  private var adobeConnectors: HashMap<Int, AdobeConnector> = HashMap()

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun initialize(
    tag: Int,
    uri: String,
    ecid: String,
    sid: String,
    trackingUrl: String,
    metadata: ReadableMap?,
    userAgent: String?,
    debug: Boolean?
  ) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.playerContext?.playerView?.let { playerView ->
        adobeConnectors[tag] =
          AdobeConnector(
            player = playerView.player,
            uri = uri,
            ecid = ecid,
            sid = sid,
            trackingUrl = trackingUrl,
            metadata = metadata?.toAdobeMetaData(),
            userAgent = userAgent,
            debug = debug
          )
      }
    }
  }

  @ReactMethod
  fun setDebug(tag: Int, debug: Boolean) {
    adobeConnectors[tag]?.setDebug(debug)
  }

  @ReactMethod
  fun updateMetadata(tag: Int, metadata: ReadableMap) {
    adobeConnectors[tag]?.updateMetadata(metadata.toAdobeMetaData())
  }

  @ReactMethod
  fun setError(tag: Int, metadata: ReadableMap) {
    adobeConnectors[tag]?.setError(metadata.toAdobeMetaData())
  }

  @ReactMethod
  fun stopAndStartNewSession(tag: Int, metadata: ReadableMap) {
    adobeConnectors[tag]?.stopAndStartNewSession(metadata.toAdobeMetaData())
  }

  @ReactMethod
  fun destroy(tag: Int) {
    adobeConnectors[tag]?.destroy()
  }
}
