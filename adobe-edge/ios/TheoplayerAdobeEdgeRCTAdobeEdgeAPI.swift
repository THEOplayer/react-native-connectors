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
  
  @objc(initialize:baseUrl:configId:userAgent:debug:debugSessionId:)
  func initialize(_ node: NSNumber, baseUrl: String, configId: String, userAgent: String?, debug: Bool = false, debugSessionId: String?) -> Void {
    self.debug = debug
    log("initialize triggered.")
    
    DispatchQueue.main.async {
      if let view = self.view(for: node), let player = view.player {
        let connector = AdobeEdgeConnector(
          player: player,
          baseUrl: baseUrl,
          configId: configId,
          userAgent: userAgent,
          debug: debug,
          debugSessionId: debugSessionId
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
  
  @objc(setDebugSessionId:id:)
  func setDebugSessionId(_ node: NSNumber, id: String?) -> Void {
    log("setDebugSessionId triggered.")
    
    if let connector = self.connectors[node] {
      connector.setDebugSessionId(id)
    }
  }
  
  @objc(updateMetadata:metadata:)
  func updateMetadata(_ node: NSNumber, metadataList: [[String: Any]]) -> Void {
    log("updateMetadata triggered.")
    
    if let connector = self.connectors[node] {
      connector.updateMetadata(
        metadataList.flatMap { dict in
          dict.map { (key, value) in
            AdobeCustomMetadataDetails(
              name: key,
              value: "\(value)"
            )
          }
        }
      )
    }
  }
  
  @objc(setError:errorDetails:)
  func setError(_ node: NSNumber, errorDetails: [String:Any]) -> Void {
    log("setError triggered.")
    
    if let connector = self.connectors[node] {
      connector.setError(
        AdobeErrorDetails(
          name: errorDetails["name"] as? String ?? "",
          source: (errorDetails["source"] as? String ?? "") == "player" ? .player : .external
        )
      )
    }
  }
  
  @objc(stopAndStartNewSession:customMetadataDetails:)
  func stopAndStartNewSession(_ node: NSNumber, customMetadataDetails: [[String: Any]]) -> Void {
    log("stopAndStartNewSession triggered")
    
    if let connector = self.connectors[node] {
      connector.stopAndStartNewSession(
        customMetadataDetails.flatMap { dict in
          dict.map { (key, value) in
            AdobeCustomMetadataDetails(
              name: key,
              value: "\(value)"
            )
          }
        }
      )
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
      print("[react-native-theoplayer-adobe-edge bridge]", text)
    }
  }
}
