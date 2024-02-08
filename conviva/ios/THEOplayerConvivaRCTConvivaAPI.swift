
import Foundation
import UIKit
import react_native_theoplayer
import THEOplayerConnectorConviva
import THEOplayerSDK
import ConvivaSDK

@objc(THEOplayerConvivaRCTConvivaAPI)
class THEOplayerConvivaRCTConvivaAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!

    var connectors = [NSNumber: ConnectorWithVpfHandler]()

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
            if let view = self.view(for: node), let player = view.player, let sendError = view.mainEventHandler.onNativeError {
                let configuration = ConvivaConfiguration(
                    customerKey: convivaConfig["customerKey"] as! String,
                    gatewayURL: convivaConfig["gatewayUrl"] as? String,
                    logLevel: .LOGLEVEL_FUNC
                )
                if let connector = ConvivaConnector(
                    configuration: configuration,
                    player: player,
                    externalEventDispatcher: view.broadcastEventHandler
                ) {
                    let extendedConnector = ConnectorWithVpfHandler(connector: connector, sendError: sendError) // TODO: Remove when THEOplayer correctly handles VPFs
                    self.connectors[node] = extendedConnector
                    log("added connector to view \(node)")
                    if let contentInfo = convivaMetadata as? [String: Any] {
                        connector.videoAnalytics.setContentInfo(contentInfo)
                    } else {
                        log("Received metadata in wrong format. Received \(convivaMetadata), expected [String: Any]")
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
            if let extendedConnector = self.connectors[node]?.base, let contentInfo = metadata as? [String: Any] {
                extendedConnector.videoAnalytics.setContentInfo(contentInfo)
				if let assetName = contentInfo[CIS_SSDK_METADATA_ASSET_NAME] as? String {
				    extendedConnector.storage.storeKeyValuePair(key: CIS_SSDK_METADATA_ASSET_NAME, value: assetName)
				}
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
                if let bitrate = connector.storage.valueForKey(CIS_SSDK_PLAYBACK_METRIC_BITRATE) as? NSNumber {
                    connector.videoAnalytics.reportPlaybackMetric(CIS_SSDK_PLAYBACK_METRIC_BITRATE, value: bitrate)
                }
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
        print("[react-native-theoplayer-conviva bridge]", text)
    #endif
}
