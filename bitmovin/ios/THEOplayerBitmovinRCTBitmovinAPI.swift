
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

//     var connectors = [NSNumber: BitmovinConnector]()

    static func moduleName() -> String! {
        return "BitmovinModule"
    }

    static func requiresMainQueueSetup() -> Bool {
        return false
    }

    @objc(initialize:bitmovinOptions:)
    func initialize(_ node: NSNumber, bitmovinConfig: NSDictionary) -> Void {
        log("initialize triggered.")

        /*DispatchQueue.main.async {
            log("\(bitmovinConfig)")
            let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView
            if let player = theView?.player,
			      var options = bitmovinConfig as? [String:Any] {
            }
        }*/
    }

    @objc(updateMetadata:metadata:)
    func updateMetadata(for node: NSNumber, metadata: NSDictionary) {
        log("Warning: updating metadata not possible on iOS.")
    }

    @objc(destroy:)
    func destroy(_ node: NSNumber) -> Void {
      log("destroy triggered for \(node).")
//       DispatchQueue.main.async {
//           self.connectors.removeValue(forKey: node)
//       }
    }
}
