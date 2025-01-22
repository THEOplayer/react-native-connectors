package com.ReactNativeTHEOplayerConnector

import com.facebook.react.bridge.*
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.util.ViewResolver

private const val TAG = "ReactNativeTHEOplayerConnectorModule"
private const val PROP_DEBUG = "debug"

class ReactNativeTHEOplayerConnectorModule(context: ReactApplicationContext) :
    ReactContextBaseJavaModule(context) {

    private val viewResolver: ViewResolver

    // Keep a map that links a connector to a player instance
    private var connectors: HashMap<Int, ReactNativeTHEOplayerConnector> = HashMap()

    init {
        viewResolver = ViewResolver(context)
    }

    override fun getName(): String {
        return TAG
    }

    @ReactMethod
    fun initialize(tag: Int, connectorConfig: ReadableMap) {
        viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
            view?.player?.let { player ->
                val config = ReactNativeTHEOplayerConnectorConfiguration(
                    connectorConfig.getBoolean(PROP_DEBUG),
                )
                connectors[tag] =
                    ReactNativeTHEOplayerConnector(reactApplicationContext, player, config)
            }
        }
    }

    @ReactMethod
    fun destroy(tag: Int) {
        connectors[tag]?.destroy()
        connectors.remove(tag)
    }
}
