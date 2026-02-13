package com.theoplayer.reactnative.bitmovin

import android.util.Log
import com.bitmovin.analytics.api.AnalyticsConfig
import com.bitmovin.analytics.api.CustomData
import com.bitmovin.analytics.api.DefaultMetadata
import com.bitmovin.analytics.api.LogLevel
import com.bitmovin.analytics.api.RetryPolicy
import com.bitmovin.analytics.api.SourceMetadata
import com.facebook.react.bridge.ReadableMap
import org.json.JSONObject

private const val PROP_LICENSE_KEY = "licenseKey"
private const val PROP_AD_TRACKING_DISABLED = "adTrackingDisabled"
private const val PROP_RANDOMIZE_USER_ID = "randomizeUserId"
private const val PROP_RETRY_POLICY = "retryPolicy"
private const val PROP_BACKEND_URL = "backendUrl"
private const val PROP_LOG_LEVEL = "logLevel"
private const val PROP_SSAI_ENGAGEMENT_TRACKING_ENABLED = "ssaiEngagementTrackingEnabled"
private const val PROP_TITLE = "title"
private const val PROP_VIDEO_ID = "videoId"
private const val PROP_CDN_PROVIDER = "cdnProvider"
private const val PROP_PATH = "path"
private const val PROP_IS_LIVE = "isLive"
private const val PROP_CUSTOM_DATA = "customData"
private const val PROP_CUSTOM_USER_ID = "customUserId"

object BitmovinAdapter {

  private const val TAG = "BitmovinAdapter"

  /**
   * Create an AnalyticsConfig object.
   *
   * https://developer.bitmovin.com/playback/docs/configuration-analytics
   */
  fun parseConfig(config: ReadableMap): AnalyticsConfig {
    return AnalyticsConfig.Builder(licenseKey = config.getString(PROP_LICENSE_KEY) ?: "")
      .apply {
        if (config.hasKey(PROP_AD_TRACKING_DISABLED)) {
          setAdTrackingDisabled(config.getBoolean(PROP_AD_TRACKING_DISABLED))
        }
        if (config.hasKey(PROP_RANDOMIZE_USER_ID)) {
          setRandomizeUserId(config.getBoolean(PROP_RANDOMIZE_USER_ID))
        }
        when (config.getString(PROP_RETRY_POLICY)) {
          "SHORT_TERM" -> setRetryPolicy(RetryPolicy.SHORT_TERM)
          "LONG_TERM" -> setRetryPolicy(RetryPolicy.LONG_TERM)
          else -> setRetryPolicy(RetryPolicy.NO_RETRY)
        }
        if (config.hasKey(PROP_BACKEND_URL)) {
          setBackendUrl(config.getString(PROP_BACKEND_URL) ?: "")
        }
        when (config.getString(PROP_LOG_LEVEL)) {
          "DEBUG" -> setLogLevel(LogLevel.DEBUG)
          else -> setLogLevel(LogLevel.ERROR)
        }
        if (config.hasKey(PROP_SSAI_ENGAGEMENT_TRACKING_ENABLED)) {
          setSsaiEngagementTrackingEnabled(config.getBoolean(PROP_SSAI_ENGAGEMENT_TRACKING_ENABLED))
        }
      }
      .build()
  }

  /**
   * Create a SourceMetadata object.
   *
   * https://developer.bitmovin.com/playback/docs/configuration-analytics
   */
  fun parseSourceMetadata(metadata: ReadableMap): SourceMetadata {
    return SourceMetadata.Builder()
      .apply {
        if (metadata.hasKey(PROP_TITLE)) {
          setTitle(metadata.getString(PROP_TITLE) ?: "")
        }
        if (metadata.hasKey(PROP_VIDEO_ID)) {
          setVideoId(metadata.getString(PROP_VIDEO_ID) ?: "")
        }
        if (metadata.hasKey(PROP_CDN_PROVIDER)) {
          setCdnProvider(metadata.getString(PROP_CDN_PROVIDER) ?: "")
        }
        if (metadata.hasKey(PROP_PATH)) {
          setPath(metadata.getString(PROP_PATH) ?: "")
        }
        if (metadata.hasKey(PROP_IS_LIVE)) {
          setIsLive(metadata.getBoolean(PROP_IS_LIVE))
        }
        if (metadata.hasKey(PROP_CUSTOM_DATA)) {
          setCustomData(parseCustomData(metadata.getMap(PROP_CUSTOM_DATA)))
        }
      }
      .build()
  }

  /**
   * Create a DefaultMetadata object.
   * DefaultMetadata can be set during player creation, and this contains source independent data.
   *
   * https://developer.bitmovin.com/playback/docs/setup-analytics-android-v3
   */
  fun parseDefaultMetadata(metadata: ReadableMap?): DefaultMetadata? {
    if (metadata == null) return null
    return DefaultMetadata.Builder()
      .apply {
        if (metadata.hasKey(PROP_CDN_PROVIDER)) {
          setCdnProvider(metadata.getString(PROP_CDN_PROVIDER) ?: "")
        }
        if (metadata.hasKey(PROP_CUSTOM_USER_ID)) {
          setCustomUserId(metadata.getString(PROP_CUSTOM_USER_ID) ?: "")
        }
        if (metadata.hasKey(PROP_CUSTOM_DATA)) {
          setCustomData(parseCustomData(metadata.getMap(PROP_CUSTOM_DATA)))
        }
      }
      .build()
  }

  /**
   * Create a CustomData object.
   *
   * https://developer.bitmovin.com/playback/docs/configuration-analytics
   */
  fun parseCustomData(data: ReadableMap?, buildUpon: CustomData.Builder? = null): CustomData {
    return buildCustomData({ key -> data?.getString(key) }, buildUpon)
  }

  /**
   * Create a CustomData object.
   *
   * https://developer.bitmovin.com/playback/docs/configuration-analytics
   */
  fun parseCustomDataFromJSON(
    json: JSONObject?,
    buildUpon: CustomData.Builder? = null
  ): CustomData {
    return buildCustomData({ key -> json?.opt(key) }, buildUpon)
  }

  fun buildCustomData(
    getValue: (String) -> Any?,
    buildUpon: CustomData.Builder? = null
  ): CustomData {
    return (buildUpon ?: CustomData.Builder()).apply {
      for (i in 1..50) {
        val method = CustomData.Builder::class.java.getMethod("setCustomData$i", String::class.java)
        val value = getValue("${PROP_CUSTOM_DATA}$i")
        if (value is String) {
          method.invoke(this, value)
        } else if (value != null) {
          Log.w(TAG, "CustomData${i} is not a String: $value")
        }
      }
    }.build()
  }
}
