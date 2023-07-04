
import Foundation
import UIKit
import react_native_theoplayer
import THEOplayerSDK
import MuxCore
import MUXSDKStatsTHEOplayer

@objc(THEOplayerMuxRCTMuxAPI)
class THEOplayerMuxRCTMuxAPI: NSObject, RCTBridgeModule {
    @objc var bridge: RCTBridge!
    
    var connectors = [NSNumber: MUXSDKCustomerData]()
    
    static func moduleName() -> String! {
        return "MuxModule"
    }
    
    static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc(initialize:muxOptions:)
    func initialize(_ node: NSNumber, muxOptions: NSDictionary) -> Void {
        let debug = muxOptions["debug"] as? Bool ?? false
        
        if (debug) {
            log("[Mux] initialize triggered.")
        }
        
        DispatchQueue.main.async {
            let view = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView
            if let player = view?.player {
                let data = muxOptions.value(forKey: "data") as? NSDictionary
                if (data == nil) {
                    log("[Mux] no data property in muxOptions provided")
                    return
                }
                
                // environmentKey is mandatory
                if let environmentKey = data?.value(forKey: "env_key") as? String {

                    let customerData = self.buildCustomerData(environmentKey, data!)
                    
                    // Start to monitor a given THEOplayer object.
                    MUXSDKStatsTHEOplayer.monitorTHEOplayer(player, name: "THEOplayer", customerData: customerData, softwareVersion: "1.0.0", automaticErrorTracking: true)
                    self.connectors[node] = customerData
                    
                    if (debug) {
                        log("[Mux] added connector to view \(node)")
                    }
                } else {
                    log("[Mux] no environmentKey provided")
                }
            } else {
                log("[Mux] Cannot find THEOPlayer for node \(node)")
            }
        }
    }
    
    private func buildCustomerData(_ environmentKey: String, _ data: NSDictionary) -> MUXSDKCustomerData {
        let customerData = MUXSDKCustomerData()
        customerData.customerPlayerData = self.buildPlayerData(environmentKey, data)
        customerData.customerVideoData = self.buildVideoData(data)
        customerData.customerViewData = self.buildViewData(data)
        customerData.customerViewerData = self.buildViewerData(data)
        return customerData
    }
    
    private func buildPlayerData(_ environmentKey: String, _ data: NSDictionary) -> MUXSDKCustomerPlayerData {
        let muxPlayerData = MUXSDKCustomerPlayerData(environmentKey: environmentKey)!
        if let adConfigVariant = data.value(forKey: "ad_config_variant") as? String {
            muxPlayerData.adConfigVariant = adConfigVariant
        }
        if let experimentName = data.value(forKey: "experiment_name") as? String {
            muxPlayerData.experimentName = experimentName
        }
        if let pageType = data.value(forKey: "page_type") as? String {
            muxPlayerData.pageType = pageType
        }
        if let playerInitTime = data.value(forKey: "player_init_time") as? NSNumber {
            muxPlayerData.playerInitTime = playerInitTime
        }
        if let playerName = data.value(forKey: "player_name") as? String {
            muxPlayerData.playerName = playerName
        }
        if let playerVersion = data.value(forKey: "player_version") as? String {
            muxPlayerData.playerVersion = playerVersion
        }
        if let propertyKey = data.value(forKey: "property_key") as? String {
            muxPlayerData.propertyKey = propertyKey
        }
        if let subPropertyId = data.value(forKey: "sub_property_id") as? String {
            muxPlayerData.subPropertyId = subPropertyId
        }
        if let viewerUserId = data.value(forKey: "viewer_user_id") as? String {
            muxPlayerData.viewerUserId = viewerUserId
        }
        return muxPlayerData
    }
    
    private func buildVideoData(_ data: NSDictionary) -> MUXSDKCustomerVideoData {
        let muxVideoData = MUXSDKCustomerVideoData()
        if let videoCdn = data.value(forKey: "video_cdn") as? String {
            muxVideoData.videoCdn = videoCdn
        }
        if let videoContentType = data.value(forKey: "video_content_type") as? String {
            muxVideoData.videoContentType = videoContentType
        }
        if let videoDuration = data.value(forKey: "video_duration") as? NSNumber {
            muxVideoData.videoDuration = videoDuration
        }
        if let videoEncodingVariant = data.value(forKey: "video_encoding_variant") as? String {
            muxVideoData.videoEncodingVariant = videoEncodingVariant
        }
        if let videoId = data.value(forKey: "video_id") as? String {
            muxVideoData.videoId = videoId
        }
        if let videoIsLive = data.value(forKey: "video_is_live") as? NSNumber {
            muxVideoData.videoIsLive = videoIsLive
        }
        if let videoLanguageCode = data.value(forKey: "video_language_code") as? String {
            muxVideoData.videoLanguageCode = videoLanguageCode
        }
        if let videoProducer = data.value(forKey: "video_producer") as? String {
            muxVideoData.videoProducer = videoProducer
        }
        if let videoSeries = data.value(forKey: "video_series") as? String {
            muxVideoData.videoSeries = videoSeries
        }
        if let videoStreamType = data.value(forKey: "video_stream_type") as? String {
            muxVideoData.videoStreamType = videoStreamType
        }
        if let videoSeries = data.value(forKey: "video_series") as? String {
            muxVideoData.videoSeries = videoSeries
        }
        if let videoTitle = data.value(forKey: "video_title") as? String {
            muxVideoData.videoTitle = videoTitle
        }
        if let videoVariantId = data.value(forKey: "video_variant_id") as? String {
            muxVideoData.videoVariantId = videoVariantId
        }
        if let videoVariantName = data.value(forKey: "video_variant_name") as? String {
            muxVideoData.videoVariantName = videoVariantName
        }
        if let videoSourceUrl = data.value(forKey: "video_source_url") as? String {
            muxVideoData.videoSourceUrl = videoSourceUrl
        }
        if let videoExperiments = data.value(forKey: "video_experiments") as? String {
            muxVideoData.videoExperiments = videoExperiments
        }
        return muxVideoData
    }
    
    private func buildViewData(_ data: NSDictionary) -> MUXSDKCustomerViewData {
        let viewData = MUXSDKCustomerViewData()
        if let viewSessionId = data.value(forKey: "view_session_id") as? String {
            viewData.viewSessionId = viewSessionId
        }
        return viewData
    }
    
    private func buildViewerData(_ data: NSDictionary) -> MUXSDKCustomerViewerData {
        let viewerData = MUXSDKCustomerViewerData()
        if let viewerApplicationName = data.value(forKey: "viewer_application_name") as? String {
            viewerData.viewerApplicationName = viewerApplicationName
        }
        return viewerData
    }
       
    @objc(destroy:)
    func destroy(_ node: NSNumber) -> Void {
        log("[Mux] destroy triggered.")
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
