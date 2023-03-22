
import Foundation
import UIKit
import react_native_theoplayer
import THEOplayerConnectorNielsen
import THEOplayerSDK

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
        print("[NielsenModule] initialize triggered.")

        DispatchQueue.main.async {
            print("[NielsenModule]", appId, instanceName, nielsenOptions)
            let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView
            if let player = theView?.player {
                nielsenOptions.setValue(appId, forKey: "appId")
                if let connector = NielsenConnector(
                    configuration: nielsenOptions,
                    player: player
                ) {
                    self.connectors[node] = connector
                    print("[NielsenModule] added connector to view", node)
                } else {
                    print("[NielsenModule] Cannot create Nielsen connector for node", node)
                }
            }
        }
    }

    @objc(updateMetadata:metadata:)
    func updateMetadata(for node: NSNumber, metadata: NSDictionary) {
        print("[NielsenModule] Warning: updating metadata not possible on iOS.")
    }

    @objc(destroy:)
    func destroy(_ node: NSNumber) -> Void {
        print("[NielsenModule] destroy triggered.")
        connectors.removeValue(forKey: node)
    }

}
