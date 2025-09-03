//
//  AdobeConnector.swift
//

import Foundation
import THEOplayerSDK

class AdobeMetadata {
    var params: [String: Any]
    var qoeData: [String: Any]
    var customMetadata: [String: Any]
    
    init(params: [String: Any] = [:],
         qoeData: [String: Any] = [:],
         customMetadata: [String: Any] = [:]) {
        self.params = params
        self.qoeData = qoeData
        self.customMetadata = customMetadata
    }
    
    convenience init(from dict: [String: Any]?) {
        let params = dict?["params"] as? [String: Any] ?? [:]
        let qoeData = dict?["qoeData"] as? [String: Any] ?? [:]
        let customMetadata = dict?["customMetadata"] as? [String: Any] ?? [:]
        self.init(params: params, qoeData: qoeData, customMetadata: customMetadata)
    }
    
    func add(_ metadata: AdobeMetadata) {
        merge(into: &params, from: metadata.params)
        merge(into: &qoeData, from: metadata.qoeData)
        merge(into: &customMetadata, from: metadata.customMetadata)
    }
    
    private func merge(into target: inout [String: Any], from source: [String: Any]?) {
        if let source = source {
            target.merge(source) { _, new in new }
        }
    }
    
    func toDictionary() -> [String: Any] {
        return [
            "params": self.params,
            "qoeData": self.qoeData,
            "customMetadata": self.customMetadata
        ]
    }
}
