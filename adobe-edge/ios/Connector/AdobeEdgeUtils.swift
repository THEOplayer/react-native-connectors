import Foundation
import THEOplayerSDK
import AEPEdgeIdentity

class AdobeEdgeUtils {
    class func toAdobeCustomMetadataDetails(_ array: [[String: Any]]) -> [String: String] {
        var result = [String: String]()
        for item in array {
            let stringsItem = AdobeEdgeUtils.toStringMap(item)
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
}

