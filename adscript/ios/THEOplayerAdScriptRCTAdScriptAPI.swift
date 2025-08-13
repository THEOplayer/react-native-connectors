import Foundation
import THEOplayerSDK
import UIKit
import react_native_theoplayer
import AdScriptApiClient

@objc(THEOplayerAdScriptRCTAdScriptAPI)
class THEOplayerAdScriptRCTAdScriptAPI: NSObject, RCTBridgeModule {
  @objc var bridge: RCTBridge!
  
  var connectors = [NSNumber: AdScriptConnector]()
  
  static func moduleName() -> String! {
    return "AdScriptModule"
  }
  
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  @objc(initialize:implementationId:contentMetadata:debug:)
  func initialize(
    _ node: NSNumber, implementationId: NSString, contentMetadata: NSDictionary, debug: Bool
  ) {
    log("initialize triggered.")
    
    DispatchQueue.main.async {
      if let view = self.view(for: node), let player = view.player {
        self.connectors[node] = AdScriptConnector(
          configuration: AdScriptConfiguration(implementationId: implementationId as String, debug: debug),
          player: player,
          metadata: self.buildMetadata(contentMetadata)
        )
        log("Added connector to view \(node)")
      } else {
        log("Cannot find THEOPlayer for node \(node)")
      }
    }
  }
  
  @objc(update:metadata:)
  func updateMetadata(_ node: NSNumber, metadata: NSDictionary) {
    log("updateMetadata triggered.")
    DispatchQueue.main.async {
      if let connector = self.connectors[node] {
        connector
          .update(
            metadata: self.buildMetadata(metadata)
          )
      }
    }
  }
  
  @objc(update:user:)
  func updateUser(_ node: NSNumber, user: NSArray) {
    log("updateUser triggered.")
    DispatchQueue.main.async {
      if let connector = self.connectors[node] {
        connector
          .updateUser(
            i12n: self.buildUser(user)
          )
      }
    }
  }
  
  private func buildMetadata(_ metadata: NSDictionary) -> AdScriptDataObject {
    let data = AdScriptDataObject()
    
    metadata.forEach { key, value in
      guard let keyString = key as? String,
            let stringValue = value as? String else { return }
      
      if let dataKey = AdScriptDataKey(rawValue: keyString) {
        _ = data.set(key: dataKey, value: stringValue)
      } else {
        // custom param
        _ = data.set(key: keyString, value: stringValue)
      }
    }
    return data
  }
  
  private func buildUser(_ user: NSArray) -> AdScriptI12n {
    let data = AdScriptI12n()
    for i in 0..<user.count {
      if let value = user[i] as? String {
        _ = data.set(key: i, value: value)
      }
    }
    return data
  }
  
  @objc(destroy:)
  func destroy(_ node: NSNumber) {
    log("destroy triggered.")
    DispatchQueue.main.async {
      //      self.connectors[node]?.destroy()
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
  print("[react-native-theoplayer-adscript bridge]", text)
#endif
}
