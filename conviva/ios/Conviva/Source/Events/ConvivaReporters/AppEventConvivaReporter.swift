//
//  AppStateConvivaReporter.swift
//  
//
//  Created by Damiaan Dufaux on 27/09/2022.
//

import ConvivaSDK
import AVFoundation

struct AppEventConvivaReporter: AppEventProcessor {
    let analytics: CISAnalytics
    let video: CISVideoAnalyticsProtocol
    let ads: CISAdAnalyticsProtocol
    let storage: ConvivaConnectorStorage

    func appWillEnterForeground(notification: Notification) {
        analytics.reportAppForegrounded()
    }
    
    func appDidEnterBackground(notification: Notification) {
        analytics.reportAppBackgrounded()
    }
    
    func appGotNewAccessLogEntry(event: AVPlayerItemAccessLogEvent, isPlayingAd: Bool) {
        let endpoint = isPlayingAd ? ads : video
        
        if event.indicatedBitrate >= 0 {
            let bitrateValue = NSNumber(value: event.indicatedBitrate / 1000)
            endpoint.reportPlaybackMetric(CIS_SSDK_PLAYBACK_METRIC_BITRATE, value: bitrateValue)
            self.storage.storeKeyValuePair(key: CIS_SSDK_PLAYBACK_METRIC_BITRATE, value: bitrateValue)
        }
        
        if event.numberOfDroppedVideoFrames >= 0 {
            endpoint.reportPlaybackMetric(CIS_SSDK_PLAYBACK_METRIC_DROPPED_FRAMES_TOTAL, value: NSNumber(value: event.numberOfDroppedVideoFrames))
        }
    }
}
