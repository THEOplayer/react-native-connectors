package com.theoplayer.engage

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter
import com.theoplayer.engage.publish.Constants.PUBLISH_TYPE
import com.theoplayer.engage.publish.Publisher
import org.json.JSONArray

private const val TAG = "EngageModule"

private const val PROP_DEBUG = "debug"
private const val PROP_RECOMMENDATION_TITLE = "recommendationTitle"
private const val PROP_PUBLISH_SIGNIN_CARD = "shouldPublishSignInCard"

private const val VAL_CONTINUATION = "continuation"
private const val VAL_FEATURED = "featured"
private const val VAL_RECOMMENDATION = "recommendation"

class ReactTHEOplayerEngageModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun initialize(options: ReadableMap) {
    EngageConfiguration.debug =
      if (options.hasKey(PROP_DEBUG)) options.getBoolean(PROP_DEBUG) else false
    EngageConfiguration.recommendationTitle = options.getString(PROP_RECOMMENDATION_TITLE)
    EngageConfiguration.shouldPublishSignInCard =
      if (options.hasKey(PROP_PUBLISH_SIGNIN_CARD)) options.getBoolean(PROP_PUBLISH_SIGNIN_CARD) else false
  }

  @ReactMethod
  fun updateClusterEntities(type: String) {
    if (EngageConfiguration.debug) {
      Log.d(TAG, "Requesting update for cluster type $type")
    }

    reactContext.getJSModule(RCTDeviceEventEmitter::class.java).emit(
      "onUpdateCluster",
      Arguments.createMap().apply {
        putString(PUBLISH_TYPE, type)
      })
  }

  @ReactMethod
  fun setClusterEntities(type: String, entities: ReadableArray, isPersonalized: Boolean) {
    val entitiesJson = JSONArray(entities.toArrayList())
    if (EngageConfiguration.debug) {
      Log.d(TAG, "Setting entities for type $type: ${entitiesJson.toString(2)}")
    }
    when (type) {
      VAL_CONTINUATION -> Publisher.publishContinuationClusters(reactContext, entitiesJson)
      VAL_FEATURED -> Publisher.publishFeaturedClusters(reactContext, entitiesJson)
      VAL_RECOMMENDATION -> Publisher.publishRecommendationClusters(reactContext, entitiesJson)
      else -> Log.w(TAG, "Invalid cluster type: $type")
    }
  }

  @ReactMethod
  fun removeClusterEntities(type: String) {
    // TODO
  }

  @ReactMethod
  fun removeAllClusterEntities() {
    // TODO
  }

  @ReactMethod
  fun addListener(eventName: String?) {
  }

  @ReactMethod
  fun removeListeners(count: Int?) {
  }

  @ReactMethod
  fun destroy() {
  }
}
