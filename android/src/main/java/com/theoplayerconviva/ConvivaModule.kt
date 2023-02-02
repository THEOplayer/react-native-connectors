package com.theoplayerconviva

import com.conviva.api.SystemSettings
import com.conviva.sdk.ConvivaSdkConstants
import com.facebook.react.bridge.*
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.android.connector.analytics.conviva.ConvivaConnector
import com.theoplayer.util.ViewResolver

private const val NAME = "ConvivaModule"

class ConvivaModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver

  private var convivaConnector: ConvivaConnector? = null

  init {
    viewResolver = ViewResolver(context)
  }

  override fun getName(): String {
    return NAME
  }

  // Example method
  // See https://reactnative.dev/docs/native-modules-android
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
}
