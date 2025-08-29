// AdobeUtils.swift

import Foundation
import THEOplayerSDK

class AdobeUtils {
    class func buildUserAgent() -> String {
        let device = UIDevice.current
        let model = device.model
        let osVersion = device.systemVersion.replacingOccurrences(of: ".", with: "_")
        let locale = (UserDefaults.standard.array(forKey: "AppleLanguages")?.first as? String) ?? Locale.current.identifier
        let userAgent = "Mozilla/5.0 (\(model); CPU OS \(osVersion) like Mac OS X; \(locale))"
        return userAgent
    }
}
