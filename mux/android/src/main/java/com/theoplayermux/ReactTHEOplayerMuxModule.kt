package com.theoplayermux

import android.util.Log
import com.facebook.react.bridge.*
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.util.ViewResolver
import com.mux.stats.sdk.core.model.CustomerPlayerData
import com.mux.stats.sdk.core.model.CustomerVideoData
import com.mux.stats.sdk.core.model.CustomerViewData
import com.mux.stats.sdk.core.model.CustomData
import com.mux.stats.sdk.core.model.CustomerData
import com.mux.stats.sdk.muxstats.theoplayer.MuxStatsSDKTHEOPlayer

private const val TAG = "MuxModule"
private const val PROP_DATA = "data"
private const val PROP_DEBUG = "debug"
private const val PROP_AUTO_ERROR_TRACKING = "automaticErrorTracking"
private const val PROP_ENVIRONMENT_KEY = "env_key"

private const val PROP_PLAYER_NAME = "player_name"
private const val PROP_PLAYER_VERSION = "player_version"
private const val PROP_PLAYER_INIT_TIME = "player_init_time"
private const val PROP_AD_CONFIG_VARIANT = "ad_config_variant"
private const val PROP_EXPERIMENT_NAME = "experiment_name"
private const val PROP_PAGE_TYPE = "page_type"
private const val PROP_PROPERTY_KEY = "property_key"
private const val PROP_SUBPROPERTY_ID = "sub_property_id"
private const val PROP_VIEWER_USER_ID = "viewer_user_id"

private const val PROP_VIDEO_ID = "video_id"
private const val PROP_VIDEO_CDN = "video_cdn"
private const val PROP_VIDEO_DURATION = "video_duration"
private const val PROP_VIDEO_IS_LIVE = "video_is_live"
private const val PROP_VIDEO_EXPERIMENTS = "video_experiments"
private const val PROP_VIDEO_CONTENT_TYPE = "video_content_type"
private const val PROP_VIDEO_ENCODING_VARIANT = "video_encoding_variant"
private const val PROP_VIDEO_LANGUAGE_CODE = "video_language_code"
private const val PROP_VIDEO_PRODUCER = "video_producer"
private const val PROP_VIDEO_SERIES = "video_series"
private const val PROP_VIDEO_SOURCE_URL = "video_source_url"
private const val PROP_VIDEO_STREAM_TYPE = "video_stream_type"
private const val PROP_VIDEO_TITLE = "video_title"
private const val PROP_VIDEO_VARIANT_ID = "video_variant_id"
private const val PROP_VIDEO_VARIANT_NAME = "video_variant_name"

private const val PROP_VIEW_SESSION_ID = "view_session_id"

private const val PROP_CUSTOM_DATA1 = "custom_1"
private const val PROP_CUSTOM_DATA2 = "custom_2"
private const val PROP_CUSTOM_DATA3 = "custom_3"
private const val PROP_CUSTOM_DATA4 = "custom_4"
private const val PROP_CUSTOM_DATA5 = "custom_5"

class ReactTHEOplayerMuxModule(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver

  private var muxConnectors: HashMap<Int, MuxStatsSDKTHEOPlayer> = HashMap()

  init {
    viewResolver = ViewResolver(context)
  }

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun initialize(tag: Int, muxOptions: ReadableMap) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.playerContext?.playerView?.let { playerView ->
        val data = muxOptions.getMap(PROP_DATA)
        if (data == null) {
          Log.e(TAG, "No data property in muxOptions provided")
        } else if (!data.hasKey(PROP_ENVIRONMENT_KEY)) {
          Log.e(TAG, "No $PROP_ENVIRONMENT_KEY provided")
        } else {
          val muxStatsTHEOplayer = MuxStatsSDKTHEOPlayer(
            reactApplicationContext,
            playerView,
            "ReactNativeTHEOplayer",
            buildCustomerData(data)
          )

          // Optionally toggle debug info
          if (muxOptions.hasKey(PROP_DEBUG)) {
            muxStatsTHEOplayer.enableMuxCoreDebug(muxOptions.getBoolean(PROP_DEBUG), true)
          }

          // Optionally toggle automaticErrorTracking
          if (muxOptions.hasKey(PROP_AUTO_ERROR_TRACKING)) {
            muxStatsTHEOplayer.setAutomaticErrorTracking(muxOptions.getBoolean(PROP_AUTO_ERROR_TRACKING))
          }

          muxConnectors[tag] = muxStatsTHEOplayer
        }
      }
    }
  }

  @ReactMethod
  fun changeProgram(tag: Int, data: ReadableMap) {
    muxConnectors[tag]?.updateCustomerData(
      buildPlayerData(data),
      buildVideoData(data),
      buildViewData(data)
    )
  }

  @ReactMethod
  fun enableDebug(tag: Int, debug: Boolean) {
    muxConnectors[tag]?.enableMuxCoreDebug(debug, true)
  }

  private fun buildCustomerData(data: ReadableMap): CustomerData {
    return CustomerData().apply {
      customerPlayerData = buildPlayerData(data)
      customerVideoData = buildVideoData(data)
      customerViewData = buildViewData(data)
      customData = buildCustomData(data)
    }
  }

  private fun buildPlayerData(data: ReadableMap): CustomerPlayerData {
    return CustomerPlayerData().apply {
      environmentKey = data.getString(PROP_ENVIRONMENT_KEY)
      playerName = data.getString(PROP_PLAYER_NAME)
      playerVersion = data.getString(PROP_PLAYER_VERSION)
      if (data.hasKey(PROP_PLAYER_INIT_TIME)) {
        playerInitTime = data.getDouble(PROP_PLAYER_INIT_TIME).toLong()
      }
      adConfigVariant = data.getString(PROP_AD_CONFIG_VARIANT)
      experimentName = data.getString(PROP_EXPERIMENT_NAME)
      pageType = data.getString(PROP_PAGE_TYPE)
      propertyKey = data.getString(PROP_PROPERTY_KEY)
      subPropertyId = data.getString(PROP_SUBPROPERTY_ID)
      viewerUserId = data.getString(PROP_VIEWER_USER_ID)
    }
  }

  private fun buildVideoData(data: ReadableMap): CustomerVideoData {
    return CustomerVideoData().apply {
      videoId = data.getString(PROP_VIDEO_ID)
      videoCdn = data.getString(PROP_VIDEO_CDN)
      if (data.hasKey(PROP_VIDEO_DURATION)) {
        videoDuration = data.getDouble(PROP_VIDEO_DURATION).toLong()
      }
      if (data.hasKey(PROP_VIDEO_IS_LIVE)) {
        videoIsLive = data.getBoolean(PROP_VIDEO_IS_LIVE)
      }
      videoExperiments = data.getString(PROP_VIDEO_EXPERIMENTS)
      videoContentType = data.getString(PROP_VIDEO_CONTENT_TYPE)
      videoEncodingVariant = data.getString(PROP_VIDEO_ENCODING_VARIANT)
      videoLanguageCode = data.getString(PROP_VIDEO_LANGUAGE_CODE)
      videoProducer = data.getString(PROP_VIDEO_PRODUCER)
      videoSeries = data.getString(PROP_VIDEO_SERIES)
      videoSourceUrl = data.getString(PROP_VIDEO_SOURCE_URL)
      videoStreamType = data.getString(PROP_VIDEO_STREAM_TYPE)
      videoTitle = data.getString(PROP_VIDEO_TITLE)
      videoVariantId = data.getString(PROP_VIDEO_VARIANT_ID)
      videoVariantName = data.getString(PROP_VIDEO_VARIANT_NAME)
    }
  }

  private fun buildViewData(data: ReadableMap): CustomerViewData {
    return CustomerViewData().apply {
      viewSessionId = data.getString(PROP_VIEW_SESSION_ID)
    }
  }

  private fun buildCustomData(data: ReadableMap): CustomData {
    return CustomData().apply {
      this.customData1 = data.getString(PROP_CUSTOM_DATA1)
      this.customData2 = data.getString(PROP_CUSTOM_DATA2)
      this.customData3 = data.getString(PROP_CUSTOM_DATA3)
      this.customData4 = data.getString(PROP_CUSTOM_DATA4)
      this.customData5 = data.getString(PROP_CUSTOM_DATA5)
    }
  }

  @ReactMethod
  fun destroy(tag: Int) {
    muxConnectors[tag]?.release()
    muxConnectors.remove(tag)
  }
}
