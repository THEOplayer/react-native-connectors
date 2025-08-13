import THEOplayerSDK
import Collections
#if canImport(AdScriptApiClient)
import AdScriptApiClient
#endif

public struct LogPoint {
    let name: AdScriptEventName;
    let cue: Double;
}

let LOG_PLAYER_EVENTS = false
let LOG_ADSCRIPT_EVENTS = false

public class AdScriptAdapter {
    private let player: THEOplayer
    private var contentMetadata: AdScriptDataObject
    private var contentLogPoints: Deque<LogPoint> = Deque<LogPoint>()
    private var adMetadata: AdScriptDataObject? = nil
    private var waitingForFirstSecondOfAd = false
    private var waitingForFirstSecondOfSsaiAdSince: Double? = nil
    private let configuration: AdScriptConfiguration
    private let adscriptCollector: AdScriptCollector

    private var playEventListener: EventListener?
    private var playingEventListener: EventListener?
    private var errorEventListener: EventListener?
    private var sourceChangeEventListener: EventListener?
    private var endedEventListener: EventListener?
    private var durationChangeEventListener: EventListener?
    private var timeUpdateEventListener: EventListener?
    private var volumeChangeEventListener: EventListener?
    private var rateChangeEventListener: EventListener?
    private var presentationModeChangeEventListener: EventListener?

    private var adBreakBeginListener: EventListener?
    private var adBeginListener: EventListener?
    private var adFirstQuartileListener: EventListener?
    private var adMidpointListener: EventListener?
    private var adThirdQuartileListener: EventListener?
    private var adCompletedListener: EventListener?
    private var adBreakEndedListener: EventListener?


    public init(configuration: AdScriptConfiguration, player: THEOplayer, metadata: AdScriptDataObject) {
        self.player = player
        self.contentMetadata = metadata
        self.configuration = configuration

        self.adscriptCollector = AdScriptCollector(implementationId: configuration.implementationId, isDebug: configuration.debug && LOG_ADSCRIPT_EVENTS)

        reportPlayerState()
        addEventListeners()
    }

    public func sessionStart() {
        self.adscriptCollector.sessionStart()
    }

    public func update(metadata: AdScriptDataObject) {
        self.contentMetadata = metadata
    }

    public func updateUser(i12n: AdScriptI12n) {
        self.adscriptCollector.i12n = i12n
    }

    private func reportPlayerState() {
        reportFullscreen(isFullscreen: player.presentationMode == PresentationMode.fullscreen)
        reportDimensions(width: player.videoWidth, height: player.videoHeight)
        reportPlaybackSpeed(playbackRate: player.playbackRate)
        reportVolumeAndMuted(isMuted: player.muted, volume: player.volume)
        reportTriggeredByUser(autoplayEnabled: player.autoplay)
        reportVisibility()
    }

    private func reportFullscreen(isFullscreen: Bool) {
        _ = self.adscriptCollector.playerState.set(key: AdScriptPlayerStateKey.fullscreen, value: isFullscreen ? 1 : 0)
    }

    private func reportDimensions(width: Int, height: Int) {
        _ = self.adscriptCollector.playerState.set(key: AdScriptPlayerStateKey.width, value: width)
        _ = self.adscriptCollector.playerState.set(key: AdScriptPlayerStateKey.height, value: height)
    }

    private func reportPlaybackSpeed(playbackRate: Double) {
        _ = self.adscriptCollector.playerState.set(key: AdScriptPlayerStateKey.normalSpeed, value: playbackRate == 1 ? 1 : 0)
    }

    private func reportVolumeAndMuted(isMuted: Bool, volume: Float) {
        _ = self.adscriptCollector.playerState.set(key: AdScriptPlayerStateKey.muted, value: (isMuted || volume == 0) ? 1 : 0)
        _ = self.adscriptCollector.playerState.set(key: AdScriptPlayerStateKey.volume, value: Int(volume))
    }
    private func reportTriggeredByUser(autoplayEnabled: Bool) {
        _ = self.adscriptCollector.playerState.set(key: AdScriptPlayerStateKey.triggeredByUser, value: autoplayEnabled ? 1 : 0)
    }

    private func reportVisibility() {
        // TODO
    }

    private func handlePlaying(event: PlayingEvent) {
        if (self.configuration.debug && LOG_PLAYER_EVENTS) {
            print("[AdScriptConnector] Player Event: \(event.type) : currentTime = \(event.currentTime)")
        }
        if (self.player.ads.playing) {
            if let adMetadata = self.adMetadata {
                if (self.configuration.debug) {
                    print("[AdScriptConnector] Push .start event with adMetadata \(adMetadata.toJsonString())")
                }
                self.adscriptCollector.push(event: .start, data: adMetadata)
            }
        } else {
            if (self.configuration.debug) {
                print("[AdScriptConnector] Push .start event with contentMetadata \(contentMetadata.toJsonString())")
            }
            self.adscriptCollector.push(event: .start, data: self.contentMetadata)
            // TODO check if flag is needed or just one playing event is dispatched on iOS
        }
        if let playingEventListener: THEOplayerSDK.EventListener = self.playingEventListener {
            self.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.PLAYING, listener: playingEventListener)
        }
    }

    private func addLogPoints(duration: Double?) {
        if let duration = duration {
            if (duration.isFinite) {
                self.contentLogPoints.append(LogPoint(name: .progress1 , cue: 1.0))
                self.contentLogPoints.append(LogPoint(name: .firstQuartile , cue: 0.25 * duration))
                self.contentLogPoints.append(LogPoint(name: .midpoint , cue: 0.5 * duration))
                self.contentLogPoints.append(LogPoint(name: .thirdQuartile , cue: 0.75 * duration))
            } else {
                self.contentLogPoints.append(LogPoint(name: .progress1, cue: 1.0))
            }
            if (self.configuration.debug) {
                print("[AdScriptConnector] Stored \(self.contentLogPoints.count) logPoints : \(self.contentLogPoints.debugDescription)")
            }
        }

    }

    private func reportLogPoint(name: AdScriptEventName) {
        if (self.configuration.debug) {
            print("[AdScriptConnector] Push .\(name.rawValue) event with contentMetadata \(contentMetadata.toJsonString())")
        }
        self.adscriptCollector.push(event: name, data: self.contentMetadata)
    }

    private func maybeReportAdProgress(currentTime: Double) {
        if (!self.waitingForFirstSecondOfAd) { return }
        if let currentAd = player.ads.currentAds.first {
            switch currentAd.integration {
            case .google_ima:
                if let adMetadata = self.adMetadata, currentTime >= 1 {
                    if (self.configuration.debug) {
                        print("[AdScriptConnector] Push .progress1 event with adMetadata \(adMetadata.toJsonString())")
                    }
                    self.adscriptCollector.push(event: .progress1, data: adMetadata)
                    self.waitingForFirstSecondOfAd = false
                }
            case .google_dai:
                if let waitingSince = self.waitingForFirstSecondOfSsaiAdSince,
                   let adMetadata = self.adMetadata,
                   currentTime >= waitingSince + 1.0 {
                        if (self.configuration.debug) {
                            print("[AdScriptConnector] Push .progress1 event with adMetadata \(adMetadata.toJsonString())")
                        }
                        self.adscriptCollector.push(event: .progress1, data: adMetadata)
                        self.waitingForFirstSecondOfAd = false
                        self.waitingForFirstSecondOfSsaiAdSince = nil
                    }
            case .theoads:
                if (self.configuration.debug) { print("[AdScriptConnector] Ad Integration is not supported (maybeReportAdProgress)") }
            case .custom:
                if (self.configuration.debug) { print("[AdScriptConnector] Ad Integration is not supported (maybeReportAdProgress)") }
            @unknown default:
                if (self.configuration.debug) { print("[AdScriptConnector] Ad Integration is not supported (maybeReportAdProgress)") }
            }
        }
    }

    private func maybeReportProgress(currentTime: Double) {
        if (player.ads.playing) {
            maybeReportAdProgress(currentTime: currentTime)
            return
        }

        let nextLogPoint = contentLogPoints.first
        if (nextLogPoint != nil && currentTime >= nextLogPoint!.cue) {
            reportLogPoint(name: nextLogPoint!.name)
            contentLogPoints.removeFirst()
        }
    }

    private func getAdType(offset: Int) -> AdScriptDataValueType {
        if (offset == 0) {
            return .preroll
        } else if (offset == -1) {
            return .postroll
        } else if let duration = player.duration, offset >= Int(floor(duration)) {
            return .postroll
        } else {
            return .midroll
        }
    }

    private func buildAdMetadata(ad: THEOplayerSDK.Ad) {
        if (false) {
            // TODO provide adProcessor
        } else {
            var currentAdMetadata = AdScriptDataObject()
            if let id = ad.id {
                _ = currentAdMetadata.set(key: .assetId, value: id)
                _ = currentAdMetadata.set(key: .title, value: id)

            }
//            _ = currentAdMetadata.set(key: .asmea, value: "TODO")
            _ = currentAdMetadata.set(key: .attribute, value: .commercial)
            _ = currentAdMetadata.set(key: .type, value: self.getAdType(offset: ad.adBreak.timeOffset))
            if let duration = ad.duration {
                _ = currentAdMetadata.set(key: .length, value: duration)
            }

            adMetadata = currentAdMetadata
        }
    }


    private func addEventListeners() {
        self.playEventListener = player.addEventListener(type: THEOplayerSDK.PlayerEventTypes.PLAY, listener: { [weak self] event in
            guard let welf: AdScriptAdapter = self else { return }
            if (welf.configuration.debug && LOG_PLAYER_EVENTS) {
                print("[AdScriptConnector] Player Event: \(event.type) : currentTime = \(event.currentTime)")
            }
        })
        self.playingEventListener = player.addEventListener(type: THEOplayerSDK.PlayerEventTypes.PLAYING, listener:  { [weak self] event in self?.handlePlaying(event: event) })
        self.errorEventListener = player.addEventListener(type: THEOplayerSDK.PlayerEventTypes.ERROR, listener: { [weak self] event in
            guard let welf: AdScriptAdapter = self else { return }
            if let code = event.errorObject?.code, let cause = event.errorObject?.cause, welf.configuration.debug && LOG_PLAYER_EVENTS {
                print("[AdScriptConnector] Player Event: \(event.type) : code = \(code) ; cause = \(cause)")
            }
        })
        self.sourceChangeEventListener = player.addEventListener(type: THEOplayerSDK.PlayerEventTypes.SOURCE_CHANGE, listener: { [weak self] event in
            guard let welf: AdScriptAdapter = self else { return }
            if (welf.configuration.debug && LOG_PLAYER_EVENTS) {
                print("[AdScriptConnector] Player Event: \(event.type) : source = \(event.source.debugDescription)")
            }

            if let playingEventListener: THEOplayerSDK.EventListener = welf.playingEventListener {
                welf.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.PLAYING, listener: playingEventListener)
            }
            welf.contentLogPoints = Deque<LogPoint>()
            welf.playingEventListener = welf.player.addEventListener(type: THEOplayerSDK.PlayerEventTypes.PLAYING, listener:  { [weak self] event in self?.handlePlaying(event: event) })
        })
        self.endedEventListener = player.addEventListener(type: THEOplayerSDK.PlayerEventTypes.ENDED, listener: { [weak self] event in
            guard let welf: AdScriptAdapter = self else { return }
            if (welf.configuration.debug && LOG_PLAYER_EVENTS) {
                print("[AdScriptConnector] Player Event: \(event.type) : currentTime = \(event.currentTime)")
            }
            if (welf.configuration.debug) {
                print("[AdScriptConnector] Push .complete event with contentMetadata \(welf.contentMetadata.toJsonString())")
            }
            welf.adscriptCollector.push(event: .complete, data: welf.contentMetadata)
        })
        self.durationChangeEventListener = player.addEventListener(type: THEOplayerSDK.PlayerEventTypes.DURATION_CHANGE, listener: { [weak self] event in
            guard let welf: AdScriptAdapter = self else { return }
            if let duration = event.duration, welf.configuration.debug && LOG_PLAYER_EVENTS {
                print("[AdScriptConnector] Player Event: \(event.type) : duration = \(duration)")
            }
            welf.addLogPoints(duration: event.duration)
        })
        self.timeUpdateEventListener = player.addEventListener(type: THEOplayerSDK.PlayerEventTypes.TIME_UPDATE, listener: { [weak self] event in
            guard let welf: AdScriptAdapter = self else { return }
            if (welf.configuration.debug && LOG_PLAYER_EVENTS) {
                print("[AdScriptConnector] Player Event: \(event.type) : currentTime = \(event.currentTime)")
            }
            welf.maybeReportProgress(currentTime: event.currentTime)
        })
        self.volumeChangeEventListener = player.addEventListener(type: THEOplayerSDK.PlayerEventTypes.VOLUME_CHANGE, listener: { [weak self] event in
            guard let welf: AdScriptAdapter = self else { return }
            if (welf.configuration.debug && LOG_PLAYER_EVENTS) {
                print("[AdScriptConnector] Player Event: \(event.type) : volume = \(event.volume)")
            }
            welf.reportVolumeAndMuted(isMuted: welf.player.muted, volume: event.volume)
        })
        self.rateChangeEventListener = player.addEventListener(type: THEOplayerSDK.PlayerEventTypes.RATE_CHANGE, listener: { [weak self] event in
            guard let welf: AdScriptAdapter = self else { return }
            if (welf.configuration.debug && LOG_PLAYER_EVENTS) {
                print("[AdScriptConnector] Player Event: \(event.type) : playbackRate = \(event.playbackRate)")
            }
            welf.reportPlaybackSpeed(playbackRate: event.playbackRate)
        })
        self.presentationModeChangeEventListener = player.addEventListener(type: THEOplayerSDK.PlayerEventTypes.PRESENTATION_MODE_CHANGE, listener: { [weak self] event in
            guard let welf: AdScriptAdapter = self else { return }
            if (welf.configuration.debug && LOG_PLAYER_EVENTS) {
                print("[AdScriptConnector] Player Event: \(event.type) : presentationMode = \(event.presentationMode._rawValue)")
            }
            welf.reportFullscreen(isFullscreen: event.presentationMode == PresentationMode.fullscreen)
        })


        if (hasAdIntegration()) {
            self.adBreakBeginListener = player.ads.addEventListener(type: THEOplayerSDK.AdsEventTypes.AD_BREAK_BEGIN, listener: { [weak self] event in
                guard let welf: AdScriptAdapter = self else { return }
                if let offset = event.ad?.timeOffset, welf.configuration.debug && LOG_PLAYER_EVENTS {
                    print("[AdScriptConnector] Player Event: \(event.type) : offset = \(offset)")
                }
            })
            self.adBeginListener = player.ads.addEventListener(type: THEOplayerSDK.AdsEventTypes.AD_BEGIN, listener: { [weak self] event in
                guard let welf: AdScriptAdapter = self else { return }
                if let id = event.ad?.id, welf.configuration.debug && LOG_PLAYER_EVENTS {
                    print("[AdScriptConnector] Player Event: \(event.type) : id = \(id)")
                }
                guard let ad = event.ad else { return }
                welf.buildAdMetadata(ad: ad)
                welf.waitingForFirstSecondOfAd = true
                if (event.ad?.integration == .google_dai) {
                    welf.waitingForFirstSecondOfSsaiAdSince = welf.player.currentTime
                }
                guard let adMetadata = self?.adMetadata else { return }
                if (welf.configuration.debug) {
                    print("[AdScriptConnector] Push .start event with adMetadata \(adMetadata.toJsonString())")
                }
                welf.adscriptCollector.push(event: .start, data: adMetadata)
            })
            self.adFirstQuartileListener = player.ads.addEventListener(type: THEOplayerSDK.AdsEventTypes.AD_FIRST_QUARTILE, listener: { [weak self] event in
                guard let welf: AdScriptAdapter = self else { return }
                if let id = event.ad?.id, welf.configuration.debug && LOG_PLAYER_EVENTS {
                    print("[AdScriptConnector] Player Event: \(event.type) : id = \(id)")
                }
                guard let adMetadata = welf.adMetadata else { return }
                if (welf.configuration.debug) {
                    print("[AdScriptConnector] Push .firstQuartile event with adMetadata \(adMetadata.toJsonString())")
                }
                welf.adscriptCollector.push(event: .firstQuartile, data: adMetadata)
            })
            self.adMidpointListener = player.ads.addEventListener(type: THEOplayerSDK.AdsEventTypes.AD_MIDPOINT, listener: { [weak self] event in
                guard let welf: AdScriptAdapter = self else { return }
                if let id = event.ad?.id, welf.configuration.debug && LOG_PLAYER_EVENTS {
                    print("[AdScriptConnector] Player Event: \(event.type) : id = \(id)")
                }
                guard let adMetadata = welf.adMetadata else { return }
                if (welf.configuration.debug) {
                    print("[AdScriptConnector] Push .midpoint event with adMetadata \(adMetadata.toJsonString())")
                }
                welf.adscriptCollector.push(event: .midpoint, data: adMetadata)
            })
            self.adThirdQuartileListener = player.ads.addEventListener(type: THEOplayerSDK.AdsEventTypes.AD_THIRD_QUARTILE, listener: { [weak self] event in
                guard let welf: AdScriptAdapter = self else { return }
                if let id = event.ad?.id, welf.configuration.debug {
                    print("[AdScriptConnector] Player Event: \(event.type) : id = \(id)")
                }
                guard let adMetadata = welf.adMetadata else { return }
                if (welf.configuration.debug) {
                    print("[AdScriptConnector] Push .thirdQuartile event with adMetadata \(adMetadata.toJsonString())")
                }
                welf.adscriptCollector.push(event: .thirdQuartile, data: adMetadata)
            })
            self.adCompletedListener = player.ads.addEventListener(type: THEOplayerSDK.AdsEventTypes.AD_END, listener: { [weak self] event in
                guard let welf: AdScriptAdapter = self else { return }
                if let id = event.ad?.id, welf.configuration.debug && LOG_PLAYER_EVENTS {
                    print("[AdScriptConnector] Player Event: \(event.type) : id = \(id)")
                }
                guard let adMetadata = welf.adMetadata else { return }
                if (welf.configuration.debug) {
                    print("[AdScriptConnector] Push .complete event with adMetadata \(adMetadata.toJsonString())")
                }
                welf.adscriptCollector.push(event: .complete, data: adMetadata)
            })
            self.adBreakEndedListener = player.ads.addEventListener(type: THEOplayerSDK.AdsEventTypes.AD_BREAK_END, listener: { [weak self] event in
                guard let welf: AdScriptAdapter = self else { return }
                if let offset = event.ad?.timeOffset, welf.configuration.debug && LOG_PLAYER_EVENTS {
                    print("[AdScriptConnector] Player Event: \(event.type) : offset = \(offset)")
                }
                if (event.ad?.timeOffset == 0) {
                    welf.playingEventListener = welf.player.addEventListener(type: THEOplayerSDK.PlayerEventTypes.PLAYING, listener:  { [weak self] event in self?.handlePlaying(event: event) })
                }
            })
        }
    }

    private func removeEventListeners() {
        if let playEventListener: THEOplayerSDK.EventListener = self.playEventListener {
            self.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.TIME_UPDATE, listener: playEventListener)
        }
        if let playingEventListener: THEOplayerSDK.EventListener = self.playingEventListener {
            self.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.PLAYING, listener: playingEventListener)
        }
        if let errorEventListener: THEOplayerSDK.EventListener = self.errorEventListener {
            self.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.ERROR, listener: errorEventListener)
        }
        if let sourceChangeEventListener: THEOplayerSDK.EventListener = self.sourceChangeEventListener {
            self.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.SOURCE_CHANGE, listener: sourceChangeEventListener)
        }
        if let endedEventListener: THEOplayerSDK.EventListener = self.endedEventListener {
            self.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.ENDED, listener: endedEventListener)
        }
        if let durationChangeEventListener: THEOplayerSDK.EventListener = self.durationChangeEventListener {
            self.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.DURATION_CHANGE, listener: durationChangeEventListener)
        }
        if let timeUpdateEventListener: THEOplayerSDK.EventListener = self.timeUpdateEventListener {
            self.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.TIME_UPDATE, listener: timeUpdateEventListener)
        }
        if let volumeChangeEventListener: THEOplayerSDK.EventListener = self.volumeChangeEventListener {
            self.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.VOLUME_CHANGE, listener: volumeChangeEventListener)
        }
        if let rateChangeEventListener: THEOplayerSDK.EventListener = self.rateChangeEventListener {
            self.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.RATE_CHANGE, listener: rateChangeEventListener)
        }
        if let presentationModeChangeEventListener: THEOplayerSDK.EventListener = self.presentationModeChangeEventListener {
            self.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.PRESENTATION_MODE_CHANGE, listener: presentationModeChangeEventListener)
        }
        if let adBreakBeginListener: THEOplayerSDK.EventListener = self.adBreakBeginListener {
            self.player.removeEventListener(type: THEOplayerSDK.AdsEventTypes.AD_BREAK_BEGIN, listener: adBreakBeginListener)
        }
        if let adBeginListener: THEOplayerSDK.EventListener = self.adBeginListener {
            self.player.removeEventListener(type: THEOplayerSDK.AdsEventTypes.AD_BEGIN, listener: adBeginListener)
        }
        if let adFirstQuartileListener: THEOplayerSDK.EventListener = self.adFirstQuartileListener {
            self.player.removeEventListener(type: THEOplayerSDK.AdsEventTypes.AD_FIRST_QUARTILE, listener: adFirstQuartileListener)
        }
        if let adMidpointListener: THEOplayerSDK.EventListener = self.adMidpointListener {
            self.player.removeEventListener(type: THEOplayerSDK.AdsEventTypes.AD_MIDPOINT, listener: adMidpointListener)
        }
        if let adThirdQuartileListener: THEOplayerSDK.EventListener = self.adThirdQuartileListener {
            self.player.removeEventListener(type: THEOplayerSDK.AdsEventTypes.AD_THIRD_QUARTILE, listener: adThirdQuartileListener)
        }
        if let adCompletedListener: THEOplayerSDK.EventListener = self.adCompletedListener {
            self.player.removeEventListener(type: THEOplayerSDK.AdsEventTypes.AD_END, listener: adCompletedListener)
        }
        if let adBreakEndedListener: THEOplayerSDK.EventListener = self.adBreakEndedListener {
            self.player.removeEventListener(type: THEOplayerSDK.AdsEventTypes.AD_BREAK_END, listener: adBreakEndedListener)
        }
    }

    private func hasAdIntegration() -> Bool {
        let hasAdIntegration = player.getAllIntegrations().contains { integration in
            switch integration.kind {
            case IntegrationKind.GOOGLE_DAI:
                return true
            case IntegrationKind.GOOGLE_IMA:
                return true
            default:
                print("[AdScriptConnector] no supported ad integration was found")
                return false
            }
        }
        return hasAdIntegration
    }
}
