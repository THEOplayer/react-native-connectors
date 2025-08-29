
import Foundation
import UIKit
import react_native_theoplayer
import THEOplayerSDK

@objc(THEOplayerAdobeRCTAdobeAPI)
class THEOplayerAdobeRCTAdobeAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!
    
    private var debug: Bool = false
    
    var connectors = [NSNumber: AdobeConnector]()
    
    static func moduleName() -> String! {
        return "AdobeModule"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc(initialize:uri:ecid:sid:trackingUrl:metadata:userAgent:debug:)
    func initialize(_ node: NSNumber, uri: String, ecid: String, sid: String, trackingUrl: String, metadata: NSDictionary?, userAgent: String?, debug: Bool = false) -> Void {
        self.debug = debug
        log("initialize triggered.")
        
        DispatchQueue.main.async {
            if let view = self.view(for: node), let player = view.player {
                let connector = AdobeConnector(
                    player: player,
                    uri: uri,
                    ecid: ecid,
                    sid: sid,
                    trackingUrl: trackingUrl,
                    metadata: AdobeMetadata().fromDict(metadata),
                    userAgent: userAgent,
                    debug: debug
                )
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
        
        if let connector = self.connectors[node] {
            connector.setDebug(debug)
        }
    }
    
    @objc(updateMetadata:metadata:)
    func updateMetadata(_ node: NSNumber, metadata: NSDictionary) -> Void {
        log("updateMetadata triggered.")
        
        if let connector = self.connectors[node] {
            connector.updateMetadata(AdobeMetadata().fromDict(metadata))
        }
    }
    
    @objc(setError:metadata:)
    func setError(_ node: NSNumber, metadata: NSDictionary) -> Void {
        log("setError triggered.")
        
        if let connector = self.connectors[node] {
            connector.setError(AdobeMetadata().fromDict(metadata))
        }
    }
    
    @objc(stopAndStartNewSession:metadata:)
    func stopAndStartNewSession(_ node: NSNumber, metadata: NSDictionary) -> Void {
        log("stopAndStartNewSession triggered")
        
        if let connector = self.connectors[node] {
            connector.stopAndStartNewSession(AdobeMetadata().fromDict(metadata))
        }
    }
    
    @objc(destroy:)
    func destroy(_ node: NSNumber) -> Void {
        log("destroy triggered.")
        
        if let connector = self.connectors[node] {
            connector.destroy()
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
            print("[react-native-theoplayer-adobe bridge]", text)
        }
    }
}
