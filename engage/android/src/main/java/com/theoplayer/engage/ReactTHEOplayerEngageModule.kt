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

@Suppress("unused")
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
    val clusterJson = JSONObject(cluster.toHashMap() as Map<*, *>)
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
    }
  }

  @ReactMethod
  fun publishSignInEntity(signIn: ReadableMap) {
    val signInJson = JSONObject(signIn.toHashMap() as Map<*, *>)
    if (EngageConfiguration.debug) {
      Log.d(TAG, "Setting SignIn - ${signInJson.toString(2)}")
    }
    Publisher.publishUserAccount(reactContext, signInJson)
  }

  @ReactMethod
  fun deleteSignInEntity() {
    if (EngageConfiguration.debug) {
      Log.d(TAG, "Removing SignIn")
    }
    Publisher.publishUserAccount(reactContext, JSONObject())
  }

  @ReactMethod
  fun publishSubscription(accountInfo: ReadableMap, subscription: ReadableMap?) {
    val accountInfoJson = JSONObject(accountInfo.toHashMap() as Map<*, *>)
    val subscriptionJson = subscription?.let { JSONObject(it.toHashMap() as Map<*, *>) }
    if (EngageConfiguration.debug) {
      Log.d(TAG, "Publishing Subscription - ${accountInfoJson.toString(2)} - ${subscriptionJson?.toString(2)}")
    }
    Publisher.publishSubscription(reactContext, accountInfoJson, subscriptionJson)
  }

  @Suppress("UNUSED_PARAMETER")
  @ReactMethod
  fun addListener(eventName: String?) {
  }

  @Suppress("UNUSED_PARAMETER")
  @ReactMethod
  fun removeListeners(count: Int?) {
  }

  @ReactMethod
  fun destroy() {
    // Nothing to do yet
  }

  @Suppress("SameParameterValue")
  private fun dispatchEvent(event: String, payload: ReadableMap) {
    reactContext.getJSModule(ReactContext.RCTDeviceEventEmitter::class.java).emit(
      event,
      payload
    )
  }
}
