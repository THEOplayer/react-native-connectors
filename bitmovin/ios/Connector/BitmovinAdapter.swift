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
        var values = Array<String?>(repeating: nil, count: 100)
        // Note: output CustomData uses 1-based keys
        for i in 1...100 {
            let key = "customData\(i)"
            if let value = customData?[key] as? String {
                values[i - 1] = value
            }
        }
        
        return CustomData(
            customData1:  values[0],  customData2:  values[1],  customData3:  values[2],  customData4:  values[3],  customData5:  values[4],
            customData6:  values[5],  customData7:  values[6],  customData8:  values[7],  customData9:  values[8],  customData10: values[9],
            customData11: values[10], customData12: values[11], customData13: values[12], customData14: values[13], customData15: values[14],
            customData16: values[15], customData17: values[16], customData18: values[17], customData19: values[18], customData20: values[19],
            customData21: values[20], customData22: values[21], customData23: values[22], customData24: values[23], customData25: values[24],
            customData26: values[25], customData27: values[26], customData28: values[27], customData29: values[28], customData30: values[29],
            customData31: values[30], customData32: values[31], customData33: values[32], customData34: values[33], customData35: values[34],
            customData36: values[35], customData37: values[36], customData38: values[37], customData39: values[38], customData40: values[39],
            customData41: values[40], customData42: values[41], customData43: values[42], customData44: values[43], customData45: values[44],
            customData46: values[45], customData47: values[46], customData48: values[47], customData49: values[48], customData50: values[49],
            customData51: values[50], customData52: values[51], customData53: values[52], customData54: values[53], customData55: values[54],
            customData56: values[55], customData57: values[56], customData58: values[57], customData59: values[58], customData60: values[69],
            customData61: values[60], customData62: values[61], customData63: values[62], customData64: values[63], customData65: values[64],
            customData66: values[65], customData67: values[66], customData68: values[67], customData69: values[68], customData70: values[79],
            customData71: values[70], customData72: values[71], customData73: values[72], customData74: values[73], customData75: values[74],
            customData76: values[75], customData77: values[76], customData78: values[77], customData79: values[78], customData80: values[89],
            customData81: values[80], customData82: values[81], customData83: values[82], customData84: values[83], customData85: values[84],
            customData86: values[85], customData87: values[86], customData88: values[87], customData89: values[88], customData90: values[99],
            customData91: values[90], customData92: values[91], customData93: values[92], customData94: values[93], customData95: values[94],
            customData96: values[95], customData97: values[96], customData98: values[97], customData99: values[98], customData100: values[99])
            // ¯\_(ツ)_/¯
    }
    
    class func mergeCustomData(existingCustomData: CustomData, newCustomData: CustomData) -> CustomData {
        return CustomData(
            customData1:  newCustomData.customData1  ?? existingCustomData.customData1,
            customData2:  newCustomData.customData2  ?? existingCustomData.customData2,
            customData3:  newCustomData.customData3  ?? existingCustomData.customData3,
            customData4:  newCustomData.customData4  ?? existingCustomData.customData4,
            customData5:  newCustomData.customData5  ?? existingCustomData.customData5,
            customData6:  newCustomData.customData6  ?? existingCustomData.customData6,
            customData7:  newCustomData.customData7  ?? existingCustomData.customData7,
            customData8:  newCustomData.customData8  ?? existingCustomData.customData8,
            customData9:  newCustomData.customData9  ?? existingCustomData.customData9,
            customData10: newCustomData.customData10 ?? existingCustomData.customData10,
            customData11: newCustomData.customData11 ?? existingCustomData.customData11,
            customData12: newCustomData.customData12 ?? existingCustomData.customData12,
            customData13: newCustomData.customData13 ?? existingCustomData.customData13,
            customData14: newCustomData.customData14 ?? existingCustomData.customData14,
            customData15: newCustomData.customData15 ?? existingCustomData.customData15,
            customData16: newCustomData.customData16 ?? existingCustomData.customData16,
            customData17: newCustomData.customData17 ?? existingCustomData.customData17,
            customData18: newCustomData.customData18 ?? existingCustomData.customData18,
            customData19: newCustomData.customData19 ?? existingCustomData.customData19,
            customData20: newCustomData.customData20 ?? existingCustomData.customData20,
            customData21: newCustomData.customData21 ?? existingCustomData.customData21,
            customData22: newCustomData.customData22 ?? existingCustomData.customData22,
            customData23: newCustomData.customData23 ?? existingCustomData.customData23,
            customData24: newCustomData.customData24 ?? existingCustomData.customData24,
            customData25: newCustomData.customData25 ?? existingCustomData.customData25,
            customData26: newCustomData.customData26 ?? existingCustomData.customData26,
            customData27: newCustomData.customData27 ?? existingCustomData.customData27,
            customData28: newCustomData.customData28 ?? existingCustomData.customData28,
            customData29: newCustomData.customData29 ?? existingCustomData.customData29,
            customData30: newCustomData.customData30 ?? existingCustomData.customData30,
            customData31: newCustomData.customData31 ?? existingCustomData.customData31,
            customData32: newCustomData.customData32 ?? existingCustomData.customData32,
            customData33: newCustomData.customData33 ?? existingCustomData.customData33,
            customData34: newCustomData.customData34 ?? existingCustomData.customData34,
            customData35: newCustomData.customData35 ?? existingCustomData.customData35,
            customData36: newCustomData.customData36 ?? existingCustomData.customData36,
            customData37: newCustomData.customData37 ?? existingCustomData.customData37,
            customData38: newCustomData.customData38 ?? existingCustomData.customData38,
            customData39: newCustomData.customData39 ?? existingCustomData.customData39,
            customData40: newCustomData.customData40 ?? existingCustomData.customData40,
            customData41: newCustomData.customData41 ?? existingCustomData.customData41,
            customData42: newCustomData.customData42 ?? existingCustomData.customData42,
            customData43: newCustomData.customData43 ?? existingCustomData.customData43,
            customData44: newCustomData.customData44 ?? existingCustomData.customData44,
            customData45: newCustomData.customData45 ?? existingCustomData.customData45,
            customData46: newCustomData.customData46 ?? existingCustomData.customData46,
            customData47: newCustomData.customData47 ?? existingCustomData.customData47,
            customData48: newCustomData.customData48 ?? existingCustomData.customData48,
            customData49: newCustomData.customData49 ?? existingCustomData.customData49,
            customData50: newCustomData.customData50 ?? existingCustomData.customData50,
            customData51: newCustomData.customData51 ?? existingCustomData.customData51,
            customData52: newCustomData.customData52 ?? existingCustomData.customData52,
            customData53: newCustomData.customData53 ?? existingCustomData.customData53,
            customData54: newCustomData.customData54 ?? existingCustomData.customData54,
            customData55: newCustomData.customData55 ?? existingCustomData.customData55,
            customData56: newCustomData.customData56 ?? existingCustomData.customData56,
            customData57: newCustomData.customData57 ?? existingCustomData.customData57,
            customData58: newCustomData.customData58 ?? existingCustomData.customData58,
            customData59: newCustomData.customData59 ?? existingCustomData.customData59,
            customData60: newCustomData.customData60 ?? existingCustomData.customData60,
            customData61: newCustomData.customData61 ?? existingCustomData.customData61,
            customData62: newCustomData.customData62 ?? existingCustomData.customData62,
            customData63: newCustomData.customData63 ?? existingCustomData.customData63,
            customData64: newCustomData.customData64 ?? existingCustomData.customData64,
            customData65: newCustomData.customData65 ?? existingCustomData.customData65,
            customData66: newCustomData.customData66 ?? existingCustomData.customData66,
            customData67: newCustomData.customData67 ?? existingCustomData.customData67,
            customData68: newCustomData.customData68 ?? existingCustomData.customData68,
            customData69: newCustomData.customData69 ?? existingCustomData.customData69,
            customData70: newCustomData.customData70 ?? existingCustomData.customData70,
            customData71: newCustomData.customData71 ?? existingCustomData.customData71,
            customData72: newCustomData.customData72 ?? existingCustomData.customData72,
            customData73: newCustomData.customData73 ?? existingCustomData.customData73,
            customData74: newCustomData.customData74 ?? existingCustomData.customData74,
            customData75: newCustomData.customData75 ?? existingCustomData.customData75,
            customData76: newCustomData.customData76 ?? existingCustomData.customData76,
            customData77: newCustomData.customData77 ?? existingCustomData.customData77,
            customData78: newCustomData.customData78 ?? existingCustomData.customData78,
            customData79: newCustomData.customData79 ?? existingCustomData.customData79,
            customData80: newCustomData.customData80 ?? existingCustomData.customData80,
            customData81: newCustomData.customData81 ?? existingCustomData.customData81,
            customData82: newCustomData.customData82 ?? existingCustomData.customData82,
            customData83: newCustomData.customData83 ?? existingCustomData.customData83,
            customData84: newCustomData.customData84 ?? existingCustomData.customData84,
            customData85: newCustomData.customData85 ?? existingCustomData.customData85,
            customData86: newCustomData.customData86 ?? existingCustomData.customData86,
            customData87: newCustomData.customData87 ?? existingCustomData.customData87,
            customData88: newCustomData.customData88 ?? existingCustomData.customData88,
            customData89: newCustomData.customData89 ?? existingCustomData.customData89,
            customData90: newCustomData.customData90 ?? existingCustomData.customData90,
            customData91: newCustomData.customData91 ?? existingCustomData.customData91,
            customData92: newCustomData.customData92 ?? existingCustomData.customData92,
            customData93: newCustomData.customData93 ?? existingCustomData.customData93,
            customData94: newCustomData.customData94 ?? existingCustomData.customData94,
            customData95: newCustomData.customData95 ?? existingCustomData.customData95,
            customData96: newCustomData.customData96 ?? existingCustomData.customData96,
            customData97: newCustomData.customData97 ?? existingCustomData.customData97,
            customData98: newCustomData.customData98 ?? existingCustomData.customData98,
            customData99: newCustomData.customData99 ?? existingCustomData.customData99,
            customData100: newCustomData.customData100 ?? existingCustomData.customData100
        )
    }
    
}
