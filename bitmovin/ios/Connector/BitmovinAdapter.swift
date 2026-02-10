//
//  BitmovinAdapter.swift
//

import Foundation
import THEOplayerSDK
import CoreCollector

let BTMVN_PROP_LICENSE_KEY: String = "licenseKey"
let BTMVN_PROP_RETRY_POLICY: String = "retryPolicy"
let BTMVN_PROP_RANDOMIZE_USER_ID: String = "randomizeUserId"
let BTMVN_PROP_AD_TRACKING_DISABLED: String = "adTrackingDisabled"
let BTMVN_PROP_BACKEND_URL: String = "backendUrl"
let BTMVN_PROP_SSAI_ENGAGEMENT_TRACKING_ENABLED: String = "ssaiEngagementTrackingEnabled"
let BTMVN_PROP_CDN_PROVIDER: String = "cdnProvider"
let BTMVN_PROP_CUSTOM_USER_ID: String = "customUserId"
let BTMVN_PROP_CUSTOM_DATA: String = "customData"
let BTMVN_PROP_VIDEO_ID: String = "videoId"
let BTMVN_PROP_TITLE: String = "title"
let BTMVN_PROP_PATH: String = "path"
let BTMVN_PROP_IS_LIVE: String = "isLive"

let BTMVN_RETRY_POLICY_SHORT_TERM: String = "SHORT_TERM"
let BTMVN_RETRY_POLICY_LONG_TERM: String = "LONG_TERM"

let BTMVN_DEFAULT_BACKEND_URL = "https://analytics-ingress-global.bitmovin.com"

class BitmovinAdapter {
    class func parseConfig(_ config: [String:Any]) -> AnalyticsConfig {
        
        var retryPolicy: RetryPolicy?
        if let foundRetryPolicy = config[BTMVN_PROP_RETRY_POLICY] as? String,
           foundRetryPolicy == BTMVN_RETRY_POLICY_LONG_TERM {
            retryPolicy = .longTerm
        }
        
        return AnalyticsConfig(
            licenseKey: config[BTMVN_PROP_LICENSE_KEY] as? String ?? "",
            retryPolicy: retryPolicy ?? .noRetry,
            randomizeUserId: config[BTMVN_PROP_RANDOMIZE_USER_ID] as? Bool ?? false,
            adTrackingDisabled: config[BTMVN_PROP_AD_TRACKING_DISABLED] as? Bool ?? false,
            backendUrl: config[BTMVN_PROP_BACKEND_URL] as? String ?? BTMVN_DEFAULT_BACKEND_URL,
            ssaiEngagementTrackingEnabled: config[BTMVN_PROP_SSAI_ENGAGEMENT_TRACKING_ENABLED] as? Bool ?? false,
            errorTransformerCallback: nil
        )
    }
    
    class func parseSourceMetadata(sourceMetadata: [String:Any]?, extractedSourceMetadata: [String:Any]? = nil) -> SourceMetadata {
        let videoId = (extractedSourceMetadata?[BTMVN_PROP_VIDEO_ID] as? String) ?? (sourceMetadata?[BTMVN_PROP_VIDEO_ID] as? String)
        let title = (extractedSourceMetadata?[BTMVN_PROP_TITLE] as? String) ?? (sourceMetadata?[BTMVN_PROP_TITLE] as? String)
        let path = (extractedSourceMetadata?[BTMVN_PROP_PATH] as? String) ?? sourceMetadata?[BTMVN_PROP_PATH] as? String
        let isLive = (extractedSourceMetadata?[BTMVN_PROP_IS_LIVE] as? Bool) ?? sourceMetadata?[BTMVN_PROP_IS_LIVE] as? Bool
        let cdnProvider = (extractedSourceMetadata?[BTMVN_PROP_CDN_PROVIDER] as? String) ?? sourceMetadata?[BTMVN_PROP_CDN_PROVIDER] as? String
        
        var customData = extractedSourceMetadata?[BTMVN_PROP_CUSTOM_DATA] as? [String:Any] ?? [:]
        if let sourceMetadataCustomData = sourceMetadata?[BTMVN_PROP_CUSTOM_DATA] as? [String:Any] {
            customData.merge(sourceMetadataCustomData) { (current, _) in current }
        }
        
        return SourceMetadata(
            videoId: videoId,
            title: title,
            path: path,
            isLive: isLive,
            cdnProvider: cdnProvider,
            customData: BitmovinAdapter.parseCustomData(customData)
        )
    }
    
    class func parseDefaultMetadata(_ defaultMetadata: [String:Any]?) -> DefaultMetadata {
        guard let defaultMetadataDict = defaultMetadata else {
            return DefaultMetadata(cdnProvider: nil, customUserId: nil, customData: CustomData())
        }
        
        return DefaultMetadata(
            cdnProvider: defaultMetadataDict[BTMVN_PROP_CDN_PROVIDER] as? String,
            customUserId: defaultMetadataDict[BTMVN_PROP_CUSTOM_USER_ID] as? String,
            customData: BitmovinAdapter.parseCustomData(defaultMetadataDict[BTMVN_PROP_CUSTOM_DATA] as? [String:Any])
        )
    }
    
    class func parseCustomData(_ customData: [String:Any]?) -> CustomData {
        var values = Array<String?>(repeating: nil, count: 50)
        for i in 1...50 {
            let key = "customData\(i)"
            if let value = customData?[key] as? String {
                values[i - 1] = value
            }
        }
        
        return CustomData(
            customData1: values[0],
            customData2: values[1],
            customData3: values[2],
            customData4: values[3],
            customData5: values[4],
            customData6: values[5],
            customData7: values[6],
            customData8: values[7],
            customData9: values[8],
            customData10: values[9],
            customData11: values[10],
            customData12: values[11],
            customData13: values[12],
            customData14: values[13],
            customData15: values[14],
            customData16: values[15],
            customData17: values[16],
            customData18: values[17],
            customData19: values[18],
            customData20: values[19],
            customData21: values[20],
            customData22: values[21],
            customData23: values[22],
            customData24: values[23],
            customData25: values[24],
            customData26: values[25],
            customData27: values[26],
            customData28: values[27],
            customData29: values[28],
            customData30: values[29],
            customData31: values[30],
            customData32: values[31],
            customData33: values[32],
            customData34: values[33],
            customData35: values[34],
            customData36: values[35],
            customData37: values[36],
            customData38: values[37],
            customData39: values[38],
            customData40: values[39],
            customData41: values[40],
            customData42: values[41],
            customData43: values[42],
            customData44: values[43],
            customData45: values[44],
            customData46: values[45],
            customData47: values[46],
            customData48: values[47],
            customData49: values[48],
            customData50: values[49]
            // ¯\_(ツ)_/¯
        )
    }
    
}
