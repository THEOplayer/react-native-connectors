// AdobeUtils.swift

import Foundation
import THEOplayerSDK

class AdobeUtils {
    class func toAdobeCustomMetadataDetails(_ array: [[String: Any]]) -> [String: String] {
        var result = [String: String]()
        for item in array {
            let stringsItem = AdobeUtils.toStringMap(item)
            if let name = stringsItem["name"], let value = stringsItem["value"] {
                result[name] = value
            }
        }
        return result
    }
    
    class func toStringMap(_ map: [String: Any]) -> [String: String] {
        var result = [String: String]()
        for (key, value) in map {
            if let stringValue = value as? String {
                result[key] = stringValue
            } else if let optionalValue = value as? CustomStringConvertible {
                // Convert other types (Int, Bool, Double, etc.) to String
                result[key] = String(describing: optionalValue)
            } else {
                // If value is nil or not convertible, use empty string
                result[key] = ""
            }
        }
        
        return result
    }
    
    class func sanitisePlayhead(_ playhead: Double?) -> Int {
        guard let playhead = playhead else {
            return 0
        }
        
        if playhead == Double.infinity {
            // If content is live, the playhead must be the current second of the day.
            let now = Date().timeIntervalSince1970
            return Int(now.truncatingRemainder(dividingBy: 86400))
        }
        
        return Int(playhead)
    }
    
    class func sanitiseContentLength(_ mediaLength: Double?) -> Int {
        mediaLength == .infinity ? 86400 : Int(mediaLength ?? 0)
    }
}

