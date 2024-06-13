package com.theoplayeryospace

import com.facebook.react.bridge.*
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.android.connector.yospace.YospaceConnector
import com.theoplayer.source.SSAIAdapterRegistry
import com.theoplayer.util.ViewResolver

private const val TAG = "YospaceModule"
private const val PROP_SSAI_INTEGRATION_YOSPACE = "yospace"

class ReactTHEOplayerYospaceModule(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver

  private var yospaceConnectors: HashMap<Int, YospaceConnector> = HashMap()

  init {
    viewResolver = ViewResolver(context)

    // Register source builder
    SSAIAdapterRegistry.register(PROP_SSAI_INTEGRATION_YOSPACE) { json, currentBuilder ->
      currentBuilder.apply {
        yospaceBuilderFromJson(currentBuilder, json)
      }
    }
  }

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun initialize(tag: Int) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.playerContext?.playerView?.let {
        // Create native connector
        yospaceConnectors[tag] = YospaceConnector(it)
      }
    }
  }

  @ReactMethod
  fun destroy(tag: Int) {
    yospaceConnectors.remove(tag)
  }
}
