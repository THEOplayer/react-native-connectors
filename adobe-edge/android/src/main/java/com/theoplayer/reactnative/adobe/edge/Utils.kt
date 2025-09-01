package com.theoplayer.reactnative.adobe.edge

import com.theoplayer.android.api.ads.Ad
import com.theoplayer.android.api.ads.AdBreak
import com.theoplayer.android.api.ads.LinearAd
import com.theoplayer.android.api.player.track.texttrack.cue.TextTrackCue
import com.theoplayer.reactnative.adobe.edge.api.AdobeAdvertisingDetails
import com.theoplayer.reactnative.adobe.edge.api.AdobeAdvertisingPodDetails
import com.theoplayer.reactnative.adobe.edge.api.AdobeChapterDetails

fun sanitiseContentLength(mediaLength: Double?): Double {
  return if (mediaLength == Double.POSITIVE_INFINITY) { 86400.0 } else mediaLength ?: 0.0
}

fun calculateAdvertisingPodDetails(adBreak: AdBreak?, lastPodIndex: Int): AdobeAdvertisingPodDetails {
  val currentAdBreakTimeOffset = adBreak?.timeOffset ?: 0
  return AdobeAdvertisingPodDetails(
    index = when {
      currentAdBreakTimeOffset == 0 -> 0
      currentAdBreakTimeOffset < 0 -> -1
      else ->lastPodIndex + 1
    },
    offset = currentAdBreakTimeOffset
  )
}

fun calculateAdvertisingDetails(ad: Ad?, podPosition: Int): AdobeAdvertisingDetails {
  return AdobeAdvertisingDetails(
    podPosition = podPosition,
    length = if (ad is LinearAd) ad.duration else 0,
    name = "NA",
    playerName = "THEOplayer"
  )
}

fun calculateChapterDetails(cue: TextTrackCue): AdobeChapterDetails {
  val index = try {
    cue.id.toInt()
  } catch (_: NumberFormatException) {
    0
  }
  return AdobeChapterDetails(
    length = cue.endTime - cue.startTime,
    offset = cue.endTime,
    index = index
  )
}

fun isValidDuration(v: Double?): Boolean {
  return v != null && !v.isNaN()
}
