
import Foundation
import UIKit
import react_native_theoplayer
import THEOplayerSDK
import YouboraTHEOPlayerAdapter
import YouboraLib

func log(_ text: String) {
    #if DEBUG
        print("[react-native-theoplayer-youbora]", text)
    #endif
}

@objc(THEOplayerYouboraRCTYouboraAPI)
class THEOplayerYouboraRCTYouboraAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!

    var connectors = [NSNumber: YBPlugin]()

    static func moduleName() -> String! {
        return "YouboraModule"
    }

    static func requiresMainQueueSetup() -> Bool {
        return false
    }

    @objc(initialize:youboraOptions:logLevel:)
    func initialize(_ node: NSNumber, youboraOptions: NSDictionary, logLevel: NSNumber) -> Void {
        log("initialize triggered.")

        DispatchQueue.main.async {
            let theView = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView
            if let player = theView?.player {
                let options = YBOptions.fromDictionary(youboraOptions)
                let plugin = YBPlugin(options: options)
                plugin.adapter = YBTHEOPlayerAdapter(player: player)
                self.connectors[node] = plugin
            }
        }
    }
    
    private func parseDebugLevel(logLevel: Int?) -> YBLogLevel {
        guard let level = logLevel else {
            return YBLogLevel.silent
        }
        switch level {
        case 1:
            return YBLogLevel.verbose
        case 2:
            return YBLogLevel.debug
        case 3:
            return YBLogLevel.notice
        case 4:
            return YBLogLevel.warning
        case 5:
            return YBLogLevel.error
        default:
            return YBLogLevel.silent
        }
    }
    
    @objc(setDebugLevel:)
    func setDebugLevel(level: NSNumber) -> Void {
        log("setDebugLevel triggered: \(level).")
        YBLog.setDebugLevel(self.parseDebugLevel(logLevel: level.intValue))
    }

    @objc(destroy:)
    func destroy(_ node: NSNumber) -> Void {
        log("destroy triggered for \(node).")
		DispatchQueue.main.async {
            if let plugin = self.connectors[node] {
                plugin.fireStop()
                plugin.removeAdapter()
                plugin.removeAdsAdapter()
            }
		    self.connectors.removeValue(forKey: node)
		}
    }
}
