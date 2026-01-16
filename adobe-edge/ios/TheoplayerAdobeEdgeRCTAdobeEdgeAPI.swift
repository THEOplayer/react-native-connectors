import Foundation
import UIKit
import react_native_theoplayer
import THEOplayerSDK

@objc(THEOplayerAdobeEdgeRCTAdobeEdgeAPI)
class THEOplayerAdobeEdgeRCTAdobeEdgeAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!
    
    private var debug: Bool = false
    
    var connectors = [NSNumber: AdobeEdgeConnector]()
    
    static func moduleName() -> String! {
        return "AdobeEdgeModule"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc(initialize:config:)
    func initialize(_ node: NSNumber, config: NSDictionary) -> Void {
        log("initialize triggered.")
        
        self.debug = config["debugEnabled"] as? Bool ?? false
        
        DispatchQueue.main.async {
            if let view = self.view(for: node), let player = view.player {
                let connector = AdobeEdgeConnector(player: player, trackerConfig: trackerConfig)
                let trackerConfig: [String: String] = AdobeEdgeUtils.toStringMap(config as? [String: Any] ?? [:])
                connector.setLoggingMode(self.debug ? .debug : .error)
                self.connectors[node] = connector
                self.log("added connector to view \(node)")
            } else {
                self.log("cannot find THEOPlayer for node \(node)")
            }
        }
    }
    
    @objc(setDebug:debug:)
    func setDebug(_ node: NSNumber, debug: Bool) -> Void {
        log("setDebug triggered.")
        self.debug = debug
        DispatchQueue.main.async {
            if let connector = self.connectors[node] {
                connector.setLoggingMode(debug ? .debug : .error)
            }
        }
    }
    
    @objc(updateMetadata:metadata:)
    func updateMetadata(_ node: NSNumber, metadata: [NSDictionary]) -> Void {
        log("updateMetadata triggered.")
        DispatchQueue.main.async {
            if let connector = self.connectors[node],
               let newMetadata = metadata as? [[String: Any]] {
                connector.updateMetadata(AdobeEdgeUtils.toAdobeCustomMetadataDetails(newMetadata))
            }
        }
    }
    
    @objc(setError:errorDetails:)
    func setError(_ node: NSNumber, errorDetails: [String:Any]) -> Void {
        log("setError triggered.")
        DispatchQueue.main.async {
            if let connector = self.connectors[node] {
                connector.setError(errorDetails["name"] as? String ?? "NA")
            }
        }
    }
    
    @objc(stopAndStartNewSession:customMetadataDetails:)
    func stopAndStartNewSession(_ node: NSNumber, customMetadataDetails: [NSDictionary]) -> Void {
        log("stopAndStartNewSession triggered")
        DispatchQueue.main.async {
            if let connector = self.connectors[node],
               let newMetadata = customMetadataDetails as? [[String: Any]] {
                connector.stopAndStartNewSession(AdobeEdgeUtils.toAdobeCustomMetadataDetails(newMetadata))
            }
        }
    }
    
    @objc(destroy:)
    func destroy(_ node: NSNumber) -> Void {
        log("destroy triggered.")
        DispatchQueue.main.async {
            if let connector = self.connectors[node] {
                connector.destroy()
            }
        }
    }
    
    func view(for node: NSNumber) -> THEOplayerRCTView? {
        self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView
    }
    
    func player(for node: NSNumber) -> THEOplayer? {
        view(for: node)?.player
    }
    
    func log(_ text: String) {
        if self.debug {
            print("[react-native-theoplayer-adobe-edge bridge]", text)
        }
    }
}
