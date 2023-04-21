//
//  ExtendedConnector.swift
//  react-native-theoplayer-conviva
//
//  Created by Damiaan Dufaux on 21/04/2023.
//

import THEOplayerSDK
import THEOplayerConnectorConviva
import THEOplayerConnectorUtilities
import react_native_theoplayer

// TODO: Remove when THEOplayer correctly handles Video Playback Failures (VPF)
struct ConnectorWithVpfHandler {
    let base: ConvivaConnector
    let vpfDetector: VpfDetector
    let playerObserver: DispatchObserver
    
    init(connector: ConvivaConnector, sendError: @escaping RCTDirectEventBlock) {
        let detector = VpfDetector()

        self.base = connector
        self.vpfDetector = detector
        self.playerObserver = DispatchObserver(
            dispatcher: connector.player,
            eventListeners: Self.errorListeners(for: connector.player, vpfDetector: detector, sendError: sendError, conviva: connector.conviva)
        )
    }
    
    static func errorListeners(for player: THEOplayer, vpfDetector: VpfDetector, sendError: @escaping RCTDirectEventBlock, conviva: ConvivaEndpoints) -> [RemovableEventListenerProtocol] {
        [
            player.addRemovableEventListener(type: PlayerEventTypes.WAITING) { event in
                vpfDetector.transitionToWaiting()
            },
            player.addRemovableEventListener(type: PlayerEventTypes.PAUSE) { event in
                if let log = player.currentItem?.errorLog(), vpfDetector.isTransitionToPauseFatal(log: log, pause: event) {
                    sendError(vpfDictionary)
                    conviva.videoAnalytics.reportPlaybackFailed(vpfMessage, contentInfo: nil)
                    player.stop()
                }
            },
            player.addRemovableEventListener(type: PlayerEventTypes.PLAYING) { event in
                vpfDetector.reset()
            },
            player.addRemovableEventListener(type: PlayerEventTypes.SOURCE_CHANGE) { event in
                vpfDetector.reset()
            }
        ]
    }
    
    static let vpfMessage = "Network Timeout"
    static let vpfDictionary = [
        "error": [
            "errorCode": String(THEOErrorCode.NETWORK_TIMEOUT.rawValue),
            "errorMessage": vpfMessage
        ]
    ]
}

import AVFoundation

extension THEOplayer {
    var currentItem: AVPlayerItem? {
        ((Mirror(reflecting: self).descendant("theoplayer") as? NSObject).map {Mirror(reflecting: $0).superclassMirror?.descendant("mainContentPlayer", "avPlayer")} as? AVPlayer)?.currentItem
    }
}
