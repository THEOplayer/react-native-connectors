package com.theoplayer.reactnative.adobe

import org.json.JSONObject

data class AdobeEventRequestBody(
  var playerTime: MutableMap<String, Any>? = null,
  var eventType: String? = null,
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
