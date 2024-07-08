package com.theoplayer.engage

import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.theoplayer.engage.adapter.ClusterType
import com.theoplayer.engage.publish.Publisher
import org.json.JSONObject

private const val TAG = "EngageModule"

private const val PROP_DEBUG = "debug"
private const val PROP_CLUSTER_TYPE = "type"

private const val VAL_CONTINUATION = "continuation"
private const val VAL_FEATURED = "featured"
private const val VAL_RECOMMENDATION = "recommendation"
private const val VAL_SUBSCRIPTION = "subscription"

class ReactTHEOplayerEngageModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun initialize(options: ReadableMap) {
    EngageConfiguration.debug =
      if (options.hasKey(PROP_DEBUG)) options.getBoolean(PROP_DEBUG) else false

    // Notify engage is ready
    dispatchEvent("onEngageReady", Arguments.createMap())
  }

  @ReactMethod
  fun publishCluster(cluster: ReadableMap) {
    val clusterJson = JSONObject(cluster.toHashMap())
    val clusterType = ClusterType.fromString(cluster.getString(PROP_CLUSTER_TYPE))
    if (clusterType == null) {
      Log.w(TAG, "Invalid cluster type")
      return
    }
    if (EngageConfiguration.debug) {
      Log.d(TAG, "Publishing cluster $clusterType - ${clusterJson.toString(2)}")
    }
    when (clusterType) {
      ClusterType.Continuation -> Publisher.publishContinuationClusters(reactContext, clusterJson)
      ClusterType.Recommendation -> Publisher.publishRecommendationClusters(reactContext, clusterJson)
      ClusterType.Featured -> Publisher.publishFeaturedClusters(reactContext, clusterJson)
      ClusterType.Subscription -> Publisher.publishSubscriptionClusters(reactContext, clusterJson)
    }
  }

  @ReactMethod
  fun publishSignInEntity(signIn: ReadableMap) {
    val signInJson = JSONObject(signIn.toHashMap())
    if (EngageConfiguration.debug) {
      Log.d(TAG, "Setting SignIn - ${signInJson.toString(2)}")
    }
    Publisher.publishUserAccount(reactContext, signInJson)
  }

  @ReactMethod
  fun unpublishSignInEntity() {
    if (EngageConfiguration.debug) {
      Log.d(TAG, "Removing SignIn")
    }
    Publisher.publishUserAccount(reactContext, JSONObject())
  }

  @ReactMethod
  fun unpublishCluster(clusterType: String) {
    if (EngageConfiguration.debug) {
      Log.d(TAG, "Unpublishing cluster $clusterType")
    }
    when (clusterType) {
      VAL_CONTINUATION -> Publisher.unpublishContinuationClusters(reactContext)
      VAL_FEATURED -> Publisher.unpublishFeaturedClusters(reactContext)
      VAL_RECOMMENDATION -> Publisher.unpublishRecommendationClusters(reactContext)
      else -> Log.w(TAG, "Invalid cluster type: $clusterType")
    }
  }

  @ReactMethod
  fun unpublishAllClusters() {
    unpublishCluster(VAL_CONTINUATION)
    unpublishCluster(VAL_FEATURED)
    unpublishCluster(VAL_RECOMMENDATION)
  }

  @ReactMethod
  fun addListener(eventName: String?) {
  }

  @ReactMethod
  fun removeListeners(count: Int?) {
  }

  @ReactMethod
  fun destroy() {
    // Nothing to do yet
  }

  private fun dispatchEvent(event: String, payload: ReadableMap) {
    reactContext.getJSModule(ReactContext.RCTDeviceEventEmitter::class.java).emit(
      event,
      payload
    )
  }
}
