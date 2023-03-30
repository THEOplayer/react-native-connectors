
import Foundation
import UIKit
import react_native_theoplayer
import THEOplayerConnectorConviva
import THEOplayerSDK
import ConvivaSDK

@objc(THEOplayerConvivaRCTConvivaAPI)
class THEOplayerConvivaRCTConvivaAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!
    
    var connectors = [NSNumber: ConvivaConnector]()
    
    static func moduleName() -> String! {
        return "ConvivaModule"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc(initialize:convivaMetadata:convivaConfig:)
    func initialize(_ node: NSNumber, convivaMetadata: NSDictionary, convivaConfig: NSDictionary) -> Void {
        log("initialize triggered.")
        
        DispatchQueue.main.async {
            log(convivaConfig.debugDescription)
            if let player = self.player(for: node) {
                let configuration = ConvivaConfiguration(
                    customerKey: convivaConfig["customerKey"] as! String,
                    gatewayURL: convivaConfig["gatewayUrl"] as? String,
                    logLevel: .LOGLEVEL_FUNC
                )
                if let connector = ConvivaConnector(
                    configuration: configuration,
                    player: player
                ) {
                    self.connectors[node] = connector
                    log("added connector to view \(node)")
                    if let contentInfo = convivaMetadata as? [String: Any] {
                        connector.videoAnalytics.setContentInfo(contentInfo)
                    } else {
                        log("Received metada in wrong format. Received \(convivaMetadata), expected [String: Any]")
                    }
                } else {
                    log("Cannot create Conviva connector for node \(node)")
                }
            } else {
                log("Cannot find THEOPlayer for node \(node)")
            }
        }
    }
    
    @objc(setContentInfo:metadata:)
    func setContentInfo(_ node: NSNumber, metadata: NSDictionary) -> Void {
        log("setContentInfo triggered.")
        DispatchQueue.main.async {
            if let connector = self.connectors[node], let contentInfo = metadata as? [String: Any] {
                connector.videoAnalytics.setContentInfo(contentInfo)
            }
        }
    }
    
    @objc(setAdInfo:metadata:)
    func setAdInfo(_ node: NSNumber, metadata: NSDictionary) -> Void {
        log("setAdInfo triggered.")
        DispatchQueue.main.async {
            if let connector = self.connectors[node], let adInfo = metadata as? [String: Any] {
                connector.adAnalytics.setAdInfo(adInfo)
            }
        }
    }
    
    @objc(stopAndStartNewSession:metadata:)
    func stopAndStartNewSession(_ node: NSNumber, metadata: NSDictionary) -> Void {
        log("stopAndStartNewSession triggered")
        DispatchQueue.main.async {
            if let connector = self.connectors[node], let contentInfo = metadata as? [String: Any], self.player(for: node)?.paused == false {
                log("reporting stopAndStartNewSession")
                connector.videoAnalytics.reportPlaybackEnded()
                connector.videoAnalytics.reportPlaybackRequested(contentInfo)
                connector.videoAnalytics.reportPlaybackMetric(CIS_SSDK_PLAYBACK_METRIC_PLAYER_STATE, value: PlayerState.CONVIVA_PLAYING.rawValue)
            }
        }
    }
    
    @objc(reportPlaybackFailed:errorDescription:)
    func reportPlaybackFailed(node: NSNumber, errorDescription: NSString) {
        log("reportPlaybackFailed triggered")
        DispatchQueue.main.async {
            if let connector = self.connectors[node] {
                log("reporting playback failed")
                connector.videoAnalytics.reportPlaybackFailed(errorDescription as String, contentInfo: nil)
            }
        }
    }
    
    @objc(destroy:)
    func destroy(_ node: NSNumber) -> Void {
        log("destroy triggered.")
        DispatchQueue.main.async {
            self.connectors.removeValue(forKey: node)
        }
    }
    
    func player(for node: NSNumber) -> THEOplayer? {
        let view = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView
        return view?.player
    }
}

func log(_ text: String) {
    #if DEBUG
        print("[react-native-theoplayer-conviva bridge]", text)
    #endif
}
