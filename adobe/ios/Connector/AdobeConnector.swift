//
//  AdobeConnector.swift
//

import Foundation
import THEOplayerSDK
import UIKit

class AdobeConnector {
    private weak var player: THEOplayer?
    private var uri: String
    private var ecid: String
    private var sid: String
    private var trackingUrl: String
    private var customMetadata: AdobeMetadata?
    private var userAgent: String?
    private var debug: Bool = false
    
    init(player: THEOplayer, uri: String, ecid: String, sid: String, trackingUrl: String, metadata: AdobeMetadata?, userAgent: String?, debug: Bool) {
        self.player = player
        self.uri = uri
        self.ecid = ecid
        self.sid = sid
        self.trackingUrl = trackingUrl
        self.customMetadata = metadata
        self.userAgent = userAgent ?? self.buildUserAgent()
        self.debug = debug
        
        self.addEventListeners()
        
        self.log("Connector initialized.")
    }
    
    func buildUserAgent() -> String {
        let device = UIDevice.current
        let model = device.model
        let osVersion = device.systemVersion.replacingOccurrences(of: ".", with: "_")
        let locale = (UserDefaults.standard.array(forKey: "AppleLanguages")?.first as? String) ?? Locale.current.identifier
        let userAgent = "Mozilla/5.0 (\(model); CPU OS \(osVersion) like Mac OS X; \(locale))"
        return userAgent
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
