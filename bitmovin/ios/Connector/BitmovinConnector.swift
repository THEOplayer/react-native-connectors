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
        self.theoplayerCollector.attach(to: player)
        log("Bitmovin Connector initialised with config: \(bitmovinConfig) and default metadata: \(defaultMetadata ?? [:])")
    }
    
    func updateSourceMetadata(_ sourceMetadata: [String:Any]) -> Void {
        self.theoplayerCollector.sourceMetadata = BitmovinAdapter.parseSourceMetadata(sourceMetadata)
        log("Updated source metadata: \(sourceMetadata)")
    }
    
    func programChange(_ sourceMetadata: [String:Any]) -> Void {
        let newSourceMetadata = BitmovinAdapter.parseSourceMetadata(sourceMetadata)
        self.theoplayerCollector.programChange(newSourceMetadata: newSourceMetadata)
        log("Notified program change with new source metadata: \(sourceMetadata)")
    }
    
    func updateCustomMetadata(_ customData: [String:Any]) -> Void {
        self.theoplayerCollector.customData = BitmovinAdapter.parseCustomData(customData)
        log("Updated custom data: \(customData)")
    }
    
    func sendCustomDataEvent(_ customData: [String:Any]) -> Void {
        self.theoplayerCollector.sendCustomDataEvent(with: BitmovinAdapter.parseCustomData(customData))
        log("Custom data event send with custom data: \(customData)")
    }
    
    func destroy() -> Void {
        self.theoplayerCollector.detach()
        log("Bitmovin Connector destroyed.")
    }
}
