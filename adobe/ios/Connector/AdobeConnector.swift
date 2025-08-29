//
//  AdobeConnector.swift
//

import Foundation
import THEOplayerSDK
import UIKit

enum ContentType: String {
    case VOD = "VOD"
    case Live = "Live"
    case Linear = "Linear"
}

class AdobeConnector {
    private weak var player: THEOplayer?
    private var uri: String
    private var ecid: String
    private var sid: String
    private var trackingUrl: String
    private var customMetadata: AdobeMetadata?
    private var userAgent: String?
    private var debug: Bool = false
    
    private var sessionInProgress = false
    private var isPlayingAd = false
    
    // MARK: Player Listeners
    private var playingListener: EventListener?
    private var pauseListener: EventListener?
    private var endedListener: EventListener?
    private var waitingListener: EventListener?
    private var sourceChangeListener: EventListener?
    private var loadedMetadataListener: EventListener?
    private var errorListener: EventListener?
    private var addTextTrackListener: EventListener?
    private var removeTextTrackListener: EventListener?
    private var addVideoTrackListener: EventListener?
    
    // MARK: Ad Listeners
    private var adBreakBeginListener: EventListener?
    private var adBreakEndListener: EventListener?
    private var adBeginListener: EventListener?
    private var adEndListener: EventListener?
    
    init(player: THEOplayer, uri: String, ecid: String, sid: String, trackingUrl: String, metadata: AdobeMetadata?, userAgent: String?, debug: Bool) {
        self.player = player
        self.uri = uri
        self.ecid = ecid
        self.sid = sid
        self.trackingUrl = trackingUrl
        self.customMetadata = metadata
        self.userAgent = userAgent ?? AdobeUtils.buildUserAgent()
        self.debug = debug
        
        self.addEventListeners()
        
        self.log("Connector initialized.")
    }
    
    func setDebug(_ debug: Bool) -> Void {
        self.debug = debug
    }
    
    func updateMetadata(_ metadata: AdobeMetadata) -> Void {
        if let currentMetadata = self.customMetadata {
            currentMetadata.add(metadata)
            return
        } else {
            self.customMetadata = metadata
        }
    }
    
    func setError(_ metadata: AdobeMetadata) -> Void {
        // todo
    }
    
    func stopAndStartNewSession(_ metadata: AdobeMetadata) -> Void {
        // todo
    }
    
    func destroy() -> Void {
        self.removeEventListeners()
    }
    
    func addEventListeners() -> Void {
        guard let player = self.player else {
            return
        }
        
        // Player events
        self.playingListener = player.addEventListener(type: PlayerEventTypes.PLAYING, listener: self.onPlaying(event:))
        self.pauseListener = player.addEventListener(type: PlayerEventTypes.PAUSE, listener: self.onPause(event:))
        self.endedListener = player.addEventListener(type: PlayerEventTypes.ENDED, listener: self.onEnded(event:))
        self.waitingListener = player.addEventListener(type: PlayerEventTypes.WAITING, listener: self.onWaiting(event:))
        self.sourceChangeListener = player.addEventListener(type: PlayerEventTypes.SOURCE_CHANGE, listener: self.onSourceChange(event:))
        self.loadedMetadataListener = player.addEventListener(type: PlayerEventTypes.LOADED_META_DATA, listener: self.onLoadedMetadata(event:))
        self.errorListener = player.addEventListener(type: PlayerEventTypes.ERROR, listener: self.onError(event:))
        
        // Ad events
        self.adBreakBeginListener = player.ads.addEventListener(type: AdsEventTypes.AD_BREAK_BEGIN, listener: self.onAdBreakBegin(event:))
        self.adBreakEndListener = player.ads.addEventListener(type: AdsEventTypes.AD_BREAK_END, listener: self.onAdBreakEnd(event:))
        self.adBeginListener = player.ads.addEventListener(type: AdsEventTypes.AD_BEGIN, listener: self.onAdBegin(event:))
        self.adEndListener = player.ads.addEventListener(type: AdsEventTypes.AD_END, listener: self.onAdEnd(event:))
        
        self.log("Listeners attached.")
    }
    
    func removeEventListeners() -> Void {
        guard let player = self.player else {
            return
        }
        
        // Player events
        if let playingListener = self.playingListener {
            player.removeEventListener(type: PlayerEventTypes.PLAYING, listener: playingListener)
        }
        if let pauseListener = self.pauseListener {
            player.removeEventListener(type: PlayerEventTypes.PAUSE, listener: pauseListener)
        }
        if let endedListener = self.endedListener {
            player.removeEventListener(type: PlayerEventTypes.ENDED, listener: endedListener)
        }
        if let waitingListener = self.waitingListener {
            player.removeEventListener(type: PlayerEventTypes.WAITING, listener: waitingListener)
        }
        if let sourceChangeListener = self.sourceChangeListener {
            player.removeEventListener(type: PlayerEventTypes.SOURCE_CHANGE, listener: sourceChangeListener)
        }
        if let loadedMetadataListener = self.loadedMetadataListener {
            player.removeEventListener(type: PlayerEventTypes.LOADED_META_DATA, listener: loadedMetadataListener)
        }
        if let errorListener = self.errorListener {
            player.removeEventListener(type: PlayerEventTypes.ERROR, listener: errorListener)
        }
        
        // Ad events
        if let adBreakBeginListener = self.adBreakBeginListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_BREAK_BEGIN, listener: adBreakBeginListener)
        }
        if let adBreakEndListener = self.adBreakEndListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_BREAK_END, listener: adBreakEndListener)
        }
        if let adBeginListener = self.adBeginListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_BEGIN, listener: adBeginListener)
        }
        if let adEndListener = self.adEndListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_END, listener: adEndListener)
        }
        
        
        self.log("Listeners removed.")
    }
    
    func onPlaying(event: PlayingEvent) -> Void {
        self.log("onPlayingEvent triggered.")
        // todo
    }
    
    func onPause(event: PauseEvent) -> Void {
        self.log("onPause triggered.")
        // todo
    }
    
    func onEnded(event: EndedEvent) -> Void {
        self.log("onEnded triggered.")
        // todo
    }
    
    func onWaiting(event: WaitingEvent) -> Void {
        self.log("onWaiting triggered.")
        // todo
    }
    
    func onSourceChange(event: SourceChangeEvent) -> Void {
        self.log("onSourceChange triggered.")
        // todo
    }
    
    func onLoadedMetadata(event: LoadedMetaDataEvent) -> Void {
        self.log("onLoadedMetadata triggered.")
        self.maybeStartSession(duration: self.player?.duration)
    }
    
    func onError(event: ErrorEvent) -> Void {
        self.log("onError triggered.")
        // todo
    }
    
    func onAdBreakBegin(event: AdBreakBeginEvent) -> Void {
        self.log("onAdBreakBegin triggered.")
        // todo
    }
    
    func onAdBreakEnd(event: AdBreakEndEvent) -> Void {
        self.log("onAdBreakEnd triggered.")
        // todo
    }
    
    func onAdBegin(event: AdBeginEvent) -> Void {
        self.log("onAdBegin triggered.")
        // todo
    }
    
    func onAdEnd(event: AdEndEvent) -> Void {
        self.log("onAdEnd triggered.")
        // todo
    }
    
    /**
     * Start a new session, but only if:
     * - no existing session has is in progress;
     * - the player has a valid source;
     * - no ad is playing, otherwise the ad's media duration will be picked up;
     * - the player's content media duration is known.
     *
     * @param mediaLength
     * @private
     */
    func maybeStartSession(duration: Double?) -> Void {
        guard let player = self.player else {
            return
        }
        
        let mediaLength = self.getContentLength(mediaLengthInSec: duration)
        let hasValidSource = player.source != nil
        var hasValidDuration = false
        if let duration = player.duration {
            hasValidDuration = !duration.isNaN
        }
        self.log("maybeStartSession - mediaLength: \(mediaLength)")
        self.log("maybeStartSession - hasValidSource: \(hasValidSource)")
        self.log("maybeStartSession - hasValidDuration: \(hasValidDuration)")
        self.log("maybeStartSession - sessionInProgress: \(self.sessionInProgress)")
        self.log("maybeStartSession - isPlayingAd: \(self.isPlayingAd)")
        
        if (self.sessionInProgress || self.isPlayingAd || !hasValidSource || !hasValidDuration) {
              self.log("=> maybeStartSession - NOT started")
              return
        }
    }
    
    /**
       * Get the current media length in seconds.
       *
       * - In case of a live stream, set it to 24h.
       *
       * @param mediaLengthInMSec optional mediaLengthInMSec provided by a player event.
       * @private
       */
    private func getContentLength(mediaLengthInSec: Double?) -> Double {
        if let mediaLength = mediaLengthInSec {
            return mediaLength == Double.infinity ? 86400 : mediaLength
        }
        
        if let player = self.player,
           let duration = player.duration {
            return duration == Double.infinity ? 86400 : duration
        }
        
        return 86400
    }
    
    private func getContentType() -> ContentType {
        if let player = self.player,
           let duration = player.duration {
            if duration != Double.infinity {
                return ContentType.VOD
            }
        }
        
        return ContentType.Live
    }
    
    func log(_ text: String) {
        if self.debug {
            print("[adobe-connector]", text)
        }
    }
}
