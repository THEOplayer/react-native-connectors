//
//  AdobeConnector.swift
//

import Foundation
import THEOplayerSDK

class AdobeMetadata {
    var params: [String: Any]?
    var qoeData: [String: Any]?
    var customMetadata: [String: Any]?
    
    init(params: [String: Any]? = nil,
         qoeData: [String: Any]? = nil,
         customMetadata: [String: Any]? = nil) {
        self.params = params
        self.qoeData = qoeData
        self.customMetadata = customMetadata
    }
    
    convenience init(from dict: [String: Any]?) {
        let params = dict?["params"] as? [String: Any]
        let qoeData = dict?["qoeData"] as? [String: Any]
        let customMetadata = dict?["customMetadata"] as? [String: Any]
        self.init(params: params, qoeData: qoeData, customMetadata: customMetadata)
    }
    
    func add(_ metadata: AdobeMetadata) {
        if let newParams = metadata.params {
            if self.params != nil {
                self.params!.merge(newParams) { _, new in new }
            } else {
                self.params = newParams
            }
        }
        if let newQoeData = metadata.qoeData {
            if self.qoeData != nil {
                self.qoeData!.merge(newQoeData) { _, new in new }
            } else {
                self.qoeData = newQoeData
            }
        }
        if let newCustomMetadata = metadata.customMetadata {
            if self.customMetadata != nil {
                self.customMetadata!.merge(newCustomMetadata) { _, new in new }
            } else {
                self.customMetadata = newCustomMetadata
            }
        }
    }
    
    func toDictionary() -> [String: Any] {
        var dict: [String: Any] = [:]
        if let params = self.params {
            dict["params"] = params
        }
        if let qoeData = self.qoeData {
            dict["qoeData"] = qoeData
        }
        if let customMetadata = self.customMetadata {
            dict["customMetadata"] = customMetadata
        }
        return dict
    }
}
