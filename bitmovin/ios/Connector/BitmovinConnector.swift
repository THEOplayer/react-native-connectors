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
        log("Initialized Bitmovin Connector with config: \(bitmovinConfig) and default metadata: \(defaultMetadata ?? [:])")
        self.theoplayerCollector.attach(to: player)
    }
    
    func updateSourceMetadata(_ sourceMetadata: [String:Any]) -> Void {
        self.theoplayerCollector.sourceMetadata = BitmovinAdapter.parseSourceMetadata(sourceMetadata)
        log("Updated source metadata: \(sourceMetadata)")
    }
    
    func programChange(_ sourceMetadata: [String:Any]) -> Void {
        // let newSourceMetadata = BitmovinAdapter.parseSourceMetadata(sourceMetadata)
        // TODO: self.theoplayerCollector.programChange(newSourceMetadata)
        log("TODO: Notifying program change with source metadata: \(sourceMetadata)")
    }
    
    func updateCustomMetadata(_ customData: [String:Any]) -> Void {
        self.theoplayerCollector.customData = BitmovinAdapter.parseCustomData(customData)
        log("Updated custom data: \(customData)")
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
