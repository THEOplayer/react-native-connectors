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

let CONTENT_PING_INTERVAL = 10.0
let AD_PING_INTERVAL = 1.0

class AdobeConnector {
    private weak var player: THEOplayer?
    private var uri: String
    private var ecid: String
    private var sid: String
    private var trackingUrl: String
    private var currentMetadata: AdobeMetadata?
    private var userAgent: String
    private var debug: Bool = false
    
    private var sessionInProgress = false
    private var isPlayingAd = false
    private var sessionId = ""
    private var eventQueue: [AdobeEventRequestBody] = []
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
    private var videoQualityChangeListeners: [Int:EventListener] = [:]
    private var audioQualityChangeListeners: [Int:EventListener] = [:]
    
    init(player: THEOplayer, uri: String, ecid: String, sid: String, trackingUrl: String, metadata: AdobeMetadata?, userAgent: String?, debug: Bool) {
        self.player = player
        self.uri = "https://\(uri)/api/v1/sessions"
        self.ecid = ecid
        self.sid = sid
        self.trackingUrl = trackingUrl
        self.currentMetadata = metadata
        self.userAgent = userAgent ?? AdobeUtils.buildUserAgent()
        self.debug = debug
        
        self.addEventListeners()
        
        self.log("Connector initialized.")
    }
    
    func setDebug(_ debug: Bool) -> Void {
        self.debug = debug
    }
    
    func updateMetadata(_ metadata: AdobeMetadata) -> Void {
        if let currentCustomMetadata = self.currentMetadata {
            currentCustomMetadata.add(metadata)
            return
        } else {
            self.currentMetadata = metadata
        }
    }
    
    func setError(_ metadata: AdobeMetadata) -> Void {
        self.sendEvent(eventType: AdobeEventTypes.ERROR, sessionId: self.sessionId, eventMetadata: metadata)
    }
    
    func stopAndStartNewSession(_ metadata: AdobeMetadata) -> Void {
        self.maybeEndSession {
            self.updateMetadata(metadata)
            
            self.maybeStartSession {
                if let player = self.player {
                    if player.paused {
                        self.onPause(event: PauseEvent(currentTime: player.currentTime))
                    } else {
                        self.onPlaying(event: PlayingEvent(currentTime: player.currentTime))
                    }
                }
            }
        }
    }
    
    func destroy() -> Void {
        self.removeEventListeners()
        self.maybeEndSession()
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
        
        // Bitrate
        _ = player.videoTracks.addEventListener(type: VideoTrackListEventTypes.ADD_TRACK) { [weak self] event in
            guard let welf = self else { return }
            if let videoTrack = event.track as? VideoTrack {
                // start listening for qualityChange events on this track
                welf.videoQualityChangeListeners[videoTrack.uid] = videoTrack.addEventListener(type: MediaTrackEventTypes.ACTIVE_QUALITY_CHANGED, listener: welf.onActiveQualityChange(event:))
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
        self.log("onPlayingEvent triggered.")
        self.sendEvent(eventType: AdobeEventTypes.PLAY, sessionId: self.sessionId)
    }
    
    func onPause(event: PauseEvent) -> Void {
        if let player = self.player,
           player.ended == false { // don't process events after ended event.
            self.log("onPause triggered")
            self.sendEvent(eventType: AdobeEventTypes.PAUSE_START, sessionId: self.sessionId)
        }
    }
    
    func onWaiting(event: WaitingEvent) -> Void {
        self.log("onWaiting triggered.")
        self.sendEvent(eventType: AdobeEventTypes.BUFFER_START, sessionId: self.sessionId)
    }
    
    func onEnded(event: EndedEvent) -> Void {
        self.log("onEnded triggered.")
        let sessionId = self.sessionId
        self.reset()
        self.sendEvent(eventType: AdobeEventTypes.SESSION_COMPLETE, sessionId: sessionId)
    }
    
    func onSourceChange(event: SourceChangeEvent) -> Void {
        self.log("onSourceChange triggered.")
        self.maybeEndSession()
    }
    
    func onActiveQualityChange(event: ActiveQualityChangedEvent) -> Void {
        self.log("onActiveQualityChange triggered.")
        self.sendEvent(eventType: AdobeEventTypes.BITRATE_CHANGE, sessionId: self.sessionId)
    }
     
     /*func onTextTrackEvent() -> Void {
         self.log("onTextTrackEvent triggered.")
         // todo
     }
     */
    
    func onError(event: ErrorEvent) -> Void {
        self.log("onError triggered.")
        var qoeData: [String:Any] = [:]
		var errorCodeString = "-1"
		if let errorCodeValue = event.errorObject?.code.rawValue as? Int32 {
		    errorCodeString = String(errorCodeValue)
		}
		qoeData["media.qoe.errorID"] = errorCodeString
        qoeData["media.qoe.errorSource"] = "player"
        
        self.sendEvent(eventType: AdobeEventTypes.ERROR, sessionId: self.sessionId, eventMetadata: AdobeMetadata(qoeData: qoeData))
    }
    
    func onAdBreakBegin(event: AdBreakBeginEvent) -> Void {
        self.log("onAdBreakBegin triggered.")
        self.isPlayingAd = true
        self.startPinger(AD_PING_INTERVAL)
        if let adBreak = event.ad {
            let timeOffset = adBreak.timeOffset
            var podIndex = 0
            if timeOffset < 0 {
                podIndex = -1
            } else if timeOffset > 0 {
                self.adBreakPodIndex += 1
                podIndex = self.adBreakPodIndex
            }
            
            var params: [String:Any] = [:]
            params["media.ad.podIndex"] = podIndex
            params["media.ad.podSecond"] = adBreak.maxDuration
            
            self.sendEvent(eventType: AdobeEventTypes.AD_BREAK_START, sessionId: self.sessionId, eventMetadata: AdobeMetadata(params: params))
        }
    }
    
    func onAdBreakEnd(event: AdBreakEndEvent) -> Void {
        self.log("onAdBreakEnd triggered.")
        self.isPlayingAd = false
        self.adPodPosition = 1
        self.startPinger(CONTENT_PING_INTERVAL)
        self.sendEvent(eventType: AdobeEventTypes.AD_BREAK_COMPLETE, sessionId: self.sessionId)
    }
    
    func onAdBegin(event: AdBeginEvent) -> Void {
        self.log("onAdBegin triggered.")
        if let ad = event.ad {
            var params: [String:Any] = [:]
            params["media.ad.podPosition"] = self.adPodPosition
            params["media.ad.id"] = ad.id
            if let adDuration = ad.duration {
                params["media.ad.length"] = adDuration
            }
            params["media.ad.playerName"] = "THEOplayer"
            self.sendEvent(eventType: AdobeEventTypes.AD_START, sessionId: self.sessionId, eventMetadata: AdobeMetadata(params: params))
            
            self.adPodPosition += 1
        }
    }
    
    func onAdEnd(event: AdEndEvent) -> Void {
        self.log("onAdEnd triggered.")
        self.sendEvent(eventType: AdobeEventTypes.AD_COMPLETE, sessionId: self.sessionId)
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
    func maybeStartSession(completion: (()->Void)? = nil) -> Void {
        guard let player = self.player,
              let url = URL(string: self.uri) else {
            completion?()
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
        
        if (self.sessionInProgress || self.isPlayingAd || !hasValidSource || !hasValidDuration) {
            self.log("=> maybeStartSession - NOT started")
            completion?()
            return
        }
        
        let headers = ["Content-Type": "application/json", "User-Agent": self.userAgent]
        let initialBody = AdobeEventRequestBody(
            playerTime: AdobeEventRequestBodyPlayerTime (
                playhead: self.getCurrentTime(),
                ts: Int(Date().timeIntervalSince1970 * 1000)),
            eventType: AdobeEventTypes.SESSION_START.rawValue
        )
        
        var params: [String:Any] = [:]
        params["analytics.reportSuite"] = self.sid
        params["analytics.trackingServer"] = self.trackingUrl
        params["media.channel"] = "N/A"
        params["media.contentType"] = self.getContentType().rawValue
        params["media.id"] = "N/A"
        params["media.length"] = mediaLength
        params["media.playerName"] = "THEOplayer"
        params["visitor.marketingCloudOrgId"] = self.ecid
        if let friendlyName = player.source?.metadata?.title {
            params["media.name"] = friendlyName
        }
        initialBody.add(AdobeMetadata(params: params))
        
        if let currentCustomMetadata = self.currentMetadata {
            initialBody.add(currentCustomMetadata)
        }
        
        // send the data
        self.log("maybeStartSession - Starting session on url: \(self.uri) with body: \(initialBody.toDictionary())")
        AdobeUtils.shared.sendRequest(
            url: url,
            method: "POST",
            body: initialBody.toDictionary(),
            headers: headers) {[weak self] data, statusCode, responseHeaders, error in
                if let welf = self {
                    if statusCode != 201 {
                        welf.log("maybeStartSession - Failed to start session (statusCode: \(statusCode)): \(String(describing: error))")
                        completion?()
                    } else {
                        welf.sessionInProgress = true
                        welf.log("maybeStartSession - sessionInProgress")
                        
                        if let sessionId = AdobeUtils.extractSessionId(from: responseHeaders) {
                            welf.sessionId = sessionId
                            welf.log("maybeStartSession - STARTED (sessionID: \(welf.sessionId)")
                            welf.sendQueuedEvents {
                                if !welf.isPlayingAd {
                                    welf.startPinger(CONTENT_PING_INTERVAL)
                                } else {
                                    welf.startPinger(AD_PING_INTERVAL)
                                }
                                completion?()
                            }
                        } else {
                            completion?()
                        }
                    }
                }
            }
    }
    
    private func sendQueuedEvents(completion: (()->Void)? = nil) -> Void {
        guard self.eventQueue.count > 0,
              let url = URL(string: "\(self.uri)/\(self.sessionId)/events") else {
            completion?()
            return
        }
        
        let eventBody = self.eventQueue.removeFirst()
        self.log("Sending queued \(eventBody.eventType ?? " ")event on session \(self.sessionId)")
        AdobeUtils.shared.sendRequest(url: url,
                                      method: "POST",
                                      body: eventBody.toDictionary(),
                                      headers: ["Content-Type": "application/json", "User-Agent": self.userAgent]) { data, statusCode, headers, error in
            self.sendQueuedEvents(completion: completion)
        }
    }
    
    private func maybeEndSession(completion: (()->Void)? = nil) -> Void {
        self.log("maybeEndSession - sessionId: \(self.sessionId)");
        
        guard self.sessionId != "" else {
            completion?()
            return
        }
        
        // reset to unblock succeeding maybeStartSession from next source
        let sessionId = self.sessionId
        self.reset()
        
        self.sendEvent(eventType: AdobeEventTypes.SESSION_END, sessionId: sessionId) {
            completion?()
        }
    }
    
    private func reset() -> Void {
        self.log("reset");
        self.isPlayingAd = false;
        self.sessionId = "";
        self.sessionInProgress = false;
        self.pingTimer?.invalidate();
        self.pingTimer = nil
        self.adBreakPodIndex = 0;
        self.adPodPosition = 1;
        self.currentChapter = nil;
    }
    
    private func startPinger(_ interval: Double) {
        DispatchQueue.main.async {
            self.pingTimer?.invalidate()
            self.pingTimer = Timer.scheduledTimer(withTimeInterval: interval, repeats: true, block: { t in
                self.sendEvent(eventType: .PING, sessionId: self.sessionId)
            })
            self.log("Pinger started with interval \(interval).")
        }
    }
    
    private func sendEvent(eventType: AdobeEventTypes, sessionId: String, eventMetadata: AdobeMetadata? = nil, completion: (()->Void)? = nil) -> Void {
        let eventRequestBody = AdobeEventRequestBody(
            playerTime: AdobeEventRequestBodyPlayerTime (
                playhead: self.getCurrentTime(),
                ts: Int(Date().timeIntervalSince1970 * 1000)),
            eventType: eventType.rawValue
        )
        
        // add stored metadata, conditionally
        if let metaData = self.currentMetadata {
            // add stored customMetadata
            if eventType != AdobeEventTypes.PING {
                if eventType == AdobeEventTypes.AD_BREAK_START ||
                    eventType == AdobeEventTypes.CHAPTER_START ||
                    eventType == AdobeEventTypes.AD_START ||
                    eventType == AdobeEventTypes.SESSION_START {
                    eventRequestBody.add(AdobeMetadata(customMetadata: metaData.customMetadata ?? [:]))
                }
            }
            // add stored qoeData
            eventRequestBody.add(AdobeMetadata(qoeData: metaData.qoeData ?? [:]))
        }
        
        // Add passed eventMetadata
        if let metadata = eventMetadata {
            eventRequestBody.add(metadata)
        }
        
        // if session hasn't started yet --> add to queue
        if sessionId == "" {
            self.eventQueue.append(eventRequestBody)
            self.log("sendEvent - \(eventType.rawValue) event added to event queue.")
            completion?()
            return
        }
        // else, send...
        self.log("sendEvent - Sending \(eventType.rawValue) event on session \(sessionId)")
        if let url = URL(string: "\(self.uri)/\(sessionId)/events") {
            let headers = ["Content-Type": "application/json", "User-Agent": self.userAgent]
            AdobeUtils.shared.sendRequest(url: url,
                                          method: "POST",
                                          body: eventRequestBody.toDictionary(),
                                          headers: headers) { data, statusCode, headers, error in
                if statusCode == 404 || statusCode == 410 {
                    // Faulty session id, store in queue and restart session
                    self.eventQueue.append(eventRequestBody)
                    self.log("sendEvent - \(eventType.rawValue) sending failed. Restarting session.")
                    if self.sessionId != "" && self.sessionInProgress {
                        self.sessionId = ""
                        self.sessionInProgress = false
                        self.maybeStartSession() {
                            completion?()
                        }
                    }
                } else {
                    self.log("sendEvent - \(eventType.rawValue) responded with statusCode: \(statusCode).")
                    completion?()
                }
            }
        } else {
            completion?()
        }
    }
    
    private func getCurrentTime() -> Double {
        guard let player = self.player else {return 0.0}
        
        if let player = self.player,
           let duration = player.duration,
           duration == Double.infinity {
            // Live stream: return current second of the day
            let calendar = Calendar.current
            let now = Date()
            let components = calendar.dateComponents([.hour, .minute, .second], from: now)
            let secondsOfDay =
                (components.hour ?? 0) * 3600 +
                (components.minute ?? 0) * 60 +
                (components.second ?? 0)
            return Double(secondsOfDay)
        } else {
            // VOD: return currentTime in seconds
            return player.currentTime
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
    private func getContentLength(mediaLengthInSec: Double? = nil) -> Double {
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
