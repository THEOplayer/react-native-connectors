package com.theoplayernielsen

import android.util.Log
import com.facebook.react.bridge.*
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.util.ViewResolver

private const val TAG = "NielsenModule"
private const val PROP_CUSTOMER_KEY = "customerKey"

class ReactTHEOplayerNielsenModule(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver

  private var nielsenConnectors: HashMap<Int, NielsenConnector> = HashMap()

  init {
    viewResolver = ViewResolver(context)
  }

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun initialize(tag: Int, nielsenMetadata: ReadableMap, nielsenConfig: ReadableMap) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.let {
        val customerKey = nielsenConfig.getString(PROP_CUSTOMER_KEY) ?: ""
        if (customerKey.isEmpty()) {
          Log.e(TAG, "Invalid $PROP_CUSTOMER_KEY")
        } else {
//          nielsenConnectors[tag] =
//          nielsenConnectors[tag]?.setContentInfo(nielsenMetadata.toHashMap())
        }
      }
    }
  }

  @ReactMethod
  fun setContentInfo(tag: Int, nielsenMetadata: ReadableMap) {
//    nielsenConnectors[tag]?.setContentInfo(nielsenMetadata.toHashMap())
  }

  @ReactMethod
  fun setAdInfo(tag: Int, nielsenMetadata: ReadableMap) {
//    nielsenConnectors[tag]?.setAdInfo(nielsenMetadata.toHashMap())
  }

  @ReactMethod
  fun destroy(tag: Int) {
//    nielsenConnectors[tag]?.destroy()
//    nielsenConnectors.remove(tag)
  }
}
