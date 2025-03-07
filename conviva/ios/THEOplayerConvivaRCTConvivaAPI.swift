
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
            if let view = self.view(for: node), let player = view.player {
                let configuration = ConvivaConfiguration(
                    customerKey: convivaConfig["customerKey"] as! String,
                    gatewayURL: convivaConfig["gatewayUrl"] as? String,
                    logLevel: .LOGLEVEL_FUNC
                )
                if let connector = ConvivaConnector( configuration: configuration, player: player, externalEventDispatcher: view.broadcastEventHandler) {
                    connector.setErrorCallback(onNativeError: view.mainEventHandler.onNativeError)
                    self.connectors[node] = connector
                    if let contentInfo = convivaMetadata as? [String: Any] {
                        connector.setContentInfo(contentInfo)
                    } else {
                        log("Received metadata in wrong format. Received \(convivaMetadata), expected [String: Any]")
                    }
                    log("Added connector to view \(node)")
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
            if let connector = self.connectors[node],
               let contentInfo = metadata as? [String: Any] {
                connector.setContentInfo(contentInfo)
            }
        }
    }

    @objc(setAdInfo:metadata:)
    func setAdInfo(_ node: NSNumber, metadata: NSDictionary) -> Void {
        log("setAdInfo triggered.")
        DispatchQueue.main.async {
            if let connector = self.connectors[node],
               let adInfo = metadata as? [String: Any] {
                connector.setAdInfo(adInfo)
            }
        }
    }

    @objc(stopAndStartNewSession:metadata:)
    func stopAndStartNewSession(_ node: NSNumber, metadata: NSDictionary) -> Void {
        log("stopAndStartNewSession triggered")
        DispatchQueue.main.async {
            if let connector = self.connectors[node],
               let contentInfo = metadata as? [String: Any],
               self.player(for: node)?.paused == false {
                log("reporting stopAndStartNewSession")
                connector.stopAndStartNewSession(contentInfo: contentInfo)
            }
        }
    }

    @objc(reportPlaybackFailed:errorDescription:)
    func reportPlaybackFailed(node: NSNumber, errorDescription: NSString) {
        log("reportPlaybackFailed triggered")
        DispatchQueue.main.async {
            if let connector = self.connectors[node] {
                log("reporting playback failed")
                connector.reportPlaybackFailed(message: errorDescription as String)
            }
        }
    }
    
    @objc(reportPlaybackEvent:eventType:eventDetail:)
    func reportPlaybackEvent(node: NSNumber, eventType: NSString, eventDetailDict: NSDictionary) {
        log("reportPlaybackEvent triggered")
        DispatchQueue.main.async {
            if let connector = self.connectors[node],
               let eventDetail = eventDetailDict as? [String:Any] {
                log("reporting custom playback event")
                connector.reportPlaybackEvent(eventType: eventType as String, eventDetail: eventDetail)
            }
        }
    }

    @objc(destroy:)
    func destroy(_ node: NSNumber) -> Void {
        log("destroy triggered.")
        DispatchQueue.main.async {
            self.connectors[node]?.destroy()
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
        print("[react-native-theoplayer-conviva bridge]", text)
    #endif
}
