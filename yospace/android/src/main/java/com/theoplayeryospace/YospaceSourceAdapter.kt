package com.theoplayeryospace

import com.theoplayer.BuildConfig
import com.theoplayer.android.api.error.ErrorCode
import com.theoplayer.android.api.error.THEOplayerException
import com.theoplayer.android.api.source.TypedSource
import com.theoplayer.android.connector.yospace.YospaceSsaiDescription
import com.theoplayer.android.connector.yospace.YospaceStreamType
import org.json.JSONObject
import com.yospace.admanagement.Session
import java.util.UUID

private const val PROP_STREAM_TYPE = "streamType"
private const val PROP_SESSION_PROPERTIES = "sessionProperties"
private const val PROP_PREFETCHRESOURCES = "prefetchResources"
private const val PROP_FIREHISTORICALBEACONS = "fireHistoricalBeacons"
private const val PROP_APPLYENCRYPTEDTRACKING = "applyEncryptedTracking"
private const val PROP_CONSECUTIVEBREAKTOLERANCE = "consecutiveBreakTolerance"
private const val PROP_REQUESTTIMEOUT = "requestTimeout"
private const val PROP_RESOURCETIMEOUT = "resourceTimeout"
private const val PROP_USERAGENT = "userAgent"
private const val PROP_PROXYUSERAGENT = "proxyUserAgent"
private const val PROP_KEEPPROXYALIVE = "keepProxyAlive"
private const val PROP_EXCLUDEFROMSUPPRESSION = "excludeFromSuppression"
private const val PROP_TOKEN = "token"
private const val PROP_CUSTOMHTTPHEADERS = "customHttpHeaders"

private const val ERROR_YOSPACE_INVALID_SESSION_PROPERTIES =
  "Invalid session properties in source description."

@Throws(THEOplayerException::class)
fun yospaceBuilderFromJson(builder: TypedSource.Builder, json: JSONObject): TypedSource.Builder {
  return builder.ssai(
    YospaceSsaiDescription(
      streamType = streamTypeFromString(json.optString(PROP_STREAM_TYPE)),
      sessionProperties = sessionPropertiesFromJson(json.optJSONObject(PROP_SESSION_PROPERTIES))
    )
  )
}

private fun sessionPropertiesFromJson(json: JSONObject?): Session.SessionProperties {
  try {
    return Session.SessionProperties().apply {
      if (json?.has(PROP_PREFETCHRESOURCES) == true) this.prefetchResources =
        json.getBoolean(PROP_PREFETCHRESOURCES)
      if (json?.has(PROP_FIREHISTORICALBEACONS) == true) this.fireHistoricalBeacons =
        json.getBoolean(PROP_FIREHISTORICALBEACONS)
      if (json?.has(PROP_APPLYENCRYPTEDTRACKING) == true) this.applyEncryptedTracking =
        json.getBoolean(PROP_APPLYENCRYPTEDTRACKING)
      if (json?.has(PROP_CONSECUTIVEBREAKTOLERANCE) == true) this.consecutiveBreakTolerance =
        json.getInt(PROP_CONSECUTIVEBREAKTOLERANCE)
      if (json?.has(PROP_REQUESTTIMEOUT) == true) this.requestTimeout =
        json.getInt(PROP_REQUESTTIMEOUT)
      if (json?.has(PROP_RESOURCETIMEOUT) == true) this.resourceTimeout =
        json.getInt(PROP_RESOURCETIMEOUT)
      if (json?.has(PROP_USERAGENT) == true)
        this.userAgent = json.getString(PROP_USERAGENT)
      if (json?.has(PROP_PROXYUSERAGENT) == true) this.proxyUserAgent =
        json.getString(PROP_PROXYUSERAGENT)
      if (json?.has(PROP_KEEPPROXYALIVE) == true) this.keepProxyAlive =
        json.getBoolean(PROP_KEEPPROXYALIVE)
      if (json?.has(PROP_EXCLUDEFROMSUPPRESSION) == true) this.excludeFromSuppression(
        json.getInt(PROP_EXCLUDEFROMSUPPRESSION)
      )
      if (json?.has(PROP_TOKEN) == true) this.token = UUID.fromString(json.getString(PROP_TOKEN))
      if (json?.has(PROP_CUSTOMHTTPHEADERS) == true) {
        this.customHttpHeaders = mutableMapOf<String, String>().also { map ->
          val headers = json.getJSONObject(PROP_CUSTOMHTTPHEADERS)
          headers.keys().forEach { key ->
            map[key] = headers.getString(key)
          }
        }
      }
    }
  } catch (e: Exception) {
    throw THEOplayerException(
      ErrorCode.SOURCE_INVALID, "$ERROR_YOSPACE_INVALID_SESSION_PROPERTIES: ${e.message}"
    )
  }
}

@Throws(THEOplayerException::class)
private fun streamTypeFromString(streamType: String): YospaceStreamType {
  return when (streamType.lowercase()) {
    "live" -> YospaceStreamType.LIVE
    "livepause" -> YospaceStreamType.LIVEPAUSE
    "nonlinear" -> YospaceStreamType.NONLINEAR
    "vod" -> YospaceStreamType.VOD
    else -> {
      // Default
      YospaceStreamType.LIVE
    }
  }
}
