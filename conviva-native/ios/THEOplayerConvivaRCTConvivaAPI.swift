
import Foundation
import UIKit
@testable import react_native_theoplayer
import THEOplayerConnectorConviva
import THEOplayerSDK

@objc(THEOplayerConvivaRCTConvivaAPI)
class THEOplayerConvivaRCTConvivaAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!
    
    var connectors = [ConvivaConnector]()
    
    static func moduleName() -> String! {
        return "ConvivaModule"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc(initialize:convivaMetadata:convivaConfig:)
    func initialize(_ node: NSNumber, convivaMetadata: NSDictionary, convivaConfig: NSDictionary) -> Void {
        print("[ConvivaModule] initialize triggered.")
        
        DispatchQueue.main.async {
            print("[ConvivaModule]", convivaConfig)
            let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView
            if let player = theView?.player {
                let configuration = ConvivaConfiguration(
                    customerKey: convivaConfig["customerKey"] as! String,
                    gatewayURL: convivaConfig["gatewayUrl"] as? String,
                    logLevel: .LOGLEVEL_FUNC
                )
                if let connector = ConvivaConnector(
                    configuration: configuration,
                    player: player
                ) {
                    self.connectors.append(connector)
                    print("[ConvivaModule] added connector to view", node)
                }
            }
        }
    }
    
    @objc(setContentInfo:metadata:)
    func setContentInfo(_ node: NSNumber, metadata: NSDictionary) -> Void {
        print("[ConvivaModule] setContentInfo triggered.")
    }
    
    @objc(setAdInfo:metadata:)
    func setAdInfo(_ node: NSNumber, metadata: NSDictionary) -> Void {
        print("[ConvivaModule] setAdInfo triggered.")
    }
    
    @objc(destroy:)
    func destroy(_ node: NSNumber) -> Void {
        print("[ConvivaModule] destroy triggered.")
    }
    
}
