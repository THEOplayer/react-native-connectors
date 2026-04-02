//
//  ClientsideAdBeaconingConnector.swift
//

import Foundation
import THEOplayerSDK

class ClientsideAdBeaconingConnector {
    private weak var player: THEOplayer?
    
    init(player: THEOplayer) {
        self.player = player
        log("Clientside Ad Beaconing Connector initialised.")
    }
    
    func destroy() -> Void {
        log("Clientside Ad Beaconing Connector destroyed.")
    }
}
