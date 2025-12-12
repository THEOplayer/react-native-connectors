package com.theoplayer.reactnative.adobe.edge

import android.app.Application
import com.adobe.marketing.mobile.LoggingMode
import com.adobe.marketing.mobile.MobileCore
import com.facebook.react.bridge.*
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.util.ViewResolver

private const val TAG = "AdobeEdgeModule"

private const val PROP_ENVIRONMENT_ID = "environmentId"
private const val PROP_DEBUG_ENABLED = "debugEnabled"
private const val PROP_NAME = "name"

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
    config: ReadableMap,
  ) {
    /**
     * If an asset config file is provided, use it to initialize the MobileCore SDK, otherwise use
     * the App ID.
     * {@link https://developer.adobe.com/client-sdks/edge/media-for-edge-network/}
     */
    MobileCore.initialize(
      reactApplicationContext.applicationContext as Application,
      config.getString(PROP_ENVIRONMENT_ID) ?: "MissingEnvironmentID"
    )

    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.playerContext?.playerView?.let { playerView ->
        adobeConnectors[tag] = AdobeEdgeConnector(
          player = playerView.player,
          trackerConfig = config.toHashMap().mapValues { it.value?.toString() ?: "" }
        )
        if (config.hasKey(PROP_DEBUG_ENABLED)) {
          setDebug(tag, config.getBoolean(PROP_DEBUG_ENABLED))
        }
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
    adobeConnectors[tag]?.setLoggingMode(when (debug) {
      true -> LoggingMode.DEBUG
      false -> LoggingMode.ERROR
    })
  }

  /**
   * Sets customMetadataDetails which will be passed for the session start request.
   */
  @ReactMethod
  fun updateMetadata(tag: Int, metadataList: ReadableArray) {
    adobeConnectors[tag]?.updateMetadata(metadataList.toAdobeCustomMetadataDetails())
  }

  /**
   * Dispatch error event to adobe
   */
  @ReactMethod
  fun setError(tag: Int, errorDetails: ReadableMap) {
    adobeConnectors[tag]?.setError(errorDetails.getString(PROP_NAME) ?: "NA")
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
