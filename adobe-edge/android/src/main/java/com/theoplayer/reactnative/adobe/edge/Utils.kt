package com.theoplayer.reactnative.adobe.edge

import com.adobe.marketing.mobile.edge.identity.AuthenticatedState
import com.adobe.marketing.mobile.edge.identity.IdentityItem
import com.facebook.react.bridge.ReadableMap
import com.adobe.marketing.mobile.edge.identity.IdentityMap

fun sanitiseContentLength(mediaLength: Double?): Int {
  return if (mediaLength == Double.POSITIVE_INFINITY) { 86400 } else mediaLength?.toInt() ?: 0
}

fun sanitisePlayhead(playhead: Double?, mediaLength: Double?): Int {
  if (playhead == null || mediaLength == null) {
    return 0
  }
  if (mediaLength == Double.POSITIVE_INFINITY) {
    // If content is live, the playhead must be the current second of the day.
    val now = System.currentTimeMillis()
    return ((now / 1000) % 86400).toInt()
  }
  return playhead.toInt()
}

fun isValidDuration(v: Double?): Boolean {
  return v != null && !v.isNaN()
}

fun ReadableMap.toAdobeCustomMetadataDetails() : HashMap<String, String> {
  return toHashMap().mapValues { it.value?.toString() ?: "" } as HashMap<String, String>
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
