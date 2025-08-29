//
//  AdobeConnector.swift
//

import Foundation
import THEOplayerSDK

class AdobeMetadata {
    var params: [String: String]
    var qoeData: [String: String]
    var customMetadata: [String: String]
    
    init(params: [String: String] = [:],
         qoeData: [String: String] = [:],
         customMetadata: [String: String] = [:]) {
        self.params = params
        self.qoeData = qoeData
        self.customMetadata = customMetadata
    }
    
    convenience init(from dict: [String: Any]?) {
        let params = dict?["params"] as? [String: String] ?? [:]
        let qoeData = dict?["qoeData"] as? [String: String] ?? [:]
        let customMetadata = dict?["customMetadata"] as? [String: String] ?? [:]
        self.init(params: params, qoeData: qoeData, customMetadata: customMetadata)
    }
    
    func add(_ metadata: AdobeMetadata) {
        merge(into: &params, from: metadata.params)
        merge(into: &qoeData, from: metadata.qoeData)
        merge(into: &customMetadata, from: metadata.customMetadata)
    }
    
    private func merge(into target: inout [String: String], from source: [String: String]?) {
        if let source = source {
            target.merge(source) { _, new in new }
        }
    }
}
