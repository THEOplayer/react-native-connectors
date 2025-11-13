//
//  AdobeEdgeConnector.swift
//

import Foundation
import THEOplayerSDK
import UIKit

let CONTENT_PING_INTERVAL = 10.0
let AD_PING_INTERVAL = 1.0

class AdobeEdgeConnector {
    private weak var player: THEOplayer?
    private var baseUrl: String
    private var configId: String
    private var debug: Bool = false
    private var debugSessionId: String?
    
    private var mediaApi: MediaEdgeAPI
    
    private var customMetadata: [AdobeCustomMetadataDetails] = []
    private var sessionInProgress = false
    private var isPlayingAd = false
    private var pingTimer: Timer?
    private var adBreakPodIndex: Int = 0
    private var adPodPosition: Int = 0
    private var currentChapter: TextTrackCue? = nil
    
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
    
    // MARK: MediaTrack listeners
    private var videoAddTrackListener: EventListener?
    private var videoRemoveTrackListener: EventListener?
    private var videoQualityChangeListeners: [Int:EventListener] = [:]
    private var audioQualityChangeListeners: [Int:EventListener] = [:]
    
    init(player: THEOplayer, baseUrl: String, configId: String, userAgent: String?, debug: Bool, debugSessionId: String?) {
        self.player = player
        self.baseUrl = baseUrl
        self.configId = configId
        self.debug = debug
        self.debugSessionId = debugSessionId
        self.mediaApi = MediaEdgeAPI(baseUrl: baseUrl, configId: configId, userAgent: userAgent ?? AdobeUtils.buildUserAgent(), debugSessionId: debugSessionId)
        
        self.addEventListeners()
        
        self.log("Connector initialized.")
    }
    
    func setDebug(_ debug: Bool) -> Void {
        self.debug = debug
    }
    
    func setDebugSessionId(_ debugId: String?) -> Void {
        self.mediaApi.setDebugSessionId(debugId: debugId)
    }
    
    func updateMetadata(_ metadata: [AdobeCustomMetadataDetails]) -> Void {
        self.customMetadata.append(contentsOf: metadata)
    }
    
    func setError(_ errorDetails: AdobeErrorDetails) -> Void {
        guard let player = self.player else {return}
        self.mediaApi.error(playhead: player.currentTime, errorDetails: errorDetails)
    }
    
    func stopAndStartNewSession(_ metadata: [AdobeCustomMetadataDetails]) -> Void {
        self.maybeEndSession()
        self.updateMetadata(metadata)
        self.maybeStartSession()
        if let player = self.player {
            if player.paused {
                self.onPause(event: PauseEvent(currentTime: player.currentTime))
            } else {
                self.onPlaying(event: PlayingEvent(currentTime: player.currentTime))
            }
        }
    }
    
    func destroy() -> Void {
        self.log("destroy.")
        self.removeEventListeners()
        self.maybeEndSession()
    }
    
    func addEventListeners() -> Void {
        guard let player = self.player else {return}
        
        // Player events
        self.playingListener = player.addEventListener(type: PlayerEventTypes.PLAYING, listener: self.onPlaying(event:))
        self.pauseListener = player.addEventListener(type: PlayerEventTypes.PAUSE, listener: self.onPause(event:))
        self.endedListener = player.addEventListener(type: PlayerEventTypes.ENDED, listener: self.onEnded(event:))
        self.waitingListener = player.addEventListener(type: PlayerEventTypes.WAITING, listener: self.onWaiting(event:))
        self.sourceChangeListener = player.addEventListener(type: PlayerEventTypes.SOURCE_CHANGE, listener: self.onSourceChange(event:))
        self.loadedMetadataListener = player.addEventListener(type: PlayerEventTypes.LOADED_META_DATA, listener: self.onLoadedMetadata(event:))
        self.errorListener = player.addEventListener(type: PlayerEventTypes.ERROR, listener: self.onError(event:))
        
        // Bitrate
        self.videoAddTrackListener = player.videoTracks.addEventListener(type: VideoTrackListEventTypes.ADD_TRACK) { [weak self] event in
            guard let welf = self else { return }
            if let videoTrack = event.track as? VideoTrack {
                // start listening for qualityChange events on this track
                welf.videoQualityChangeListeners[videoTrack.uid] = videoTrack.addEventListener(type: MediaTrackEventTypes.ACTIVE_QUALITY_CHANGED, listener: welf.onActiveQualityChange(event:))
            }
        }
        self.videoRemoveTrackListener = player.videoTracks.addEventListener(type: VideoTrackListEventTypes.REMOVE_TRACK) { [weak self] event in
            guard let welf = self else { return }
            if let videoTrack = event.track as? VideoTrack {
                if let videoQualityChangeListener = welf.videoQualityChangeListeners.removeValue(forKey: videoTrack.uid) {
                    videoTrack.removeEventListener(type: MediaTrackEventTypes.ACTIVE_QUALITY_CHANGED, listener: videoQualityChangeListener)
                }
            }
        }
        
        // Ad events
        self.adBreakBeginListener = player.ads.addEventListener(type: AdsEventTypes.AD_BREAK_BEGIN, listener: self.onAdBreakBegin(event:))
        self.adBreakEndListener = player.ads.addEventListener(type: AdsEventTypes.AD_BREAK_END, listener: self.onAdBreakEnd(event:))
        self.adBeginListener = player.ads.addEventListener(type: AdsEventTypes.AD_BEGIN, listener: self.onAdBegin(event:))
        self.adEndListener = player.ads.addEventListener(type: AdsEventTypes.AD_END, listener: self.onAdEnd(event:))
        
        self.log("Listeners attached.")
    }
    
    func removeEventListeners() -> Void {
        guard let player = self.player else {return}
        
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
        
        // Bitrate
        let videoTrackCount = player.videoTracks.count
        if videoTrackCount > 0 {
            for i in 0..<videoTrackCount {
                let videoTrack = player.videoTracks[i]
                if let videoQualityChangeListener = self.videoQualityChangeListeners.removeValue(forKey: videoTrack.uid) {
                    videoTrack.removeEventListener(type: MediaTrackEventTypes.ACTIVE_QUALITY_CHANGED, listener: videoQualityChangeListener)
                }
            }
        }
        if let videoAddTrackListener = self.videoAddTrackListener {
            player.videoTracks.removeEventListener(type: VideoTrackListEventTypes.ADD_TRACK, listener: videoAddTrackListener)
        }
        if let videoRemoveTrackListener = self.videoRemoveTrackListener {
            player.videoTracks.removeEventListener(type: VideoTrackListEventTypes.REMOVE_TRACK, listener: videoRemoveTrackListener)
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
    
    func onLoadedMetadata(event: LoadedMetaDataEvent) -> Void {
        self.log("onLoadedMetadata triggered.")
        self.maybeStartSession()
    }
    
    func onPlaying(event: PlayingEvent) -> Void {
        guard let player = self.player else {return}
        self.log("onPlayingEvent triggered.")
        //self.maybeStartSession(mediaLengthSec: player.duration)
        self.mediaApi.play(playhead: player.currentTime)
    }
    
    func onPause(event: PauseEvent) -> Void {
        guard let player = self.player else {return}
        self.log("onPause triggered.")
        self.mediaApi.pause(playhead: player.currentTime)
    }
    
    func onWaiting(event: WaitingEvent) -> Void {
        guard let player = self.player else {return}
        self.log("onWaiting triggered.")
        self.mediaApi.bufferStart(playhead: player.currentTime)
    }
    
    func onEnded(event: EndedEvent) -> Void {
        guard let player = self.player else {return}
        self.log("onEnded triggered.")
        self.mediaApi.sessionComplete(playhead: player.currentTime)
        self.reset()
    }
    
    func onSourceChange(event: SourceChangeEvent) -> Void {
        self.log("onSourceChange triggered.")
        self.maybeEndSession()
    }
    
    func onActiveQualityChange(event: ActiveQualityChangedEvent) -> Void {
        guard let player = self.player else {return}
        self.log("onActiveQualityChange triggered.")
        var bitrate = 0
        if let activeTrack = self.activeTrack(tracks: player.videoTracks) {
            bitrate = activeTrack.activeQuality?.bandwidth ?? 0
        }
        self.mediaApi.bitrateChange(
            playhead: player.currentTime, qoeDataDetails: AdobeQoeDataDetails(bitrate: bitrate)
        )
    }
    
    private func activeTrack(tracks: THEOplayerSDK.MediaTrackList) -> MediaTrack? {
        guard tracks.count > 0 else {
            return nil;
        }
        var track: MediaTrack?
        for i in 0...tracks.count-1 {
            track = tracks.get(i)
            if (track != nil && track!.enabled) {
                return track
            }
        }
        return nil;
    }
    
    func onError(event: ErrorEvent) -> Void {
        guard let player = self.player else {return}
        self.log("onError triggered.")
        var errorCodeString = "-1"
        if let errorCodeValue = event.errorObject?.code.rawValue as? Int32 {
            errorCodeString = String(errorCodeValue)
        }
        self.mediaApi.error(
            playhead: player.currentTime,
            errorDetails: AdobeErrorDetails(
                name: errorCodeString,
                source: .player
            )
        )
    }
    
    func onAdBreakBegin(event: AdBreakBeginEvent) -> Void {
        guard let player = self.player else {return}
        self.log("onAdBreakBegin triggered.")
        self.isPlayingAd = true
        self.startPinger(AD_PING_INTERVAL)
        let podDetails = AdobeUtils.calculateAdvertisingPodDetails(adBreak: event.ad, lastPodIndex: self.adBreakPodIndex)
        self.mediaApi.adBreakStart(playhead: player.currentTime, advertisingPodDetails: podDetails)
        if (podDetails.index > adBreakPodIndex) {
            adBreakPodIndex += 1
        }
    }
    
    func onAdBreakEnd(event: AdBreakEndEvent) -> Void {
        guard let player = self.player else {return}
        self.log("onAdBreakEnd triggered.")
        self.isPlayingAd = false
        self.adPodPosition = 1
        self.startPinger(CONTENT_PING_INTERVAL)
        self.mediaApi.adBreakComplete(playhead: player.currentTime)
    }
    
    func onAdBegin(event: AdBeginEvent) -> Void {
        guard let player = self.player else {return}
        self.log("onAdBegin triggered.")
        self.mediaApi.adStart(
            playhead: player.currentTime,
            advertisingDetails: AdobeUtils.calculateAdvertisingDetails(ad: event.ad, podPosition: self.adPodPosition),
            customMetadata: self.customMetadata
        )
        self.adPodPosition += 1
    }
    
    func onAdEnd(event: AdEndEvent) -> Void {
        guard let player = self.player else {return}
        self.log("onAdEnd triggered.")
        self.mediaApi.adComplete(playhead: player.currentTime)
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
    func maybeStartSession(mediaLengthSec: Double? = nil) -> Void {
        guard let player = self.player else {
            return
        }
        
        let mediaLength = self.getContentLength()
        let hasValidSource = player.source != nil
        let hasValidDuration = player.duration != nil && !(player.duration!.isNaN)
        self.log("maybeStartSession - mediaLength: \(mediaLength)")
        self.log("maybeStartSession - hasValidSource: \(hasValidSource)")
        self.log("maybeStartSession - hasValidDuration: \(hasValidDuration)")
        self.log("maybeStartSession - sessionInProgress: \(self.sessionInProgress)")
        self.log("maybeStartSession - isPlayingAd: \(self.isPlayingAd)")
        
        guard !sessionInProgress else {
            self.log("maybeStartSession - NOT started: already in progress")
            return
        }
        
        guard !isPlayingAd else {
            self.log("maybeStartSession - NOT started: playing ad")
            return
        }
        
        guard hasValidSource && hasValidDuration else {
            let reason = hasValidSource ? "duration" : "source"
            self.log("maybeStartSession - NOT started: invalid \(reason)")
            return
        }
        
        Task { @MainActor in
            
            let sessionDetails = AdobeSessionDetails(
                ID: "N/A",
                channel: "N/A",
                contentType: getContentType(),
                length: mediaLength,
                name: player.source?.metadata?.title ?? "N/A",
                playerName: "THEOplayer"
            )
            
            self.log("maybeStartSession - call startSession")
            await self.mediaApi.startSession(sessionDetails: sessionDetails, customMetadata: self.customMetadata)
            
            guard self.mediaApi.hasSessionStarted() else {
                self.log("maybeStartSession - session was not started")
                return
            }
            
            sessionInProgress = true
            self.log("maybeStartSession - STARTED sessionId: \(self.mediaApi.sessionId ?? "<no session>")")
            
            if !isPlayingAd {
                startPinger(CONTENT_PING_INTERVAL)
            } else {
                startPinger(AD_PING_INTERVAL)
            }
        }
    }
    
    private func maybeEndSession() -> Void {
        guard let player = self.player else {return}
        self.log("maybeEndSession")
        if (self.mediaApi.hasSessionStarted()) {
            self.mediaApi.sessionEnd(playhead: player.currentTime)
        }
        reset()
    }
    
    private func reset() -> Void {
        self.log("reset");
        self.mediaApi.reset()
        self.adBreakPodIndex = 0;
        self.adPodPosition = 1;
        self.isPlayingAd = false;
        self.sessionInProgress = false;
        self.pingTimer?.invalidate();
        self.pingTimer = nil
        self.currentChapter = nil;
    }
    
    private func startPinger(_ interval: Double) {
        DispatchQueue.main.async {
            self.pingTimer?.invalidate()
            self.pingTimer = Timer.scheduledTimer(withTimeInterval: interval, repeats: true, block: { t in
                guard let player = self.player else {return}
                self.mediaApi.ping(playhead: player.currentTime)
            })
            self.log("Pinger started with interval \(interval).")
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
    private func getContentLength(mediaLengthInSec: Double? = nil) -> Int {
        if let mediaLength = mediaLengthInSec {
            return mediaLength == Double.infinity ? 86400 : Int(mediaLength)
        }
        
        if let player = self.player,
           let duration = player.duration {
            return duration == Double.infinity ? 86400 : Int(duration)
        }
        
        return 86400
    }
    
    private func getContentType() -> ContentType {
        if let player = self.player,
           let duration = player.duration {
            if duration != Double.infinity {
                return ContentType.vod
            }
        }
        return ContentType.live
    }
    
    private func log(_ text: String) {
        if self.debug {
            print("[adobe-edge-connector]", text)
        }
    }
}
