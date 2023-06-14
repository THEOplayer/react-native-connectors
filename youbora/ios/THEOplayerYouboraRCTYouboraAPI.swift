
import Foundation
import UIKit
import react_native_theoplayer
import THEOplayerConnectorYoubora
import THEOplayerSDK

func log(_ text: String) {
    #if DEBUG
        print("[react-native-theoplayer-youbora]", text)
    #endif
}

@objc(THEOplayerYouboraRCTYouboraAPI)
class THEOplayerYouboraRCTYouboraAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!

    var connectors = [NSNumber: YouboraConnector]()

    static func moduleName() -> String! {
        return "YouboraModule"
    }

    static func requiresMainQueueSetup() -> Bool {
        return false
    }

    @objc(initialize:appId:instanceName:youboraOptions:)
    func initialize(_ node: NSNumber, appId: String, instanceName: String, youboraOptions: NSDictionary) -> Void {
        log("initialize triggered.")

        DispatchQueue.main.async {
            log("\(appId) \(instanceName) \(youboraOptions)")
            let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView
            if let player = theView?.player {
                youboraOptions.setValue(appId, forKey: "appId")
                if let connector = YouboraConnector(
                    configuration: youboraOptions,
                    player: player
                ) {
                    self.connectors[node] = connector
                    log("added connector to view \(node)")
                } else {
                    log("Cannot create Youbora connector for node \(node)")
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
		DispatchQueue.main.async {
		    self.connectors.removeValue(forKey: node)
		}
    }
}
