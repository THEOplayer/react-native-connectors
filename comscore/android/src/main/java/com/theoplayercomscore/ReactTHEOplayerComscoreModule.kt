package com.theoplayercomscore

import android.util.Log
import com.facebook.react.bridge.*
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.util.ViewResolver

private const val TAG = "ComscoreModule"
private const val PROP_CUSTOMER_KEY = "customerKey"

class ReactTHEOplayerComscoreModule(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver

//  private var comscoreConnectors: HashMap<Int, ComscoreConnector> = HashMap()

  init {
    viewResolver = ViewResolver(context)
  }

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun initialize(tag: Int, comscoreMetadata: ReadableMap, comscoreConfig: ReadableMap) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.let {
        val customerKey = comscoreConfig.getString(PROP_CUSTOMER_KEY) ?: ""
        if (customerKey.isEmpty()) {
          Log.e(TAG, "Invalid $PROP_CUSTOMER_KEY")
        } else {
          // TODO: create connector
//          comscoreConnectors[tag] =
//          comscoreConnectors[tag]?.setContentInfo(comscoreMetadata.toHashMap())
        }
      }
    }
  }

  @ReactMethod
  fun setContentInfo(tag: Int, comscoreMetadata: ReadableMap) {
//    comscoreConnectors[tag]?.setContentInfo(comscoreMetadata.toHashMap())
  }

  @ReactMethod
  fun setAdInfo(tag: Int, comscoreMetadata: ReadableMap) {
//    comscoreConnectors[tag]?.setAdInfo(comscoreMetadata.toHashMap())
  }

  @ReactMethod
  fun destroy(tag: Int) {
//    comscoreConnectors[tag]?.destroy()
//    comscoreConnectors.remove(tag)
  }
}
