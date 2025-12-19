package com.theoplayer.reactnative.adobe.edge

import com.adobe.marketing.mobile.edge.identity.AuthenticatedState
import com.adobe.marketing.mobile.edge.identity.IdentityItem
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.adobe.marketing.mobile.edge.identity.IdentityMap

private const val PROP_NAME = "name"
private const val PROP_VALUE = "value"

fun sanitiseContentLength(mediaLength: Double?): Int {
  return if (mediaLength == Double.POSITIVE_INFINITY) { 86400 } else mediaLength?.toInt() ?: 0
}

fun sanitisePlayhead(playhead: Double?): Int {
  if (playhead == null) {
    return 0
  }
  if (playhead == Double.POSITIVE_INFINITY) {
    // If content is live, the playhead must be the current second of the day.
    val now = System.currentTimeMillis()
    return ((now / 1000) % 86400).toInt()
  }
  return playhead.toInt()
}

fun isValidDuration(v: Double?): Boolean {
  return v != null && !v.isNaN()
}

fun ReadableArray.toAdobeCustomMetadataDetails() : HashMap<String, String> {
  return hashMapOf<String, String>().apply {
    toArrayList()
      .map { e -> (e as? ReadableMap) }
      .filter { e -> e != null && e.hasKey(PROP_NAME) && e.hasKey(PROP_VALUE) }
  }
}

fun ReadableMap.toAdobeIdentityMap(): IdentityMap {
  return IdentityMap().apply {
    toHashMap().forEach { (namespace, items) ->
      val itemList = items as? List<*> ?: return@forEach
      itemList.forEach { item ->
        val itemMap = item as? Map<*, *> ?: return@forEach
        addItem(IdentityItem(
          itemMap["id"] as? String ?: "",
          when (itemMap["authenticatedState"] as? String) {
            "authenticated" -> AuthenticatedState.AUTHENTICATED
            "loggedOut" -> AuthenticatedState.LOGGED_OUT
            else -> AuthenticatedState.AMBIGUOUS
          },
          itemMap["primary"] as? Boolean ?: false
        ), namespace)
      }
    }
  }
}
