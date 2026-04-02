package com.theoplayer.reactnative.clientsideadbeaconing

import com.facebook.react.bridge.*
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.util.ViewResolver
import android.util.Log

private const val TAG = "ClientsideAdBeaconingModule"

class ReactTHEOplayerClientsideAdBeaconingModule(val context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver = ViewResolver(context)
  private var clientsideAdBeaconingConnectors: HashMap<Int, ClientsideAdBeaconingConnector> = HashMap()

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun initialize(tag: Int) {
    Log.d(TAG, "ClientsideAdBeaconingConnector initialize triggered for tag: $tag")
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.let { player ->
        // Optionally destroy any existing connector for this player.
        Log.d(TAG, "Player found for tag: $tag")
        clientsideAdBeaconingConnectors[tag]?.destroy()
        clientsideAdBeaconingConnectors[tag] = ClientsideAdBeaconingConnector(
          context = view.context,
          player = player
        )
      }
    }
  }

  @ReactMethod
  fun destroy(tag: Int) {
    context.runOnUiQueueThread {
      clientsideAdBeaconingConnectors[tag]?.destroy()
    }
  }
}
