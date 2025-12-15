//
//  AdobeEdgeConnector.swift
//

import Foundation
import THEOplayerSDK
import UIKit
import AEPServices
import AEPCore
import AEPEdgeMedia

let CONTENT_PING_INTERVAL = 10.0
let AD_PING_INTERVAL = 1.0

class AdobeEdgeHandler {
    private weak var player: THEOplayer?
    private var trackerConfig: [String:String]
    private var sessionInProgress = false
    private var adBreakPodIndex: Int = 0
    private var adPodPosition: Int = 0
    private var isPlayingAd = false
    private var customMetadata: [String:String] = [:]
    private var currentChapter: TextTrackCue? = nil
    private var loggingMode: LogLevel = .debug
    private var tracker: MediaTracker = Media.createTracker()

    // MARK: Player Listeners
    private var playingListener: THEOplayerSDK.EventListener?
    private var pauseListener: THEOplayerSDK.EventListener?
    private var endedListener: THEOplayerSDK.EventListener?
    private var timeUpdateListener: THEOplayerSDK.EventListener?
    private var waitingListener: THEOplayerSDK.EventListener?
    private var seekingListener: THEOplayerSDK.EventListener?
    private var seekedListener: THEOplayerSDK.EventListener?
    private var sourceChangeListener: THEOplayerSDK.EventListener?
    private var errorListener: THEOplayerSDK.EventListener?
    private var addTextTrackListener: THEOplayerSDK.EventListener?
    private var removeTextTrackListener: THEOplayerSDK.EventListener?
    private var addVideoTrackListener: THEOplayerSDK.EventListener?
    
    // MARK: Ad Listeners
    private var adBreakBeginListener: THEOplayerSDK.EventListener?
    private var adBreakEndListener: THEOplayerSDK.EventListener?
    private var adBeginListener: THEOplayerSDK.EventListener?
    private var adEndListener: THEOplayerSDK.EventListener?
    private var adSkipListener: THEOplayerSDK.EventListener?
    
    // MARK: MediaTrack listeners
    private var videoAddTrackListener: THEOplayerSDK.EventListener?
    private var videoRemoveTrackListener: THEOplayerSDK.EventListener?
    private var videoQualityChangeListeners: [Int:THEOplayerSDK.EventListener] = [:]
    private var audioQualityChangeListeners: [Int:THEOplayerSDK.EventListener] = [:]
    
    private func logDebug(_ text: String) {
        if self.loggingMode >= .debug {
            print("[AdobeEdgeConnector]", text)
        }
    }
    
    init(player: THEOplayer, trackerConfig: [String:String]) {
        self.player = player
        self.trackerConfig = trackerConfig
        self.addEventListeners()
        self.logDebug("Initialized Connector.")
    }
    
    func setLoggingMode(_ debug: LogLevel) -> Void {
        self.loggingMode = debug
        MobileCore.setLogLevel(debug)
    }
    
    func updateMetadata(_ metadata: [String:String]) -> Void {
        self.customMetadata.merge(metadata) { (_, new) in new }
    }
    
    func setError(_ errorId: String) -> Void {
        self.tracker.trackError(errorId: errorId)
    }
    
    func stopAndStartNewSession(_ metadata: [String:String]) -> Void {
        guard let player = self.player else { return }
        self.maybeEndSession()
        self.updateMetadata(metadata)
        self.maybeStartSession()
        player.paused ? self.onPause() : self.onPlaying()
    }
    
    func addEventListeners() -> Void {
        guard let player = self.player else { return }
        
        // Player events
        self.playingListener = player.addEventListener(type: PlayerEventTypes.PLAYING, listener: self.handlePlaying(event:))
        self.pauseListener = player.addEventListener(type: PlayerEventTypes.PAUSE, listener: self.handlePause(event:))
        self.endedListener = player.addEventListener(type: PlayerEventTypes.ENDED, listener: self.handleEnded(event:))
        self.waitingListener = player.addEventListener(type: PlayerEventTypes.WAITING, listener: self.handleWaiting(event:))
        self.seekingListener = player.addEventListener(type: PlayerEventTypes.SEEKING, listener: self.handleSeeking(event:))
        self.seekedListener = player.addEventListener(type: PlayerEventTypes.SEEKED, listener: self.handleSeeked(event:))
        self.timeUpdateListener = player.addEventListener(type: PlayerEventTypes.TIME_UPDATE, listener: self.handleTimeUpdate(event:))
        self.sourceChangeListener = player.addEventListener(type: PlayerEventTypes.SOURCE_CHANGE, listener: self.handleSourceChange(event:))
        self.errorListener = player.addEventListener(type: PlayerEventTypes.ERROR, listener: self.handleError(event:))
        
        // Bitrate
        self.videoAddTrackListener = player.videoTracks.addEventListener(type: VideoTrackListEventTypes.ADD_TRACK) { [weak self] event in
            guard let welf = self else { return }
            if let videoTrack = event.track as? VideoTrack {
                // start listening for qualityChange events on this track
                welf.videoQualityChangeListeners[videoTrack.uid] = videoTrack.addEventListener(type: MediaTrackEventTypes.ACTIVE_QUALITY_CHANGED, listener: welf.handleActiveQualityChange(event:))
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
        self.adBreakBeginListener = player.ads.addEventListener(type: AdsEventTypes.AD_BREAK_BEGIN, listener: self.handleAdBreakBegin(event:))
        self.adBreakEndListener = player.ads.addEventListener(type: AdsEventTypes.AD_BREAK_END, listener: self.handleAdBreakEnd(event:))
        self.adBeginListener = player.ads.addEventListener(type: AdsEventTypes.AD_BEGIN, listener: self.handleAdBegin(event:))
        self.adEndListener = player.ads.addEventListener(type: AdsEventTypes.AD_END, listener: self.handleAdEnd(event:))
        self.adSkipListener = player.ads.addEventListener(type: AdsEventTypes.AD_SKIP, listener: self.handleAdSkip(event:))
        
        self.logDebug("Listeners attached.")
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
        if let seekingListener = self.seekingListener {
            player.removeEventListener(type: PlayerEventTypes.SEEKING, listener: seekingListener)
        }
        if let seekedListener = self.seekedListener {
            player.removeEventListener(type: PlayerEventTypes.SEEKED, listener: seekedListener)
        }
        if let timeUpdateListener = self.timeUpdateListener {
            player.removeEventListener(type: PlayerEventTypes.TIME_UPDATE, listener: timeUpdateListener)
        }
        if let sourceChangeListener = self.sourceChangeListener {
            player.removeEventListener(type: PlayerEventTypes.SOURCE_CHANGE, listener: sourceChangeListener)
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
        if let adSkipListener = self.adSkipListener {
            player.ads.removeEventListener(type: AdsEventTypes.AD_SKIP, listener: adSkipListener)
        }
        
        self.logDebug("Listeners removed.")
    }
    
    private func handlePlaying(event: PlayingEvent) {
        self.onPlaying()
    }
    
    private func onPlaying() {
        guard let player = self.player else { return }
        self.logDebug("onPlaying")
        self.maybeStartSession(mediaLengthSec: player.duration)
        
        self.tracker.trackPlay()
    }

    private func handlePause(event: PauseEvent) {
        self.onPause()
    }
    
    private func onPause() {
        guard self.player != nil else { return }
        self.logDebug("onPause")
        
        self.tracker.trackPause()
    }
    
    private func handleTimeUpdate(event: TimeUpdateEvent) {
        guard self.player != nil else { return }
        //self.logDebug("onTimeUpdate")
        
        self.tracker.updateCurrentPlayhead(time: self.sanitisePlayhead(event.currentTime))
    }
    
    func handleWaiting(event: WaitingEvent) -> Void {
        guard self.player != nil else { return }
        self.logDebug("onWaiting")
        
        self.tracker.trackEvent(event: MediaEvent.BufferStart, info: nil, metadata: nil)
    }
    
    func handleSeeking(event: SeekingEvent) -> Void {
        guard self.player != nil else { return }
        self.logDebug("onSeeking")
        
        self.tracker.trackEvent(event: MediaEvent.SeekStart, info: nil, metadata: nil)
    }
    
    func handleSeeked(event: SeekedEvent) -> Void {
        guard self.player != nil else { return }
        self.logDebug("onSeeked")
        
        self.tracker.trackEvent(event: MediaEvent.SeekComplete, info: nil, metadata: nil)
    }
    
    func handleEnded(event: EndedEvent) -> Void {
        guard self.player != nil else { return }
        self.logDebug("onEnded")
        self.tracker.trackComplete()
        self.reset()
    }
    
    func handleSourceChange(event: SourceChangeEvent) -> Void {
        self.logDebug("onSourceChange")
        self.maybeEndSession()
    }
    
    func handleActiveQualityChange(event: ActiveQualityChangedEvent) -> Void {
        guard let player = self.player else { return }
        self.logDebug("onActiveQualityChange")
        
        var bitrate = 0
        if let activeTrack = self.activeTrack(tracks: player.videoTracks) {
            bitrate = activeTrack.activeQuality?.bandwidth ?? 0
        }
        if let qoe = Media.createQoEObjectWith(bitrate: bitrate, startupTime: 0, fps: 0, droppedFrames: 0) {
            self.tracker.updateQoEObject(qoe: qoe)
        }
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
    
    func handleError(event: ErrorEvent) -> Void {
        guard self.player != nil else { return }
        self.logDebug("onError")
        var errorCodeString = "-1"
        if let errorCodeValue = event.errorObject?.code.rawValue as? Int32 {
            errorCodeString = String(errorCodeValue)
        }
        self.tracker.trackError(errorId: errorCodeString)
    }
    
    func handleAdBreakBegin(event: AdBreakBeginEvent) -> Void {
        guard self.player != nil else { return }
        self.logDebug("onAdBreakBegin")
        self.isPlayingAd = true
        let currentAdBreakTimeOffset = event.ad?.timeOffset ?? 0
        let breakIndex = currentAdBreakTimeOffset < 0 ? -1 : (currentAdBreakTimeOffset == 0 ? 0 : self.adBreakPodIndex + 1)
        let adBreakObject = Media.createAdBreakObjectWith(name: "NA", position: breakIndex, startTime: currentAdBreakTimeOffset)
        self.tracker.trackEvent(event: MediaEvent.AdBreakStart, info: adBreakObject, metadata: nil)
        if (breakIndex > self.adBreakPodIndex) {
            self.adBreakPodIndex += 1
        }
    }
    
    func handleAdBreakEnd(event: AdBreakEndEvent) -> Void {
        guard self.player != nil else { return }
        self.logDebug("onAdBreakEnd")
        self.isPlayingAd = false
        self.adPodPosition = 1
        self.tracker.trackEvent(event: MediaEvent.AdBreakComplete, info: nil, metadata: nil)
    }
    
    func handleAdBegin(event: AdBeginEvent) -> Void {
        guard self.player != nil else { return }
        self.logDebug("onAdBegin")
        let duration = event.ad?.duration ?? 0
        let adObject = Media.createAdObjectWith(name: "NA", id: "NA", position: self.adPodPosition, length: duration)
        self.tracker.trackEvent(event: MediaEvent.AdBreakStart, info: adObject, metadata: nil)
        self.adPodPosition += 1
    }
    
    func handleAdEnd(event: AdEndEvent) -> Void {
        guard self.player != nil else { return }
        self.logDebug("onAdEnd")
        self.tracker.trackEvent(event: MediaEvent.AdComplete, info: nil, metadata: nil)
    }
    
    func handleAdSkip(event: AdSkipEvent) -> Void {
        guard self.player != nil else { return }
        self.logDebug("onAdSkip")
        self.tracker.trackEvent(event: MediaEvent.AdSkip, info: nil, metadata: nil)
    }
    
    private func maybeEndSession() -> Void {
        guard self.player != nil else { return }
        self.logDebug("maybeEndSession")
        if self.sessionInProgress {
            self.tracker.trackSessionEnd()
            self.sessionInProgress = false
        }
        self.reset()
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
        guard let player = self.player else { return }
        
        let mediaLength = self.sanitiseContentLength(mediaLengthSec)
        let hasValidSource = player.source != nil
        let hasValidDuration = player.duration != nil && !(player.duration!.isNaN)
        let streamType = self.getStreamType()
        self.logDebug("maybeStartSession - mediaLength: \(mediaLength)")
        self.logDebug("maybeStartSession - hasValidSource: \(hasValidSource)")
        self.logDebug("maybeStartSession - hasValidDuration: \(hasValidDuration)")
        self.logDebug("maybeStartSession - sessionInProgress: \(self.sessionInProgress)")
        self.logDebug("maybeStartSession - isPlayingAd: \(self.isPlayingAd)")
        self.logDebug("maybeStartSession - streamType: \(streamType)")
        
        guard !self.sessionInProgress else {
            self.logDebug("maybeStartSession - NOT started: already in progress")
            return
        }
        
        guard !self.isPlayingAd else {
            self.logDebug("maybeStartSession - NOT started: playing ad")
            return
        }
        
        guard hasValidSource && hasValidDuration else {
            let reason = hasValidSource ? "duration" : "source"
            self.logDebug("maybeStartSession - NOT started: invalid \(reason)")
            return
        }
        
        let metadata: [String: Any] = player.source?.metadata?.metadataKeys ?? [:]
        if let mediaObject = Media.createMediaObjectWith(
            name: metadata["title"] as? String ?? "N/A",
            id: metadata["id"] as? String ?? "N/A",
            length: mediaLength,
            streamType: streamType,
            mediaType: MediaType.Video
        ) {
            self.tracker.trackSessionStart(info: mediaObject, metadata: self.customMetadata)
            self.sessionInProgress = true
            self.logDebug("maybeStartSession - STARTED")
        }
    }
    
    private func reset() -> Void {
        self.logDebug("reset")
        self.adBreakPodIndex = 0
        self.adPodPosition = 1
        self.isPlayingAd = false
        self.sessionInProgress = false
        self.currentChapter = nil
    }
    
    func destroy() -> Void {
        self.logDebug("destroy.")
        self.removeEventListeners()
        self.maybeEndSession()
    }
    
    private func getStreamType() -> String {
        if let player = self.player,
           let duration = player.duration {
            if duration != Double.infinity {
                return MediaConstants.StreamType.VOD
            }
        }
        return MediaConstants.StreamType.LIVE
    }
    
    private func sanitisePlayhead(_ playhead: Double?) -> Int {
        guard let playhead = playhead else {
            return 0
        }
        
        if playhead == Double.infinity {
            // If content is live, the playhead must be the current second of the day.
            let now = Date().timeIntervalSince1970
            return Int(now.truncatingRemainder(dividingBy: 86400))
        }
        
        return Int(playhead)
    }
    
    private func sanitiseContentLength(_ mediaLength: Double?) -> Int {
        mediaLength == .infinity ? 86400 : Int(mediaLength ?? 0)
    }
}
