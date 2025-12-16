package com.theoplayer.reactnative.adobe

import kotlinx.serialization.*
import kotlinx.serialization.json.*
import kotlinx.serialization.descriptors.*
import kotlinx.serialization.encoding.*

object MutableMapAnySerializer : KSerializer<MutableMap<String, Any>> {
  override val descriptor: SerialDescriptor =
    buildClassSerialDescriptor("MutableMap<String, Any>")

  override fun serialize(encoder: Encoder, value: MutableMap<String, Any>) {
    val jsonEncoder = encoder as? JsonEncoder
      ?: throw SerializationException("This serializer can only be used with JSON")

    val jsonObject = JsonObject(value.mapValues { anyToJson(it.value) })
    jsonEncoder.encodeJsonElement(jsonObject)
  }

  override fun deserialize(decoder: Decoder): MutableMap<String, Any> {
    // We don't need to deserialize
    throw SerializationException("Deserialization is not supported")
  }

  private fun anyToJson(v: Any): JsonElement = when (v) {
    is String -> JsonPrimitive(v)
    is Int -> JsonPrimitive(v)
    is Boolean -> JsonPrimitive(v)
    is Double -> JsonPrimitive(v)
    is Float -> JsonPrimitive(v)
    is Long -> JsonPrimitive(v)
    is MutableMap<*, *> -> {
      @Suppress("UNCHECKED_CAST")
      JsonObject((v as MutableMap<String, Any>).mapValues { anyToJson(it.value) })
    }
    is List<*> -> JsonArray(v.map { anyToJson(it!!) })
    else -> JsonPrimitive(v.toString())
  }
}
