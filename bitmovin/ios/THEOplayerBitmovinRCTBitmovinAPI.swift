
import Foundation
import UIKit
import react_native_theoplayer
import THEOplayerSDK

func log(_ text: String) {
#if DEBUG
    print("[react-native-theoplayer-bitmovin]", text)
#endif
}

@objc(THEOplayerBitmovinRCTBitmovinAPI)
class THEOplayerBitmovinRCTBitmovinAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!
    
    var connectors = [NSNumber: BitmovinConnector]()
    
    static func moduleName() -> String! {
        return "BitmovinModule"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc(initialize:bitmovinConfig:defaultMetadata:)
    func initialize(_ node: NSNumber, bitmovinConfig: NSDictionary, defaultMetadata: NSDictionary?) -> Void {
        log("initialize triggered.")
        
        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView
            if let player = theView?.player,
               let config = bitmovinConfig as? [String:Any] {
                let metadata = defaultMetadata as? [String:Any]
                let connector = BitmovinConnector(player: player, bitmovinConfig: config, defaultMetadata: metadata)
                self.connectors[node] = connector
                log("added connector to view \(node)")
            } else {
                log("cannot find THEOPlayer for node \(node)")
            }
        }
    }
    
    @objc(updateSourceMetadata:metadata:)
    func updateSourceMetadata(_ node: NSNumber, metadata: NSDictionary) {
        log("updateSourceMetadata triggered.")
        DispatchQueue.main.async {
            if let sourceMetadata = metadata as? [String:Any] {
                self.connectors[node]?.updateSourceMetadata(sourceMetadata)
            }
        }
    }
    
    @objc(updateCustomMetadata:customData:)
    func updateCustomMetadata(_ node: NSNumber, customData: NSDictionary) {
        log("updateCustomMetadata triggered.")
        DispatchQueue.main.async {
            if let customMetadata = customData as? [String:Any] {
                self.connectors[node]?.updateCustomMetadata(customMetadata)
            }
        }
    }
    
    @objc(sendCustomDataEvent:customData:)
    func sendCustomDataEvent(_ node: NSNumber, customData: NSDictionary) {
        log("sendCustomDataEvent triggered.")
        DispatchQueue.main.async {
            if let customMetadata = customData as? [String:Any] {
                self.connectors[node]?.sendCustomDataEvent(customMetadata)
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
