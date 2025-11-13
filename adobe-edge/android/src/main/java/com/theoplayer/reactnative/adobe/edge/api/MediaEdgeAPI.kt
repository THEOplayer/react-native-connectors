package com.theoplayer.reactnative.adobe.edge.api

import com.theoplayer.reactnative.adobe.edge.Logger
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.HttpUrl
import okhttp3.HttpUrl.Companion.toHttpUrl
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import java.io.IOException
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone
import com.google.gson.Gson
import com.google.gson.JsonArray
import com.google.gson.JsonObject
import org.json.JSONObject

data class QueuedEvent(
  val path: String,
  val mediaDetails: Map<String, Any?>
)

class MediaEdgeAPI(
  private val baseUrl: String,
  private val configId: String,
  private val userAgent: String,
  private var debugSessionId: String? = null
) {
  private val client = OkHttpClient()
  private val gson = Gson()
  var sessionId: String? = null
    private set

  var hasSessionFailed = false
    private set

  private val eventQueue = mutableListOf<QueuedEvent>()

  private val scope = CoroutineScope(Dispatchers.Main)

  fun setDebugSessionId(id: String?) {
    debugSessionId = id
  }

  fun hasSessionStarted(): Boolean = sessionId != null

  fun reset() {
    sessionId = null
    hasSessionFailed = false
    eventQueue.clear()
  }

  fun play(playhead: Double?, qoeDataDetails: AdobeQoeDataDetails? = null) {
    maybeQueueEvent("/play", mapOf("playhead" to sanitisePlayhead(playhead), "qoeDataDetails" to qoeDataDetails))
  }

  fun pause(playhead: Double?, qoeDataDetails: AdobeQoeDataDetails? = null) {
    maybeQueueEvent(
      "/pauseStart",
      mapOf("playhead" to sanitisePlayhead(playhead), "qoeDataDetails" to qoeDataDetails)
    )
  }

  fun error(
    playhead: Double?,
    errorDetails: AdobeErrorDetails,
    qoeDataDetails: AdobeQoeDataDetails? = null
  ) {
    maybeQueueEvent(
      "/error",
      mapOf(
        "playhead" to sanitisePlayhead(playhead),
        "qoeDataDetails" to qoeDataDetails,
        "errorDetails" to errorDetails
      )
    )
  }

  fun ping(playhead: Double?, qoeDataDetails: AdobeQoeDataDetails? = null) {
    scope.launch {
      sessionId?.let { sessionId ->
        postEvent(
          sessionId,
          "/ping",
          mapOf("playhead" to sanitisePlayhead(playhead), "qoeDataDetails" to qoeDataDetails)
        )
      }
    }
  }

  fun bufferStart(playhead: Double?, qoeDataDetails: AdobeQoeDataDetails? = null) {
    maybeQueueEvent(
      "/bufferStart",
      mapOf("playhead" to sanitisePlayhead(playhead), "qoeDataDetails" to qoeDataDetails)
    )
  }

  fun sessionComplete(playhead: Double?, qoeDataDetails: AdobeQoeDataDetails? = null) {
    maybeQueueEvent(
      "/sessionComplete",
      mapOf("playhead" to sanitisePlayhead(playhead), "qoeDataDetails" to qoeDataDetails)
    )
  }

  fun sessionEnd(playhead: Double?, qoeDataDetails: AdobeQoeDataDetails? = null) {
    maybeQueueEvent(
      "/sessionEnd",
      mapOf("playhead" to sanitisePlayhead(playhead), "qoeDataDetails" to qoeDataDetails)
    )
    sessionId = null
  }

  fun statesUpdate(
    playhead: Double?,
    statesStart: List<AdobePlayerStateData>? = null,
    statesEnd: List<AdobePlayerStateData>? = null,
    qoeDataDetails: AdobeQoeDataDetails? = null
  ) {
    maybeQueueEvent(
      "/statesUpdate",
      mapOf(
        "playhead" to sanitisePlayhead(playhead),
        "statesStart" to statesStart,
        "statesEnd" to statesEnd,
        "qoeDataDetails" to qoeDataDetails
      )
    )
  }

  fun bitrateChange(playhead: Double?, qoeDataDetails: AdobeQoeDataDetails) {
    maybeQueueEvent(
      "/bitrateChange",
      mapOf("playhead" to sanitisePlayhead(playhead), "qoeDataDetails" to qoeDataDetails)
    )
  }

  fun chapterSkip(playhead: Double?, qoeDataDetails: AdobeQoeDataDetails? = null) {
    maybeQueueEvent(
      "/chapterSkip",
      mapOf("playhead" to sanitisePlayhead(playhead), "qoeDataDetails" to qoeDataDetails)
    )
  }

  fun chapterStart(
    playhead: Double?,
    chapterDetails: AdobeChapterDetails,
    customMetadata: List<AdobeCustomMetadataDetails>? = null,
    qoeDataDetails: AdobeQoeDataDetails? = null
  ) {
    maybeQueueEvent(
      "/chapterStart",
      mapOf(
        "playhead" to sanitisePlayhead(playhead),
        "chapterDetails" to chapterDetails,
        "customMetadata" to customMetadata,
        "qoeDataDetails" to qoeDataDetails
      )
    )
  }

  fun chapterComplete(playhead: Double?, qoeDataDetails: AdobeQoeDataDetails? = null) {
    maybeQueueEvent(
      "/chapterComplete",
      mapOf("playhead" to sanitisePlayhead(playhead), "qoeDataDetails" to qoeDataDetails)
    )
  }

  fun adBreakStart(
    playhead: Double,
    advertisingPodDetails: AdobeAdvertisingPodDetails,
    qoeDataDetails: AdobeQoeDataDetails? = null
  ) {
    maybeQueueEvent(
      "/adBreakStart",
      mapOf(
        "playhead" to sanitisePlayhead(playhead),
        "advertisingPodDetails" to advertisingPodDetails,
        "qoeDataDetails" to qoeDataDetails
      )
    )
  }

  fun adBreakComplete(playhead: Double?, qoeDataDetails: AdobeQoeDataDetails? = null) {
    maybeQueueEvent(
      "/adBreakComplete",
      mapOf("playhead" to sanitisePlayhead(playhead), "qoeDataDetails" to qoeDataDetails)
    )
  }

  fun adStart(
    playhead: Double,
    advertisingDetails: AdobeAdvertisingDetails,
    customMetadata: List<AdobeCustomMetadataDetails>? = null,
    qoeDataDetails: AdobeQoeDataDetails? = null
  ) {
    maybeQueueEvent(
      "/adStart",
      mapOf(
        "playhead" to sanitisePlayhead(playhead),
        "advertisingDetails" to advertisingDetails,
        "customMetadata" to customMetadata,
        "qoeDataDetails" to qoeDataDetails
      )
    )
  }

  fun adSkip(playhead: Double?, qoeDataDetails: AdobeQoeDataDetails? = null) {
    maybeQueueEvent("/adSkip", mapOf("playhead" to sanitisePlayhead(playhead), "qoeDataDetails" to qoeDataDetails))
  }

  fun adComplete(playhead: Double?, qoeDataDetails: AdobeQoeDataDetails? = null) {
    maybeQueueEvent(
      "/adComplete",
      mapOf("playhead" to sanitisePlayhead(playhead), "qoeDataDetails" to qoeDataDetails)
    )
  }

  private fun createUrlWithClientParams(baseUrl: String): HttpUrl {
    return baseUrl.toHttpUrl().newBuilder().apply {
      addQueryParameter("configId", configId)
      debugSessionId?.let { addQueryParameter("debugSessionId", it) }
    }.build()
  }

  private suspend fun sendRequest(
    url: String,
    body: String
  ): Response? = withContext(Dispatchers.IO) {
    return@withContext try {
      val request = Request.Builder()
        .url(createUrlWithClientParams(url))
        .post(body.toRequestBody("application/json".toMediaType()))
        .header("User-Agent", userAgent)
        .build()

      val response = client.newCall(request).execute()
      if (!response.isSuccessful) {
        throw IOException("Unexpected code $response")
      } else
        response
    } catch (e: Exception) {
      throw e
    }
  }

  suspend fun startSession(
    sessionDetails: AdobeSessionDetails,
    customMetadata: List<AdobeCustomMetadataDetails>? = null,
    qoeDataDetails: AdobeQoeDataDetails? = null
  ) {
    try {
      val body = JsonObject().apply {
        add("events", JsonArray().apply {
          add(JsonObject().apply {
            add("xdm", JsonObject().apply {
              addProperty("eventType", EventType.SESSION_START.value)
              addProperty("timestamp", Date().toISOString())
              add("mediaCollection", JsonObject().apply {
                addProperty("playhead", 0)
                add("sessionDetails", gson.toJsonTree(sessionDetails))
                qoeDataDetails?.let {
                  add("qoeDataDetails", gson.toJsonTree(qoeDataDetails))
                }
                customMetadata?.let {
                  add("customMetadata", JsonArray().apply {
                    it.forEach { metadata ->
                      add(gson.toJsonTree(metadata))
                    }
                  })
                }
              })
            })
          })
        })
      }

      val response = sendRequest("$baseUrl/sessionStart", body.toString())

      val responseBody = response?.body?.string() ?: throw IOException("Empty response body")
      val jsonResponse = JSONObject(responseBody)
      val error = jsonResponse.optJSONObject("error") ?: jsonResponse.optJSONObject("data")
        ?.optJSONArray("errors")
      if (error != null) {
        throw Exception(error.toString())
      }

      val handle = jsonResponse.optJSONArray("handle")
      sessionId = handle?.let { array ->
        (0 until array.length()).firstNotNullOfOrNull { i ->
          array.optJSONObject(i)?.takeIf { it.optString("type") == "media-analytics:new-session" }
            ?.optJSONArray("payload")?.optJSONObject(0)?.optString("sessionId")
        }
      }

      if (eventQueue.isNotEmpty()) {
        sessionId?.let { sessionId ->
          eventQueue.forEach { event -> postEvent(sessionId, event.path, event.mediaDetails) }
        }
        eventQueue.clear()
      }
    } catch (e: Exception) {
      Logger.error("Failed to start session. ${e.message}")
      hasSessionFailed = true
    }
  }

  private fun maybeQueueEvent(path: String, mediaDetails: Map<String, Any?>) {
    if (hasSessionFailed) return
    sessionId?.let { sessionId ->
      scope.launch {
        postEvent(sessionId, path, mediaDetails)
      }
    } ?: eventQueue.add(QueuedEvent(path, mediaDetails))
  }

  private suspend fun postEvent(sessionId: String, path: String, mediaDetails: Map<String, Any?>) {
    try {
      val body = JsonObject().apply {
        add("events", JsonArray().apply {
          add(JsonObject().apply {
            add("xdm", JsonObject().apply {
              addProperty("eventType", pathToEventTypeMap[path]?.value)
              addProperty("timestamp", Date().toISOString())
              add("mediaCollection", JsonObject().apply {
                mediaDetails.forEach { (key, value) ->
                  add(key, gson.toJsonTree(value))
                }
                addProperty("sessionID", sessionId)
              })
            })
          })
        })
      }.toString()

      Logger.debug("postEvent - $path $body")

      val response = sendRequest("$baseUrl$path", body)
      val responseBody = response?.body?.string() ?: throw IOException("Empty response body")

      // Optionally parse errors
      if (responseBody.isNotEmpty()) {
        val jsonResponse = JSONObject(responseBody)
        val error = jsonResponse.optJSONObject("error") ?: jsonResponse.optJSONObject("data")
          ?.optJSONArray("errors")
        if (error != null) {
          Logger.error("Failed to send event. $error")
        }
      }
    } catch (e: Exception) {
      Logger.error("Failed to send event. ${e.message}")
    }
  }
}

fun Date.toISOString(): String {
  return SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault()).apply {
    timeZone = TimeZone.getTimeZone("UTC")
  }.format(this)
}
