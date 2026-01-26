//
//  BitmovinConnector.swift
//

import Foundation
import THEOplayerSDK
import CoreCollector
import THEOplayerCollector

class BitmovinConnector {
    private let theoplayerCollector: THEOplayerCollector.THEOplayerCollectorApi
    
    init(player: THEOplayer, bitmovinConfig: [String:Any], defaultMetadata: [String:Any]? = nil) {
        let config: AnalyticsConfig = BitmovinAdapter.parseConfig(bitmovinConfig)
        let metadata: DefaultMetadata = BitmovinAdapter.parseDefaultMetadata(defaultMetadata)
        self.theoplayerCollector = THEOplayerCollector.THEOplayerCollectorFactory.create(config: config, defaultMetadata: metadata)
        log("Initialized Bitmovin Connector with config: \(config) and default metadata: \(metadata)")
    }
    
    func updateSourceMetadata(_ metadata: [String:Any]) -> Void {
        self.theoplayerCollector.sourceMetadata = BitmovinAdapter.parseSourceMetadata(metadata)
        log("Updated source metadata: \(self.theoplayerCollector.sourceMetadata)")
    }
    
    func updateCustomMetadata(_ customData: [String:Any]) -> Void {
        self.theoplayerCollector.customData = BitmovinAdapter.parseCustomData(customData)
        log("Updated custom data: \(self.theoplayerCollector.customData)")
    }
    
    func sendCustomDataEvent(_ customData: [String:Any]) -> Void {
        log("Sending custom data event is not yet implemented.")
        // TODO: Implement when THEOplayerCollector supports sending custom data events
    }
    
    func destroy() -> Void {
        log("Destroying Bitmovin Connector is not yet implemented.")
        // TODO: Implement when THEOplayerCollector supports detaching
    }
}
