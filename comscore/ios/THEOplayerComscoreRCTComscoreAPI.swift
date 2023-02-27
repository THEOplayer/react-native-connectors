
import Foundation
import UIKit
@testable import react_native_theoplayer
import THEOplayerConnectorComscore
import THEOplayerSDK

@objc(THEOplayerComscoreRCTComscoreAPI)
class THEOplayerComscoreRCTComscoreAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!

    var connectors = [ComscoreConnector]()

    static func moduleName() -> String! {
        return "ComscoreModule"
    }

    static func requiresMainQueueSetup() -> Bool {
        return false
    }

    @objc(initialize:ComscoreMetadata:ComscoreConfig:)
    func initialize(_ node: NSNumber, ComscoreMetadata: NSDictionary, ComscoreConfig: NSDictionary) -> Void {
        print("[ComscoreModule] initialize triggered.")

        DispatchQueue.main.async {
            print("[ComscoreModule]", ComscoreConfig)
            let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView
            if let player = theView?.player {
                let configuration = ComscoreConfiguration(
                    customerKey: ComscoreConfig["customerKey"] as! String,
                    gatewayURL: ComscoreConfig["gatewayUrl"] as? String,
                    logLevel: .LOGLEVEL_FUNC
                )
                if let connector = ComscoreConnector(
                    configuration: configuration,
                    player: player
                ) {
                    self.connectors.append(connector)
                    print("[ComscoreModule] added connector to view", node)
                }
            }
        }
    }

    @objc(setContentInfo:metadata:)
    func setContentInfo(_ node: NSNumber, metadata: NSDictionary) -> Void {
        print("[ComscoreModule] setContentInfo triggered.")
    }

    @objc(setAdInfo:metadata:)
    func setAdInfo(_ node: NSNumber, metadata: NSDictionary) -> Void {
        print("[ComscoreModule] setAdInfo triggered.")
    }

    @objc(destroy:)
    func destroy(_ node: NSNumber) -> Void {
        print("[ComscoreModule] destroy triggered.")
    }

}
