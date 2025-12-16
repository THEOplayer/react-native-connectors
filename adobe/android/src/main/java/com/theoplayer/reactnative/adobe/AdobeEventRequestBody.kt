package com.theoplayer.reactnative.adobe

import kotlinx.serialization.*

@Serializable
data class AdobeEventRequestBody(
  @Serializable(with = MutableMapAnySerializer::class)
  var playerTime: MutableMap<String, Any>? = null,
  var eventType: String? = null,
) : AdobeMetaData()
