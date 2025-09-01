package com.theoplayer.reactnative.adobe.edge.api

import android.os.Build
import android.os.LocaleList
import java.util.Locale

fun buildUserAgent(): String {
  val locale: Locale = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
    LocaleList.getDefault().get(0)
  } else {
    Locale.getDefault()
  }
  // Example: Mozilla/5.0 (Linux; U; Android 7.1.2; en-US; AFTN Build/NS6296)
  return "Mozilla/5.0 (Linux; U; Android ${Build.VERSION.RELEASE}; $locale; ${Build.MODEL} Build/${Build.ID})"
}

fun sanitisePlayhead(playhead: Double?): Double {
  if (playhead == null) {
    return 0.0
  }
  if (playhead == Double.POSITIVE_INFINITY) {
    // If content is live, the playhead must be the current second of the day.
    val now = System.currentTimeMillis()
    return ((now / 1000) % 86400).toDouble()
  }
  return playhead
}
