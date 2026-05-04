
import Foundation
import UIKit
import react_native_theoplayer
import THEOplayerSDK

func log(_ text: String) {
#if DEBUG
    print("[react-native-mediakind-ssai]", text)
#endif
}

@objc(THEOplayerRCTMediaKindSSAIAPI)
class THEOplayerRCTMediaKindSSAIAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!

    var connectors = [NSNumber: MediaKindSSAIConnector]()

    static func moduleName() -> String! {
        return "MediaKindSSAIModule"
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
                let connector = MediaKindSSAIConnector(player: player)
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
