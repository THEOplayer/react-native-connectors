package com.theoplayer.reactnative.adobe

import android.os.Build
import android.os.LocaleList
import com.theoplayer.android.api.ads.Ad
import com.theoplayer.android.api.ads.AdBreak
import com.theoplayer.android.api.ads.LinearAd
import com.theoplayer.android.api.player.track.texttrack.cue.TextTrackCue
import java.util.Locale

fun calculateAdBreakBeginMetadata(adBreak: AdBreak?, lastPodIndex: Int): AdobeMetaData {
  val currentAdBreakTimeOffset = adBreak?.timeOffset ?: 0
  val podIndex: Int = when {
    currentAdBreakTimeOffset == 0 -> 0
    currentAdBreakTimeOffset < 0 -> -1
    else -> lastPodIndex + 1
  }

  return AdobeMetaData(
    params = mutableMapOf(
    "media.ad.podIndex" to podIndex,
    "media.ad.podSecond" to (adBreak?.maxDuration ?: 0),
    )
  )
}

fun calculateAdBeginMetadata(ad: Ad?, adPodPosition: Int): AdobeMetaData {
  return AdobeMetaData(
    params = mutableMapOf(
      "media.ad.podPosition" to adPodPosition,
      "media.ad.id" to (ad?.id ?: "NA"),
      "media.ad.length" to if (ad is LinearAd) ad.duration else 0,
      "media.ad.playerName" to "THEOplayer",
    )
  )
}

fun calculateChapterStartMetadata(cue: TextTrackCue): AdobeMetaData {
  val index = try {
    cue.id.toInt()
  } catch (_: NumberFormatException) {
    0
  }
  return AdobeMetaData(
    params = mutableMapOf(
      "media.chapter.length" to 1e-3 * (cue.endTime - cue.startTime),
      "media.chapter.offset" to 1e-3 * (cue.endTime - cue.startTime),
      "media.chapter.index" to index
    )
  )
}

fun buildUserAgent(): String {
  val locale: Locale = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
    LocaleList.getDefault().get(0)
  } else {
    Locale.getDefault()
  }
  // Example: Mozilla/5.0 (Linux; U; Android 7.1.2; en-US; AFTN Build/NS6296)
  return "Mozilla/5.0 (Linux; U; Android ${Build.VERSION.RELEASE}; $locale; ${Build.MODEL} Build/${Build.ID})"
}

fun isValidDuration(v: Double?): Boolean {
  return v != null && !v.isNaN()
}
