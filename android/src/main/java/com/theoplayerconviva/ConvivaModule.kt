package com.theoplayerconviva

import android.util.Log
import com.conviva.api.SystemSettings
import com.conviva.sdk.ConvivaSdkConstants
import com.facebook.react.bridge.*
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.android.connector.analytics.conviva.ConvivaConnector
import com.theoplayer.util.ViewResolver

private const val TAG = "ConvivaModule"
private const val PROP_CUSTOMER_KEY = "customerKey"

class ConvivaModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver

  private var convivaConnector: ConvivaConnector? = null

  init {
    viewResolver = ViewResolver(context)
  }

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun initialize(tag: Int, convivaMetadata: ReadableMap, convivaConfig: ReadableMap) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->

      val player = view?.player

      // TODO
      val customerKey = "your_conviva_customer_key"
      val gatewayUrl = "your_conviva_debug_gateway_url"

      val settings = HashMap<String, Any>()
      settings[ConvivaSdkConstants.GATEWAY_URL] = gatewayUrl
      settings[ConvivaSdkConstants.LOG_LEVEL] = SystemSettings.LogLevel.DEBUG

      view?.let {
        convivaConnector =
          ConvivaConnector(reactApplicationContext, view.player!!, customerKey, settings)
        convivaConnector?.setViewerId("viewer ID")
      }
    }
  }

  @ReactMethod
  fun destroy() {
    convivaConnector?.destroy()
  }

  @ReactMethod
  fun initialize(view: ReactTHEOplayerView, convivaMetadata: ReadableMap, convivaConfig: ReadableMap) {
    val settings = convivaConfig.toHashMap()
    val customerKey: String? = settings[PROP_CUSTOMER_KEY] as String?
    if (customerKey == null) {
      Log.e(TAG, "Invalid or missing property 'customerKey'")
      return
    }

    convivaConnector =
      ConvivaConnector(reactApplicationContext, view.player!!, customerKey, settings)
    val metadata = convivaMetadata.toHashMap()
    convivaConnector?.setContentInfo(metadata)
  }
}
