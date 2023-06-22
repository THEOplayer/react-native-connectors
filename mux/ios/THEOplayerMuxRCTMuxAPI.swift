
import Foundation
import UIKit
import react_native_theoplayer
import THEOplayerConnectorMux
import THEOplayerSDK
import MuxSDK

@objc(THEOplayerMuxRCTMuxAPI)
class THEOplayerMuxRCTMuxAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!
    
    var connectors = [NSNumber: ConnectorWithVpfHandler]()
    
    static func moduleName() -> String! {
        return "MuxModule"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc(initialize:muxMetadata:muxConfig:)
    func initialize(_ node: NSNumber, muxMetadata: NSDictionary, muxConfig: NSDictionary) -> Void {
        log("initialize triggered.")
        
        DispatchQueue.main.async {
            log(muxConfig.debugDescription)
            if let view = self.view(for: node), let player = view.player, let sendError = view.mainEventHandler.onNativeError {
                let configuration = MuxConfiguration(
                    customerKey: muxConfig["customerKey"] as! String,
                    gatewayURL: muxConfig["gatewayUrl"] as? String,
                    logLevel: .LOGLEVEL_FUNC
                )
                if let connector = MuxConnector(
                    configuration: configuration,
                    player: player
                ) {
                    let extendedConnector = ConnectorWithVpfHandler(connector: connector, sendError: sendError) // TODO: Remove when THEOplayer correctly handles VPFs
                    self.connectors[node] = extendedConnector
                    log("added connector to view \(node)")
                    if let contentInfo = muxMetadata as? [String: Any] {
                        connector.videoAnalytics.setContentInfo(contentInfo)
                    } else {
                        log("Received metada in wrong format. Received \(muxMetadata), expected [String: Any]")
                    }
                } else {
                    log("Cannot create Mux connector for node \(node)")
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
            if let extendedConnector = self.connectors[node]?.base, let contentInfo = metadata as? [String: Any] {
                extendedConnector.videoAnalytics.setContentInfo(contentInfo)
            }
        }
    }
    
    @objc(setAdInfo:metadata:)
    func setAdInfo(_ node: NSNumber, metadata: NSDictionary) -> Void {
        log("setAdInfo triggered.")
        DispatchQueue.main.async {
            if let connector = self.connectors[node]?.base, let adInfo = metadata as? [String: Any] {
                connector.adAnalytics.setAdInfo(adInfo)
            }
        }
    }
    
    @objc(stopAndStartNewSession:metadata:)
    func stopAndStartNewSession(_ node: NSNumber, metadata: NSDictionary) -> Void {
        log("stopAndStartNewSession triggered")
        DispatchQueue.main.async {
            if let connector = self.connectors[node]?.base, let contentInfo = metadata as? [String: Any], self.player(for: node)?.paused == false {
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
            if let connector = self.connectors[node]?.base {
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
    
    func view(for node: NSNumber) -> THEOplayerRCTView? {
        self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView
    }
    
    func player(for node: NSNumber) -> THEOplayer? {
        view(for: node)?.player
    }
}

func log(_ text: String) {
    #if DEBUG
        print("[react-native-theoplayer-mux bridge]", text)
    #endif
}
