package com.theoplayer.reactnative.adobe

import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableType
import kotlin.collections.orEmpty
import kotlin.collections.plus
import kotlin.collections.toMutableMap
import kotlinx.serialization.*

@Serializable
open class AdobeMetaData(
  @Serializable(with = MutableMapAnySerializer::class)
  open var params: MutableMap<String, Any>? = null,
  @Serializable(with = MutableMapAnySerializer::class)
  open var qoeData: MutableMap<String, Any>? = null,
  @Serializable(with = MutableMapAnySerializer::class)
  open var customMetadata: MutableMap<String, Any>? = null,
)

fun AdobeMetaData.add(metadata: AdobeMetaData): AdobeMetaData {
  metadata.params?.let {
    this.params = (this.params.orEmpty() + it).toMutableMap()
  }
  metadata.customMetadata?.let {
    this.customMetadata = (this.customMetadata.orEmpty() + it).toMutableMap()
  }
  metadata.qoeData?.let {
    this.qoeData = (this.qoeData.orEmpty() + it).toMutableMap()
  }
  return this
}

fun ReadableMap.toMutableMap(): MutableMap<String, Any> {
  val map = mutableMapOf<String, Any>()
  val iterator = this.keySetIterator()
  while (iterator.hasNextKey()) {
    val key = iterator.nextKey()
    when (this.getType(key)) {
      ReadableType.String -> map[key] = this.getString(key) ?: ""
      ReadableType.Number -> map[key] = this.getDouble(key)
      ReadableType.Boolean -> map[key] = this.getBoolean(key)
      ReadableType.Map -> map[key] = this.getMap(key)?.toMutableMap() ?: emptyMap<String, Any>()
      ReadableType.Array -> map[key] = this.getArray(key)?.toArrayList() ?: emptyList<Any>()
      else -> map[key] = this.getString(key) ?: ""
    }
  }
  return map
}

fun ReadableMap.toAdobeMetaData(): AdobeMetaData {
  return AdobeMetaData(
    params = if (this.hasKey("params")) this.getMap("params")?.toMutableMap() else null,
    qoeData = if (this.hasKey("qoeData")) this.getMap("qoeData")?.toMutableMap() else null,
    customMetadata = if (this.hasKey("customMetadata")) this.getMap("customMetadata")?.toMutableMap() else null
  )
}
