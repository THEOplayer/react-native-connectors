package com.theoplayer.reactnative.mediakind.ssai

import com.facebook.react.bridge.*
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.util.ViewResolver
import android.util.Log

private const val TAG = "MediaKindSSAIModule"

class ReactTHEOplayerMediaKindSSAIModule(val context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver = ViewResolver(context)
  private var connectors: HashMap<Int, MediaKindSSAIConnector> = HashMap()

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun initialize(tag: Int) {
    Log.d(TAG, "MediaKindSSAIConnector initialize triggered for tag: $tag")
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.let { player ->
        // Optionally destroy any existing connector for this player.
        Log.d(TAG, "Player found for tag: $tag")
        connectors[tag]?.destroy()
        connectors[tag] = MediaKindSSAIConnector(
          context = view.context,
          player = player
        )
      }
    }
  }

  @ReactMethod
  fun destroy(tag: Int) {
    context.runOnUiQueueThread {
      connectors[tag]?.destroy()
    }
  }
}
