//
//  BitmovinConnector.swift
//

import Foundation
import THEOplayerSDK
import CoreCollector
import THEOplayerCollector

class BitmovinHandler {
    private let theoplayerCollector: THEOplayerCollector.THEOplayerCollectorApi
    private weak var player: THEOplayer?
    private var sourceChangeListener: EventListener?
    private var currentSourceMetadata: [String:Any]?
    
    init(player: THEOplayer, bitmovinConfig: [String:Any], defaultMetadata: [String:Any]? = nil) {
        self.player = player
        let config: AnalyticsConfig = BitmovinAdapter.parseConfig(bitmovinConfig)
        let metadata: DefaultMetadata = BitmovinAdapter.parseDefaultMetadata(defaultMetadata)
        self.theoplayerCollector = THEOplayerCollector.THEOplayerCollectorFactory.create(config: config, defaultMetadata: metadata)
        self.attachListeners()
        log("Bitmovin Connector initialised with config: \(bitmovinConfig) and default metadata: \(defaultMetadata ?? [:])")
    }
    
    func updateSourceMetadata(_ sourceMetadata: [String:Any]) -> Void {
        self.currentSourceMetadata = sourceMetadata
        log("Updated current source metadata: \(sourceMetadata)")
    }
    
    func programChange(_ sourceMetadata: [String:Any]) -> Void {
        let newSourceMetadata = BitmovinAdapter.parseSourceMetadata(sourceMetadata: sourceMetadata)
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
        self.detachListeners()
        self.theoplayerCollector.detach()
        log("Bitmovin Connector destroyed.")
    }
    
    // MARK: - event handling
    private func onSourceChange(event: SourceChangeEvent) {
        guard let player = self.player, let source = player.source else { return }
        log("Received SOURCE_CHANGE event from THEOplayer")
        
        self.theoplayerCollector.detach()
        log("Player detached from collector.")
        
        self.theoplayerCollector.sourceMetadata = BitmovinAdapter.parseSourceMetadata(
            sourceMetadata: self.currentSourceMetadata,
            extractedSourceMetadata: source.metadata?.metadataKeys)
        self.currentSourceMetadata = nil
        log("SourceMetadata updated on collector.")
        
        self.theoplayerCollector.attach(to: player)
        log("Player attached to collector.")
    }
    
    // MARK: - attach/dettach main player Listeners
    private func attachListeners() {
        guard let player = self.player else { return }
        self.sourceChangeListener = player.addEventListener(type: PlayerEventTypes.SOURCE_CHANGE, listener: self.onSourceChange)
    }
    
    private func detachListeners() {
        guard let player = self.player else { return }
        if let sourceChangeListener = self.sourceChangeListener {
            player.removeEventListener(type: PlayerEventTypes.SOURCE_CHANGE, listener: sourceChangeListener)
        }
    }
}
