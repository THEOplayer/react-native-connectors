package com.theoplayer.reactnative.adobe

import com.facebook.react.bridge.*
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.android.api.THEOplayerView
import com.theoplayer.util.ViewResolver

private const val TAG = "AdobeModule"

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
            context = reactApplicationContext,
            playerView = playerView,
            uri = uri,
            ecid = ecid,
            sid = sid,
            trackingUrl = trackingUrl,
            metadata = metadata,
            userAgent = userAgent,
            debug = debug
          )
      }
    }
  }

  @ReactMethod
  fun destroy(tag: Int) {
//    adobeConnectors[tag]?.destroy()
  }
}
