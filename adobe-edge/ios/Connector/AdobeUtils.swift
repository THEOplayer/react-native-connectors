// AdobeUtils.swift

import Foundation
import THEOplayerSDK

func calculateAdvertisingPodDetails(adBreak: AdBreak?, lastPodIndex: Int) -> AdobeAdvertisingPodDetails {
  let currentAdBreakTimeOffset = adBreak?.timeOffset ?? 0
  
  let index: Int
  if currentAdBreakTimeOffset == 0 {
    index = 0
  } else if currentAdBreakTimeOffset < 0 {
    index = -1
  } else {
    index = lastPodIndex + 1
  }
  
  return AdobeAdvertisingPodDetails(
    index: index,
    offset: currentAdBreakTimeOffset
  )
}

func calculateAdvertisingDetails(ad: Ad?, podPosition: Int) -> AdobeAdvertisingDetails {
    let length = (ad as? LinearAd)?.duration ?? 0

    return AdobeAdvertisingDetails(
        length: length,
        name: "NA",
        playerName: "THEOplayer",
        podPosition: podPosition
    )
}

func buildUserAgent() -> String {
  let device = UIDevice.current
  let model = device.model
  let osVersion = device.systemVersion.replacingOccurrences(of: ".", with: "_")
  let locale = (UserDefaults.standard.array(forKey: "AppleLanguages")?.first as? String) ?? Locale.current.identifier
  let userAgent = "Mozilla/5.0 (\(model); CPU OS \(osVersion) like Mac OS X; \(locale))"
  return userAgent
}

