package com.theoplayer.reactnative.adobe.edge

import android.app.Application
import com.adobe.marketing.mobile.MobileCore
import com.facebook.react.bridge.*
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.util.ViewResolver

private const val TAG = "AdobeEdgeModule"

@Suppress("unused")
class ReactTHEOplayerAdobeModule(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver = ViewResolver(context)

  private var adobeConnectors: HashMap<Int, AdobeEdgeConnector> = HashMap()

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun initialize(
    tag: Int,
    edgeBasePath: String,
    datastreamId: String,
    orgId: String?,
    debug: Boolean?,
    debugSessionId: String?
  ) {
    MobileCore.initialize(
      reactApplicationContext.applicationContext as Application,
      datastreamId
    )

    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.playerContext?.playerView?.let { playerView ->
        adobeConnectors[tag] =
          AdobeEdgeConnector(
            player = playerView.player,
            debug = debug,
            debugSessionId = debugSessionId
          )
      }
    }
  }

  /**
   * Set debug flag.
   *
   * @param debug whether to write debug info or not.
   */
  @ReactMethod
  fun setDebug(tag: Int, debug: Boolean) {
    adobeConnectors[tag]?.setDebug(debug)
  }

  /**
   * Set a debugSessionID query parameter that is added to all outgoing requests.
   */
  @ReactMethod
  fun setDebugSessionId(tag: Int, id: String?) {
    adobeConnectors[tag]?.setDebugSessionId(id)
  }

  /**
   * Sets customMetadataDetails which will be passed for the session start request.
   */
  @ReactMethod
  fun updateMetadata(tag: Int, metadataList: ReadableArray) {
    adobeConnectors[tag]?.updateMetadata(
      metadataList.toAdobeCustomMetadataDetails()
    )
  }

  /**
   * Dispatch error event to adobe
   */
  @ReactMethod
  fun setError(tag: Int, errorDetails: ReadableMap) {
    adobeConnectors[tag]?.setError(errorDetails.toAdobeErrorDetails())
  }

  /**
   * Explicitly stop the current session and start a new one.
   *
   * This can be used to manually mark the start of a new session during a live stream,
   * for example when a new program starts.
   *
   * @param customMetadataDetails media details information.
   */
  @ReactMethod
  fun stopAndStartNewSession(tag: Int, customMetadataDetails: ReadableArray) {
    adobeConnectors[tag]?.stopAndStartNewSession(customMetadataDetails.toAdobeCustomMetadataDetails())
  }

  /**
   * Stops video and ad analytics and closes all sessions.
   */
  @ReactMethod
  fun destroy(tag: Int) {
    adobeConnectors[tag]?.destroy()
  }
}
