
import Foundation
import UIKit
import react_native_theoplayer
import THEOplayerSDK
import MuxCore
import MuxStatsTHEOplayer

let PROP_DATA = "data"
let PROP_ENVIRONMENT_KEY = "env_key"

let PROP_PLAYER_NAME = "player_name"
let PROP_PLAYER_VERSION = "player_version"
let PROP_PLAYER_INIT_TIME = "player_init_time"
let PROP_AD_CONFIG_VARIANT = "ad_config_variant"
let PROP_EXPERIMENT_NAME = "experiment_name"
let PROP_PAGE_TYPE = "page_type"
let PROP_PROPERTY_KEY = "property_key"
let PROP_SUBPROPERTY_ID = "sub_property_id"
let PROP_VIEWER_USER_ID = "viewer_user_id"

let PROP_VIDEO_ID = "video_id"
let PROP_VIDEO_CDN = "video_cdn"
let PROP_VIDEO_DURATION = "video_duration"
let PROP_VIDEO_IS_LIVE = "video_is_live"
let PROP_VIDEO_EXPERIMENTS = "video_experiments"
let PROP_VIDEO_CONTENT_TYPE = "video_content_type"
let PROP_VIDEO_ENCODING_VARIANT = "video_encoding_variant"
let PROP_VIDEO_LANGUAGE_CODE = "video_language_code"
let PROP_VIDEO_PRODUCER = "video_producer"
let PROP_VIDEO_SERIES = "video_series"
let PROP_VIDEO_SOURCE_URL = "video_source_url"
let PROP_VIDEO_STREAM_TYPE = "video_stream_type"
let PROP_VIDEO_TITLE = "video_title"
let PROP_VIDEO_VARIANT_ID = "video_variant_id"
let PROP_VIDEO_VARIANT_NAME = "video_variant_name"

let PROP_VIEW_SESSION_ID = "view_session_id"

let PROP_VIEWER_APPLICATION_NAME = "viewer_application_name"

let PROP_CUSTOM_DATA1 = "custom_1"
let PROP_CUSTOM_DATA2 = "custom_2"
let PROP_CUSTOM_DATA3 = "custom_3"
let PROP_CUSTOM_DATA4 = "custom_4"
let PROP_CUSTOM_DATA5 = "custom_5"

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
        log("[Mux] initialize triggered.")
        
        DispatchQueue.main.async {
            let view = self.bridge.uiManager.view(forReactTag: node) as? THEOplayerRCTView
            if let player = view?.player {
                let data = muxOptions.value(forKey: PROP_DATA) as? NSDictionary
                if (data == nil) {
                    log("[Mux] no data property in muxOptions provided")
                    return
                }
                // environmentKey is mandatory
                if (data?.object(forKey: PROP_ENVIRONMENT_KEY) == nil) {
                    log("[Mux] no environmentKey provided")
                    return
                }
                let customerData = self.buildCustomerData(data!)
                let name = self.buildPlayerName(node)
                
                // Start to monitor a given THEOplayer object.
                MUXSDKStatsTHEOplayer.monitorTHEOplayer(player, name: name, customerData: customerData, softwareVersion: THEOplayer.version, automaticErrorTracking: true)
                self.connectors[node] = customerData
                
                log("[Mux] added connector to view \(node)")
            } else {
                log("[Mux] Cannot find THEOPlayer for node \(node)")
            }
        }
    }
    
    @objc(changeProgram:data:)
    func changeProgram(_ node: NSNumber, data: NSDictionary) -> Void {
        log("[Mux] changeProgram not available.")
        // Note: not available in iOS connector.
    }
    
    @objc(changeVideo:data:)
    func changeVideo(_ node: NSNumber, data: NSDictionary) -> Void {
        log("[Mux] changeVideo triggered.")
        DispatchQueue.main.async {
            MUXSDKStatsTHEOplayer.videoChangeForPlayer(name: self.buildPlayerName(node), customerData: self.buildCustomerData(data))
        }
    }
    
    @objc(notifyError:code:message:context:)
    func notifyError(_ node: NSNumber, code: NSNumber, message: NSString, context: NSString) -> Void {
        log("[Mux] notifyError triggered.")
        DispatchQueue.main.async {
            MUXSDKStatsTHEOplayer.dispatchError(name: "ReactNativeTHEOplayer", code: code.stringValue, message: message as String)
        }
    }
    
    private func buildPlayerName(_ node: NSNumber) -> String {
        return  String(format: "%@%d", "ReactNativeTHEOplayer", node)
    }
    
    private func buildCustomerData(_ data: NSDictionary) -> MUXSDKCustomerData {
        let customerData = MUXSDKCustomerData()
        customerData.customerPlayerData = self.buildPlayerData(data)
        customerData.customerVideoData = self.buildVideoData(data)
        customerData.customerViewData = self.buildViewData(data)
        customerData.customerViewerData = self.buildViewerData(data)
        customerData.customData = self.buildCustomData(data)
        return customerData
    }
    
    private func buildPlayerData(_ data: NSDictionary) -> MUXSDKCustomerPlayerData {
        let muxPlayerData = MUXSDKCustomerPlayerData()
        if let environmentKey = data.value(forKey: PROP_ENVIRONMENT_KEY) as? String {
            muxPlayerData.environmentKey = environmentKey
        }
        if let adConfigVariant = data.value(forKey: PROP_AD_CONFIG_VARIANT) as? String {
            muxPlayerData.adConfigVariant = adConfigVariant
        }
        if let experimentName = data.value(forKey: PROP_EXPERIMENT_NAME) as? String {
            muxPlayerData.experimentName = experimentName
        }
        if let pageType = data.value(forKey: PROP_PAGE_TYPE) as? String {
            muxPlayerData.pageType = pageType
        }
        if let playerInitTime = data.value(forKey: PROP_PLAYER_INIT_TIME) as? NSNumber {
            muxPlayerData.playerInitTime = playerInitTime
        }
        if let playerName = data.value(forKey: PROP_PLAYER_NAME) as? String {
            muxPlayerData.playerName = playerName
        }
        if let playerVersion = data.value(forKey: PROP_PLAYER_VERSION) as? String {
            muxPlayerData.playerVersion = playerVersion
        }
        if let propertyKey = data.value(forKey: PROP_PROPERTY_KEY) as? String {
            muxPlayerData.propertyKey = propertyKey
        }
        if let subPropertyId = data.value(forKey: PROP_SUBPROPERTY_ID) as? String {
            muxPlayerData.subPropertyId = subPropertyId
        }
        if let viewerUserId = data.value(forKey: PROP_VIEWER_USER_ID) as? String {
            muxPlayerData.viewerUserId = viewerUserId
        }
        return muxPlayerData
    }
    
    private func buildVideoData(_ data: NSDictionary) -> MUXSDKCustomerVideoData {
        let muxVideoData = MUXSDKCustomerVideoData()
        if let videoCdn = data.value(forKey: PROP_VIDEO_CDN) as? String {
            muxVideoData.videoCdn = videoCdn
        }
        if let videoContentType = data.value(forKey: PROP_VIDEO_CONTENT_TYPE) as? String {
            muxVideoData.videoContentType = videoContentType
        }
        if let videoDuration = data.value(forKey: PROP_VIDEO_DURATION) as? NSNumber {
            muxVideoData.videoDuration = videoDuration
        }
        if let videoEncodingVariant = data.value(forKey: PROP_VIDEO_ENCODING_VARIANT) as? String {
            muxVideoData.videoEncodingVariant = videoEncodingVariant
        }
        if let videoId = data.value(forKey: PROP_VIDEO_ID) as? String {
            muxVideoData.videoId = videoId
        }
        if let videoIsLive = data.value(forKey: PROP_VIDEO_IS_LIVE) as? NSNumber {
            muxVideoData.videoIsLive = videoIsLive
        }
        if let videoLanguageCode = data.value(forKey: PROP_VIDEO_LANGUAGE_CODE) as? String {
            muxVideoData.videoLanguageCode = videoLanguageCode
        }
        if let videoProducer = data.value(forKey: PROP_VIDEO_PRODUCER) as? String {
            muxVideoData.videoProducer = videoProducer
        }
        if let videoSeries = data.value(forKey: PROP_VIDEO_SERIES) as? String {
            muxVideoData.videoSeries = videoSeries
        }
        if let videoStreamType = data.value(forKey: PROP_VIDEO_STREAM_TYPE) as? String {
            muxVideoData.videoStreamType = videoStreamType
        }
        if let videoTitle = data.value(forKey: PROP_VIDEO_TITLE) as? String {
            muxVideoData.videoTitle = videoTitle
        }
        if let videoVariantId = data.value(forKey: PROP_VIDEO_VARIANT_ID) as? String {
            muxVideoData.videoVariantId = videoVariantId
        }
        if let videoVariantName = data.value(forKey: PROP_VIDEO_VARIANT_NAME) as? String {
            muxVideoData.videoVariantName = videoVariantName
        }
        if let videoSourceUrl = data.value(forKey: PROP_VIDEO_SOURCE_URL) as? String {
            muxVideoData.videoSourceUrl = videoSourceUrl
        }
        if let videoExperiments = data.value(forKey: PROP_VIDEO_EXPERIMENTS) as? String {
            muxVideoData.videoExperiments = videoExperiments
        }
        return muxVideoData
    }
    
    private func buildViewData(_ data: NSDictionary) -> MUXSDKCustomerViewData {
        let viewData = MUXSDKCustomerViewData()
        if let viewSessionId = data.value(forKey: PROP_VIEW_SESSION_ID) as? String {
            viewData.viewSessionId = viewSessionId
        }
        return viewData
    }
    
    private func buildViewerData(_ data: NSDictionary) -> MUXSDKCustomerViewerData {
        let viewerData = MUXSDKCustomerViewerData()
        if let viewerApplicationName = data.value(forKey: PROP_VIEWER_APPLICATION_NAME) as? String {
            viewerData.viewerApplicationName = viewerApplicationName
        }
        return viewerData
    }
    
    private func buildCustomData(_ data: NSDictionary) -> MUXSDKCustomData {
        let customData = MUXSDKCustomData()
        if let customData1 = data.value(forKey: PROP_CUSTOM_DATA1) as? String {
            customData.customData1 = customData1
        }
        if let customData2 = data.value(forKey: PROP_CUSTOM_DATA2) as? String {
            customData.customData2 = customData2
        }
        if let customData3 = data.value(forKey: PROP_CUSTOM_DATA3) as? String {
            customData.customData3 = customData3
        }
        if let customData4 = data.value(forKey: PROP_CUSTOM_DATA4) as? String {
            customData.customData4 = customData4
        }
        if let customData5 = data.value(forKey: PROP_CUSTOM_DATA5) as? String {
            customData.customData5 = customData5
        }
        return customData
    }
       
    @objc(destroy:)
    func destroy(_ node: NSNumber) -> Void {
        log("[Mux] destroy triggered.")
        DispatchQueue.main.async {
            MUXSDKStatsTHEOplayer.destroyPlayer(name: self.buildPlayerName(node))
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
