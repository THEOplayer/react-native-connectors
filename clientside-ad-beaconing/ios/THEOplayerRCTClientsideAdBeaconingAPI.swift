
import Foundation
import UIKit
import react_native_theoplayer
import THEOplayerSDK

func log(_ text: String) {
#if DEBUG
    print("[react-native-clientside-ad-beaconing]", text)
#endif
}

@objc(THEOplayerRCTClientsideAdBeaconingAPI)
class THEOplayerRCTClientsideAdBeaconingAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!
    
    var connectors = [NSNumber: ClientsideAdBeaconingConnector]()
    
    static func moduleName() -> String! {
        return "ClientsideAdBeaconingModule"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc(initialize:)
    func initialize(_ node: NSNumber) -> Void {
        log("initialize triggered.")
        
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView
            if let player = theView?.player {
                let connector = ClientsideAdBeaconingConnector(player: player)
                self.connectors[node] = connector
                log("added connector to view \(node)")
            } else {
                log("cannot find THEOPlayer for node \(node)")
            }
        }
    }
    
    @objc(destroy:)
    func destroy(_ node: NSNumber) -> Void {
        log("destroy triggered for \(node).")
        DispatchQueue.main.async {
            self.connectors[node]?.destroy()
            self.connectors.removeValue(forKey: node)
        }
    }
}
