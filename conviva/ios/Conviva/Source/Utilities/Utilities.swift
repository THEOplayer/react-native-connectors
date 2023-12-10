//
//  Utilities.swift
//  
//
//  Created by Damiaan Dufaux on 31/08/2022.
//
import Foundation
import ConvivaSDK
import THEOplayerSDK
import AVFoundation

enum Utilities {
    static let playerFrameworkName = "THEOplayer"
    
    static let playerInfo = [
        CIS_SSDK_PLAYER_FRAMEWORK_NAME: playerFrameworkName,
        CIS_SSDK_PLAYER_FRAMEWORK_VERSION: THEOplayer.version
    ]
    
    static let defaultStringValue = "NA"
    
    static let en_usLocale = Locale(identifier: "en_US")
}

extension THEOplayer {
    var currentItem: AVPlayerItem? {
        ((Mirror(reflecting: self).descendant("theoplayer") as? NSObject).map {Mirror(reflecting: $0).superclassMirror?.descendant("mainContentPlayer", "avPlayer")} as? AVPlayer)?.currentItem
    }
    
    var renderedFramerate: Float? {
        currentItem?.tracks.first { $0.currentVideoFrameRate > 0 }?.currentVideoFrameRate
    }
}

extension CurrentTimeEvent {
    var currentTimeInMilliseconds: NSNumber {
        NSNumber(value: Int(currentTime * 1000))
    }
}
