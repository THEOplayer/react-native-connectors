package com.theoplayeryoubora.adapter

import com.facebook.react.bridge.ReadableMap
import com.npaw.diagnostics.DiagnosticOptions

object DiagnosticOptionsAdapter {
  fun fromMap(readableMap: ReadableMap): DiagnosticOptions {
    val map = readableMap.toHashMap()
    return DiagnosticOptions(
      adAnalyticsEnabled = (map["adAnalyticsEnabled"] as? Boolean) ?: false,
      balancerEnabled = (map["balancerEnabled"] as? Boolean) ?: false,
      reportTriggerTimeoutMilliseconds = (map["reportTriggerTimeoutMilliseconds"] as? Long) ?: 0L,
      videoAnalyticsEnabled = (map["videoAnalyticsEnabled"] as? Boolean) ?: false,
    )
  }
}
