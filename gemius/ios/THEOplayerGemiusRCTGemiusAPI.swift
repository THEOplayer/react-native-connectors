import Foundation
import THEOplayerSDK
import UIKit
import react_native_theoplayer
import GemiusSDK

@objc(THEOplayerGemiusRCTGemiusAPI)
class THEOplayerGemiusRCTGemiusAPI: NSObject, RCTBridgeModule {
  @objc var bridge: RCTBridge!
  
  var connectors = [NSNumber: GemiusConnector]()
  
  static func moduleName() -> String! {
    return "GemiusModule"
  }
  
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  @objc(initialize:gemiusConfig:)
  func initialize(
    _ node: NSNumber, gemiusConfig: NSDictionary
  ) {
    log("initialize triggered.")
    
    DispatchQueue.main.async {
      log(gemiusConfig.debugDescription)
      if let view = self.view(for: node), let player = view.player {
        let configuration = GemiusConfiguration(
          applicationName: gemiusConfig["applicationName"] as! String,
          applicationVersion: gemiusConfig["applicationVersion"] as! String,
          hitCollectorHost: gemiusConfig["hitCollectorHost"] as! String,
          gemiusId: gemiusConfig["gemiusId"] as! String,
          debug: gemiusConfig["debug"] as? Bool ?? false
        )
        self.connectors[node] = GemiusConnector(
          configuration: configuration,
          player: player
        )
        log("Added connector to view \(node)")
      } else {
        log("Cannot find THEOPlayer for node \(node)")
      }
    }
  }
  
  @objc(update:programId:metadata:)
  func update(_ node: NSNumber, programId: NSString, metadata: NSDictionary) {
    log("setContentInfo triggered.")
    DispatchQueue.main.async {
      if let connector = self.connectors[node] {
        connector
          .update(
            programId: programId as String,
            programData: self.buildProgramData(metadata)
          )
      }
    }
  }
  
  private func buildProgramData(_ metadata: NSDictionary) -> GemiusSDK.GSMProgramData {
    let data = GemiusSDK.GSMProgramData()
    
    metadata.forEach { key, value in
      guard let key = key as? String else { return }
      
      switch key {
      case "name":
        data.name = value as? String
      case "duration":
        data.duration = value as? NSNumber
      case "transmission":
        data.transmission = value as? String
      case "quality":
        data.quality = value as? String
      case "resolution":
        data.resolution = value as? String
      case "volume":
        data.volume = value as? NSNumber
      case "externalPremiereDate":
        data.externalPremiereDate = value as? String
      case "premiereDate":
        data.premiereDate = value as? String
      case "series":
        data.series = value as? String
      case "programType":
        if let num = value as? NSNumber {
          data.programType = buildProgramType(num)
        }
      case "typology":
        data.typology = value as? String
      case "programGenre":
        if let num = value as? NSNumber {
          data.programGenre = buildProgramGenre(num)
        }
      case "programPartialName":
        data.programPartialName = value as? String
      case "programProducer":
        data.programProducer = value as? String
      case "programThematicCategory":
        data.programThematicCategory = value as? String
      case "programSeason":
        data.programSeason = value as? String
      case "transmissionChannel":
        data.transmissionChannel = value as? String
      case "transmissionStartTime":
        data.transmissionStartTime = value as? String
      case "transmissionType":
        if let num = value as? NSNumber {
          data.transmissionType = buildTransmissionType(num)
        }
      default:
        // Assume any other field is a custom parameter
        if let strVal = value as? String {
          data.addCustomParameter(key, value: strVal)
        }
      }
    }
    
    return data
  }
  
  
  private func buildProgramType(_ type: NSNumber) -> GemiusSDK.GSMProgramType {
    return GemiusSDK.GSMProgramType(rawValue: type.intValue) ?? .VIDEO
  }
  
  private func buildProgramGenre(_ genre: NSNumber) -> GemiusSDK.GSMProgramGenre {
    return GemiusSDK.GSMProgramGenre(rawValue: genre.intValue) ?? .undefined
  }
  
  private func buildTransmissionType(_ type: NSNumber) -> GemiusSDK.GSMTransmissionType {
    return GemiusSDK.GSMTransmissionType(rawValue: type.intValue) ?? .undefined
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
  print("[react-native-theoplayer-gemius bridge]", text)
#endif
}
