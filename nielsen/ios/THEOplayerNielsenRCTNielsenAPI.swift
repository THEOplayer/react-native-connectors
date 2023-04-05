
import Foundation
import UIKit
import react_native_theoplayer
import THEOplayerConnectorNielsen
import THEOplayerSDK

func log(_ text: String) {
    #if DEBUG
        print("[react-native-theoplayer-nielsen]", text)
    #endif
}

@objc(THEOplayerNielsenRCTNielsenAPI)
class THEOplayerNielsenRCTNielsenAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!

    var connectors = [NSNumber: NielsenConnector]()

    static func moduleName() -> String! {
        return "NielsenModule"
    }

    static func requiresMainQueueSetup() -> Bool {
        return false
    }

    @objc(initialize:appId:instanceName:nielsenOptions:)
    func initialize(_ node: NSNumber, appId: String, instanceName: String, nielsenOptions: NSDictionary) -> Void {
        log("initialize triggered.")

        DispatchQueue.main.async {
            log("\(appId) \(instanceName) \(nielsenOptions)")
            let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView
            if let player = theView?.player {
                nielsenOptions.setValue(appId, forKey: "appId")
                if let connector = NielsenConnector(
                    configuration: nielsenOptions,
                    player: player
                ) {
                    self.connectors[node] = connector
                    log("added connector to view \(node)")
                } else {
                    log("Cannot create Nielsen connector for node \(node)")
                }
            }
        }
    }

    @objc(updateMetadata:metadata:)
    func updateMetadata(for node: NSNumber, metadata: NSDictionary) {
        log("Warning: updating metadata not possible on iOS.")
    }

    @objc(destroy:)
    func destroy(_ node: NSNumber) -> Void {
        log("destroy triggered for \(node).")
        connectors.removeValue(forKey: node)
    }
}
