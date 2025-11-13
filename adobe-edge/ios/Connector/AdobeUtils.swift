// AdobeUtils.swift

import Foundation
import THEOplayerSDK

class AdobeUtils {
    class func calculateAdvertisingPodDetails(adBreak: AdBreak?, lastPodIndex: Int) -> AdobeAdvertisingPodDetails {
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
    
    class func calculateAdvertisingDetails(ad: Ad?, podPosition: Int) -> AdobeAdvertisingDetails {
        let length = (ad as? LinearAd)?.duration ?? 0
        
        return AdobeAdvertisingDetails(
            length: length,
            name: "NA",
            playerName: "THEOplayer",
            podPosition: podPosition
        )
    }
    
    class func buildUserAgent() -> String {
        let device = UIDevice.current
        let model = device.model
        let osVersion = device.systemVersion.replacingOccurrences(of: ".", with: "_")
        let locale = (UserDefaults.standard.array(forKey: "AppleLanguages")?.first as? String) ?? Locale.current.identifier
        let userAgent = "Mozilla/5.0 (\(model); CPU OS \(osVersion) like Mac OS X; \(locale))"
        return userAgent
    }
    
    class func toDictionary<T: Encodable>(_ value: T) -> [String: Any] {
        let encoder = JSONEncoder()
        guard let data = try? encoder.encode(value),
              let jsonObject = try? JSONSerialization.jsonObject(with: data, options: []),
              let dictionary = jsonObject as? [String: Any] else {
            return [:]
        }
        return dictionary
    }
}

