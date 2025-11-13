package com.theoplayer.reactnative.adobe.edge

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.theoplayer.reactnative.adobe.edge.api.AdobeCustomMetadataDetails
import com.theoplayer.reactnative.adobe.edge.api.AdobeErrorDetails
import com.theoplayer.reactnative.adobe.edge.api.ErrorSource

fun ReadableMap.toAdobeErrorDetails(): AdobeErrorDetails {
  return AdobeErrorDetails(
    name = this.getString("name") ?: "NA",
    source = when (this.getString("source")) {
      "player" -> ErrorSource.PLAYER
      else -> ErrorSource.EXTERNAL
    }
  )
}

fun ReadableMap.toAdobeCustomMetadataDetails() : AdobeCustomMetadataDetails {
  return AdobeCustomMetadataDetails(
    name = getString("name"),
    value = getString("value")
  )
}

fun ReadableArray.toAdobeCustomMetadataDetails() : List<AdobeCustomMetadataDetails> {
  return mutableListOf<AdobeCustomMetadataDetails>().apply {
    toArrayList()
      .map { e -> (e as? ReadableMap)?.toAdobeCustomMetadataDetails() }
      .filter { e -> e != null }
  }
}
