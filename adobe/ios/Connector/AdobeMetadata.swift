//
//  AdobeConnector.swift
//

import Foundation
import THEOplayerSDK

class AdobeMetadata {
    var params: [String: String] = [:]
    var qoeData: [String: String] = [:]
    var customMetadata: [String: String] = [:]
    
    func fromDict(_ dict: NSDictionary?) -> AdobeMetadata {
        if let dictData = dict as? [String:Any] {
            if let paramsDict = dictData["params"] as? [String: String] {
                self.params = paramsDict
            }
            if let qoeDataDict = dictData["qoeData"] as? [String: String] {
                self.qoeData = qoeDataDict
            }
            if let customMetadataDict = dictData["customMetadata"] as? [String: String] {
                self.customMetadata = customMetadataDict
            }
        }
        return self
    }
}
