
import Foundation
import UIKit
@testable import react_native_theoplayer
import THEOplayerConnectorNielsen
import THEOplayerSDK

@objc(THEOplayerNielsenRCTNielsenAPI)
class THEOplayerNielsenRCTNielsenAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!

    var connectors = [NielsenConnector]()

    static func moduleName() -> String! {
        return "NielsenModule"
    }

    static func requiresMainQueueSetup() -> Bool {
        return false
    }

    @objc(initialize:NielsenMetadata:NielsenConfig:)
    func initialize(_ node: NSNumber, NielsenMetadata: NSDictionary, NielsenConfig: NSDictionary) -> Void {
        print("[NielsenModule] initialize triggered.")

        DispatchQueue.main.async {
            print("[NielsenModule]", NielsenConfig)
            let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView
            if let player = theView?.player {
                let configuration = NielsenConfiguration(
                    customerKey: NielsenConfig["customerKey"] as! String,
                    gatewayURL: NielsenConfig["gatewayUrl"] as? String,
                    logLevel: .LOGLEVEL_FUNC
                )
                if let connector = NielsenConnector(
                    configuration: configuration,
                    player: player
                ) {
                    self.connectors.append(connector)
                    print("[NielsenModule] added connector to view", node)
                }
            }
        }
    }

    @objc(setContentInfo:metadata:)
    func setContentInfo(_ node: NSNumber, metadata: NSDictionary) -> Void {
        print("[NielsenModule] setContentInfo triggered.")
    }

    @objc(setAdInfo:metadata:)
    func setAdInfo(_ node: NSNumber, metadata: NSDictionary) -> Void {
        print("[NielsenModule] setAdInfo triggered.")
    }

    @objc(destroy:)
    func destroy(_ node: NSNumber) -> Void {
        print("[NielsenModule] destroy triggered.")
    }

}
