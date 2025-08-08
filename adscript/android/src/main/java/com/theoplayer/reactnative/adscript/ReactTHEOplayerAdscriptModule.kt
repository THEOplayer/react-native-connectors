package com.theoplayer.reactnative.adscript

import android.util.Log
import com.facebook.react.bridge.*
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.android.api.THEOplayerView
import com.theoplayer.android.connector.analytics.adscript.AdscriptConfiguration
import com.theoplayer.android.connector.analytics.adscript.AdscriptConnector
import com.theoplayer.util.ViewResolver
import com.nad.adscriptapiclient.AdScriptDataObject
import com.nad.adscriptapiclient.AdScriptI12n
import org.json.JSONException

private const val TAG = "AdscriptModule"

class ReactTHEOplayerAdscriptModule(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver = ViewResolver(context)

  private var adscriptConnectors: HashMap<Int, AdscriptConnector> = HashMap()

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun initialize(tag: Int, implementationId: String, contentMetadata: ReadableMap, debug: Boolean) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.playerContext?.playerView?.let { playerView ->
        adscriptConnectors[tag] =
          initializeAdscript(playerView, implementationId, contentMetadata, debug)
      }
    }
  }

  private fun initializeAdscript(
    view: THEOplayerView,
    implementationId: String,
    contentMetadata: ReadableMap,
    debug: Boolean
  ): AdscriptConnector {
    return AdscriptConnector(
      activity = reactApplicationContext.currentActivity!!,
      playerView = view,
      configuration = AdscriptConfiguration(implementationId, debug),
      contentMetadata = buildContentMetadata(contentMetadata),
      adProcessor = null)
  }

  private fun buildContentMetadata(contentMetadata: ReadableMap): AdScriptDataObject {
    return AdScriptDataObject().apply {
      for (entry in contentMetadata.toHashMap().entries) {
        try {
          when (entry.value) {
            is String -> set(entry.key, entry.value as String)
            is Boolean -> set(entry.key, entry.value as Boolean)
            is Int -> set(entry.key, entry.value as Int)
            is Long -> set(entry.key, entry.value as Long)
          }
        } catch (e: Exception) {
          Log.e(TAG, "Failed to add contentMetadata value ${entry.key}: ${e.message}")
        }
      }
    }
  }

  private fun buildUser(user: ReadableArray): AdScriptI12n {
    return AdScriptI12n().apply {
      try {
        for (i in 0 until user.size()) {
          set(i, user.getString(i))
        }
      } catch (e: JSONException) {
        Log.e(TAG, "Failed to build user: ${e.message}")
      }
    }
  }

  @ReactMethod
  fun updateMetadata(tag: Int, contentMetadata: ReadableMap) {
    adscriptConnectors[tag]?.updateMetadata(buildContentMetadata(contentMetadata))
  }

  @ReactMethod
  fun updateUser(tag: Int, user: ReadableArray) {
    adscriptConnectors[tag]?.updateUser(buildUser(user))
  }

  @ReactMethod
  fun destroy(tag: Int) {
    adscriptConnectors[tag]?.destroy()
  }
}
