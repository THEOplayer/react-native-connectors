package com.theoplayeragama

import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.android.api.network.http.HTTPInterceptor
import com.theoplayer.android.api.network.http.HTTPResponse
import com.theoplayer.android.api.network.http.RequestMediaType
import com.theoplayer.android.api.network.http.RequestType
import com.theoplayer.util.ViewResolver

private const val TAG = "AgamaModule"
private const val PROP_DROPPED_VIDEO_FRAMES = "droppedVideoFrames"
private const val PROP_TOTAL_VIDEO_FRAMES = "totalVideoFrames"
private const val PROP_DEBUG = "debug"
private const val PROP_STATUS = "status"
private const val PROP_URI = "uri"
private const val PROP_MEDIA_TYPE = "mediaType"
private const val PROP_TOTAL_BYTES_LOADED = "totalBytesLoaded"
private const val EVENT_MANIFEST_RESPONSE = "onManifestResponse"
private const val EVENT_SEGMENT_RESPONSE = "onSegmentResponse"

open class AgamaInterceptor : HTTPInterceptor

class ReactTHEOplayerAgamaModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private val viewResolver: ViewResolver = ViewResolver(reactContext)
  private var interceptor: HTTPInterceptor? = null
  private var debug: Boolean = false

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun initialize(tag: Int, options: ReadableMap) {
    debug = if (options.hasKey(PROP_DEBUG)) options.getBoolean(PROP_DEBUG) else false

    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?.let { player ->
        interceptor = object : AgamaInterceptor() {
          override suspend fun onResponse(response: HTTPResponse) {
            if (response.request.type == RequestType.SEGMENT) {
              onSegmentResponse(response)
            } else if (response.request.type == RequestType.MANIFEST) {
              onManifestResponse(response)
            }
          }
        }.also {
          player.network.addHTTPInterceptor(it)
        }
      }
    }
  }

  @ReactMethod
  fun bandwidth(tag: Int, result: Promise) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      val bandwidthBitsPerSecond = view?.player?.metrics?.currentBandwidthEstimate
      result.resolve(bandwidthBitsPerSecond ?: 0.0)
    }
  }

  @ReactMethod
  fun videoFrames(tag: Int, result: Promise) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      val metrics = view?.player?.metrics
      result.resolve(Arguments.createMap().apply {
        putDouble(PROP_DROPPED_VIDEO_FRAMES, metrics?.droppedVideoFrames?.toDouble() ?: 0.0)
        putDouble(PROP_TOTAL_VIDEO_FRAMES, metrics?.totalVideoFrames?.toDouble() ?: 0.0)
      })
    }
  }

  fun onManifestResponse(response: HTTPResponse) {
    if (debug) {
      Log.d(TAG, "onManifestResponse - ${response.url}")
    }
    sendEvent(reactContext, EVENT_MANIFEST_RESPONSE, Arguments.createMap().apply {
      putString(PROP_URI, response.url.toString())
    })
  }

  fun onSegmentResponse(response: HTTPResponse) {
    val mediaType = mediaTypeToString(response.request.mediaType)
    val contentLength = response.body.size.toDouble()
    if (debug) {
      Log.d(
        TAG, "onSegmentResponse - " +
          "url(${response.url}) " +
          "mediaType($mediaType) " +
          "status(${response.status}) " +
          "bytes(${contentLength.toLong()}) "
      )
    }
    sendEvent(reactContext, EVENT_SEGMENT_RESPONSE, Arguments.createMap().apply {
      putInt(PROP_STATUS, response.status)
      putString(PROP_MEDIA_TYPE, mediaType)
      putDouble(PROP_TOTAL_BYTES_LOADED, contentLength)
    })
  }

  private fun mediaTypeToString(mediaType: RequestMediaType): String {
    return when (mediaType) {
      RequestMediaType.AUDIO -> "audio"
      else -> "video"
    }
  }

  private fun sendEvent(reactContext: ReactContext, eventName: String, params: WritableMap?) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
  }

  @ReactMethod
  fun addListener(eventName: String?) {
  }

  @ReactMethod
  fun removeListeners(count: Int?) {
  }

  @ReactMethod
  fun destroy(tag: Int) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      interceptor?.let {
        view?.player?.network?.removeHTTPInterceptor(it)
      }
    }
  }
}
