//
//  AdobeConnector.swift
//

import Foundation
import THEOplayerSDK

class AdobeConnector {
    private weak var player: THEOplayer?
    private var uri: String
    private var ecid: String
    private var sid: String
    private var trackingUrl: String
    private var metadata: AdobeMetadata?
    private var userAgent: String?
    private var debug: Bool = false
    
    init(player: THEOplayer, uri: String, ecid: String, sid: String, trackingUrl: String, metadata: AdobeMetadata?, userAgent: String?, debug: Bool) {
        self.player = player
        self.uri = uri
        self.ecid = ecid
        self.sid = sid
        self.trackingUrl = trackingUrl
        self.metadata = metadata
        self.userAgent = userAgent
        self.debug = debug
        
        self.addEventListeners()
        
        self.log("Initialized connector.")
    }
    
    func setDebug(_ debug: Bool) -> Void {
        self.debug = debug
    }
    
    func updateMetadata(_ metadata: AdobeMetadata) -> Void {
        // todo
    }
    
    func setError(_ metadata: AdobeMetadata) -> Void {
        // todo
    }
    
    func stopAndStartNewSession(_ metadata: AdobeMetadata) -> Void {
        // todo
    }
    
    func destroy() -> Void {
        self.removeEventListeners()
    }
    
    func addEventListeners() -> Void {
        self.log("Listeners attached.")
    }
    
    func removeEventListeners() -> Void {
        self.log("Listeners removed.")
    }
    
    func log(_ text: String) {
        if self.debug {
            print("[adobe-connector]", text)
        }
    }
}
