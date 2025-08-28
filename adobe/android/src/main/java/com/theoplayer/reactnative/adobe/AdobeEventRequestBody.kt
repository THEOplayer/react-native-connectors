package com.theoplayer.reactnative.adobe

import org.json.JSONObject

data class AdobeEventRequestBody(
  var playerTime: MutableMap<String, Any>? = null,
  var eventType: String? = null,
  override var params: MutableMap<String, Any>? = null,
  override var qoeData: MutableMap<String, Any>? = null,
  override var customMetadata: MutableMap<String, Any>? = null,
) : AdobeMetaData()

fun AdobeEventRequestBody.toJSONObject(): JSONObject {
  val json = (this as AdobeMetaData).toJSONObject()
  playerTime?.let { it ->
    json.put("playerTime", JSONObject(it))
  }
  eventType?.let {
    json.put("eventType", it)
  }
  return json
}
