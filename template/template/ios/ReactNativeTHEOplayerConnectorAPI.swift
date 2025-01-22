
import Foundation
import UIKit
import react_native_theoplayer
import THEOplayerSDK

@objc(ReactNativeTHEOplayerConnectorRCTAPI)
class ReactNativeTHEOplayerConnectorRCTAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!

    var connectors = [NSNumber: ReactNativeTHEOplayerConnector]()

    static func moduleName() -> String! {
        return "ReactNativeTHEOplayerConnectorModule"
    }

    static func requiresMainQueueSetup() -> Bool {
        return false
    }

    @objc(initialize:config:)
    func initialize(_ node: NSNumber, config: NSDictionary) -> Void {
        log("initialize triggered.")

        DispatchQueue.main.async {
            log(config.debugDescription)
            if let view = self.view(for: node), let player = view.player, let sendError = view.mainEventHandler.onNativeError {
                let connector = ReactNativeTHEOplayerConnector()
                self.connectors[node] = connector
            } else {
                log("Cannot find THEOPlayer for node \(node)")
            }
        }
    }

    @objc(destroy:)
    func destroy(_ node: NSNumber) -> Void {
        log("destroy triggered.")
        DispatchQueue.main.async {
            self.connectors.removeValue(forKey: node)
        }
    }

    func view(for node: NSNumber) -> THEOplayerRCTView? {
        self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView
    }

    func player(for node: NSNumber) -> THEOplayer? {
        view(for: node)?.player
    }
}

func log(_ text: String) {
    #if DEBUG
        print("[ReactNativeTHEOplayerConnector bridge]", text)
    #endif
}
