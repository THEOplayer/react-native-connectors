//
//  AdobeEdgeConnector.swift
//

import Foundation
import THEOplayerSDK
import UIKit
import AEPServices

class AdobeEdgeConnector {
    private var handler: AdobeEdgeHandler
    init(player: THEOplayer, trackerConfig: [String:String]) {
        self.handler = AdobeEdgeHandler(player: player, trackerConfig: trackerConfig)
    }
    
    func updateMetadata(_ metadata: [String:String]) -> Void {
        self.handler.updateMetadata(metadata)
    }
    
    func stopAndStartNewSession(_ metadata: [String:String]) -> Void {
        self.handler.stopAndStartNewSession(metadata)
    }
    
    func setLoggingMode(_ debug: LogLevel) -> Void {
        self.handler.setLoggingMode(debug)
    }
    
    func setError(_ errorId: String) -> Void {
        self.handler.setError(errorId)
    }
    
    func destroy() -> Void {
        self.handler.destroy()
    }
}
