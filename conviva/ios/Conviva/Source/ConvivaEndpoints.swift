//
//  File.swift
//  
//
//  Created by Damiaan Dufaux on 12/10/2022.
//

import ConvivaSDK

public class ConvivaEndpoints {
    public let analytics: CISAnalytics
    public let videoAnalytics: CISVideoAnalytics
    public let adAnalytics: CISAdAnalytics
    
    public init?(configuration: ConvivaConfiguration) {
        guard let analytics = CISAnalyticsCreator.create(
            withCustomerKey: configuration.customerKey,
            settings: configuration.convivaSettingsDictionary
        ) else {
            return nil
        }
        
        self.analytics = analytics
        videoAnalytics = analytics.createVideoAnalytics()
        adAnalytics = analytics.createAdAnalytics(withVideoAnalytics: videoAnalytics)
        
        videoAnalytics.setPlayerInfo(Utilities.playerInfo)
    }
    
    deinit {
        adAnalytics.cleanup()
        videoAnalytics.cleanup()
        analytics.cleanup()
    }
}

public protocol ConvivaEndpointContainer {
    var conviva: ConvivaEndpoints {get}
}

extension ConvivaEndpointContainer {
    public var analytics: CISAnalytics { conviva.analytics }
    public var videoAnalytics: CISVideoAnalytics { conviva.videoAnalytics }
    public var adAnalytics: CISAdAnalytics { conviva.adAnalytics }

    public func report(viewerID: String) {
        videoAnalytics.setContentInfo([
            CIS_SSDK_METADATA_VIEWER_ID: viewerID
        ])
    }
    
    public func report(assetName: String) {
        videoAnalytics.setContentInfo([
            CIS_SSDK_METADATA_ASSET_NAME: assetName
        ])
    }
}
