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
        self.theoplayerCollector.customData = BitmovinAdapter.mergeCustomData(existingCustomData: self.theoplayerCollector.customData, newCustomData: BitmovinAdapter.parseCustomData(customData))
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
    
    // MARK: SSAI part
    
    func reportAdBreakStart(adBreakMetadata: [String:Any]) -> Void {
        let newAdBreakMetadata = BitmovinAdapter.parseSSAIAdBreakMetadata(adBreakMetadata)
        self.theoplayerCollector.ssai.adBreakStart(adBreakMetadata: newAdBreakMetadata)
        log("[SSAI] adBreakStart reported, with adBreakMetadata: \(adBreakMetadata)")
    }
    
    func reportAdStart(adMetadata: [String:Any]) -> Void {
        let newAdMetadata = BitmovinAdapter.parseSSAIAdMetadata(adMetadata)
        self.theoplayerCollector.ssai.adStart(adMetadata: newAdMetadata)
        log("[SSAI] adStart reported, with adMetadata: \(adMetadata)")
    }
    
    func reportQuartileFinished(adQuartile: String, adQuartileMetadata: [String:Any]) -> Void {
        let quartile = BitmovinAdapter.parseAdQuartile(adQuartile)
        let newAdQuartileMetadata = BitmovinAdapter.parseSSAIAdQuartileMetadata(adQuartileMetadata)
        self.theoplayerCollector.ssai.adQuartileFinished(adQuartile: quartile, adQuartileMetadata: newAdQuartileMetadata)
        log("[SSAI] adQuartileFinished (\(adQuartile)) reported, with adQuartileMetadata: \(adQuartileMetadata)")
    }
    
    func reportAdBreakEnd() -> Void {
        self.theoplayerCollector.ssai.adBreakEnd()
        log("[SSAI] adBreakEnd reported.")
    }
    
    // MARK: - event handling
    private func onSourceChange(event: SourceChangeEvent) {
        guard let player = self.player/*, let source = player.source*/ else { return }
        log("Received SOURCE_CHANGE event from THEOplayer")
        
        self.theoplayerCollector.detach()
        log("Player detached from collector.")
        
        self.theoplayerCollector.sourceMetadata = BitmovinAdapter.parseSourceMetadata(sourceMetadata: self.currentSourceMetadata/*, extractedSourceMetadata: source.metadata?.metadataKeys*/)
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
