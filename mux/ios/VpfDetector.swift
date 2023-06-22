//
//  VpfDetector.swift
//  react-native-theoplayer-mux
//
//  Created by Damiaan Dufaux on 21/04/2023.
//

import Foundation
import AVFoundation
import THEOplayerSDK

/// Detects failures during video playback. This is a **TEMPORARY AVPlayer BUG WORKAROUND**
///
/// Create an instance, feed it events and it will decide if AVPlayer is locked into a failed state.
///
/// First observe THEOplayer events:
///  - `PlayerEventTypes.WAITING` → transitionToWaiting()
///  - `PlayerEventTypes.SOURCE_CHANGE` → reset()
///  - `PlayerEventTypes.PLAYING` → reset()
///
/// Then when you receive `PlayerEventTypes.PAUSE` check `isTransitionToPauseFatal` to see if the transition is assumed as fatal.
class VpfDetector {
    static let timeRange = TimeInterval(0) ..< 32
    static let errorCountTreshold = 5

    private var playerIsWaiting = false
    
    func transitionToWaiting() {
        playerIsWaiting = true
        log("VPF Detector transitioned to waiting")
    }

    func isTransitionToPauseFatal(log: AVPlayerItemErrorLog, pause: PauseEvent) -> Bool {
        guard playerIsWaiting else { return false }
        var errorCountWithinDetectionRange = 0
        for event in log.events {
            if let date = event.date, event.kind.isSevere, VpfDetector.timeRange.contains(pause.date.timeIntervalSince(date)) {
                errorCountWithinDetectionRange += 1
            }
        }
        if errorCountWithinDetectionRange >= Self.errorCountTreshold {
            react_native_theoplayer_mux.log("VPF detected. (\(errorCountWithinDetectionRange) errors within error range.")
            return true
        } else {
            react_native_theoplayer_mux.log("Pause event not interpreted as caused by network error. (\(errorCountWithinDetectionRange) errors within error range.")
            return false
        }
    }
    
    func reset() {
        log("VPF Detector reset")
        playerIsWaiting = false
    }    
}

extension VpfDetector {
    struct NetworkEventKind: Hashable {
        let domain: String
        let code: Int
        
        var isSevere: Bool { Self.severeErrors.contains(self) }
        
        static var severeErrors = Set([
            Self(domain: NSURLErrorDomain, code: URLError.Code.secureConnectionFailed.rawValue),
            Self(domain: NSURLErrorDomain, code: URLError.Code.cannotFindHost.rawValue),
            Self(domain: NSURLErrorDomain, code: URLError.Code.cannotConnectToHost.rawValue),
            Self(domain: NSURLErrorDomain, code: URLError.Code.networkConnectionLost.rawValue),
            Self(domain: "CoreMediaErrorDomain", code: 12938), // HTTP 404: File Not Found
            Self(domain: "CoreMediaErrorDomain", code: 12660), // HTTP 403: Forbidden
        ])
    }
}

extension AVPlayerItemErrorLogEvent {
    var kind: VpfDetector.NetworkEventKind {
        .init(domain: errorDomain, code: errorStatusCode)
    }
}
