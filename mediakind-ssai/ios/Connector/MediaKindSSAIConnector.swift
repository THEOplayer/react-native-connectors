//
//  MediaKindSSAIConnector.swift
//

import Foundation
import THEOplayerSDK

class MediaKindSSAIConnector {
    private weak var player: THEOplayer?

    init(player: THEOplayer) {
        self.player = player
        log("MediaKind SSAI Connector initialised.")
    }

    func destroy() -> Void {
        log("MediaKind SSAI Connector destroyed.")
    }
}
