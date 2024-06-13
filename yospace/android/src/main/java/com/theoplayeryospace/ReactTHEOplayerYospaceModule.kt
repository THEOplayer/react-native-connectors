package com.theoplayeryospace

import com.facebook.react.bridge.*
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.android.connector.yospace.YospaceConnector
import com.theoplayer.source.SSAIAdapterRegistry
import com.theoplayer.util.ViewResolver
import com.yospace.admanagement.Session

private const val TAG = "YospaceModule"
private const val PROP_SSAI_INTEGRATION_YOSPACE = "yospace"

class ReactTHEOplayerYospaceModule(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver

  private var yospaceConnectors: HashMap<Int, YospaceConnector> = HashMap()

  init {
    viewResolver = ViewResolver(context)

    // Register source builder
    if (!SSAIAdapterRegistry.hasIntegration(PROP_SSAI_INTEGRATION_YOSPACE)) {
      SSAIAdapterRegistry.register(PROP_SSAI_INTEGRATION_YOSPACE) { json, currentBuilder ->
        yospaceBuilderFromJson(currentBuilder, json)
      }
    }
  }

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun initialize(tag: Int, debugFlags: Int?) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.playerContext?.playerView?.let {
        // Create native connector
        yospaceConnectors[tag] = YospaceConnector(it)
      }
    }
    if (debugFlags != null) {
      Session.SessionProperties.setDebugFlags(debugFlags)
    }
  }

  @ReactMethod
  fun destroy(tag: Int) {
    yospaceConnectors.remove(tag)
  }
}
