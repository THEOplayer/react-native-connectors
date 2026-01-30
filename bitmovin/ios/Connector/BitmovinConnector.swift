//
//  BitmovinConnector.swift
//

import Foundation
import THEOplayerSDK
import CoreCollector
// TODO: import THEOplayerCollector     // Update when THEOplayerCollector module is available through cocoapods.

class BitmovinConnector {
    // TODO: private let theoplayerCollector: THEOplayerCollector.THEOplayerCollectorApi
    
    init(player: THEOplayer, bitmovinConfig: [String:Any], defaultMetadata: [String:Any]? = nil) {
        let config: AnalyticsConfig = BitmovinAdapter.parseConfig(bitmovinConfig)
        let metadata: DefaultMetadata = BitmovinAdapter.parseDefaultMetadata(defaultMetadata)
        // TODO: self.theoplayerCollector = THEOplayerCollector.THEOplayerCollectorFactory.create(config: config, defaultMetadata: metadata)
        // TODO: self.theoplayerCollector.attach(to: player)
        log("TODO: Initialized Bitmovin Connector with config: \(bitmovinConfig) and default metadata: \(defaultMetadata ?? [:])")
    }
    
    func updateSourceMetadata(_ sourceMetadata: [String:Any]) -> Void {
        // TODO: self.theoplayerCollector.sourceMetadata = BitmovinAdapter.parseSourceMetadata(sourceMetadata)
        log("TODO: Updated source metadata: \(sourceMetadata)")
    }
    
    func programChange(_ sourceMetadata: [String:Any]) -> Void {
        // let newSourceMetadata = BitmovinAdapter.parseSourceMetadata(sourceMetadata)
        // TODO: self.theoplayerCollector.programChange(newSourceMetadata)
        log("TODO: Notifying program change with source metadata: \(sourceMetadata)")
    }
    
    func updateCustomMetadata(_ customData: [String:Any]) -> Void {
        // TODO: self.theoplayerCollector.customData = BitmovinAdapter.parseCustomData(customData)
        log("TODO: Updated custom data: \(customData)")
    }
    
    func sendCustomDataEvent(_ customData: [String:Any]) -> Void {
        log("TODO: Sending custom data event is not yet implemented.")
        // TODO: Implement when THEOplayerCollector supports sending custom data events
    }
    
    func destroy() -> Void {
        log("TODO: Destroying Bitmovin Connector is not yet implemented.")
        // TODO: Implement when THEOplayerCollector supports detaching
    }
}
