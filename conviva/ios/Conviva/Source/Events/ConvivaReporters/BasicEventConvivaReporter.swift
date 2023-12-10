//
//  BasicEventConvivaReporter.swift
//  
//
//  Created by Damiaan Dufaux on 01/09/2022.
//

import ConvivaSDK
import THEOplayerSDK

class BasicEventConvivaReporter: BasicEventProcessor {
    
    struct Session {
        struct Source {
            let description: SourceDescription
            let url: String?
        }
        var started = false
        var source: Source?
    }
    
    /// The endpoint to which all the events are sent
    let conviva: CISVideoAnalytics
    let storage: ConvivaConnectorStorage
    
    var currentSession = Session()
        
    init(conviva: CISVideoAnalytics, storage: ConvivaConnectorStorage) {
        self.conviva = conviva
        self.storage = storage
    }

    func play(event: PlayEvent) {
        guard !currentSession.started else { return }
        conviva.reportPlaybackRequested(nil)
        currentSession.started = true
    }
    
    func playing(event: PlayingEvent) {
        conviva.reportPlaybackMetric(CIS_SSDK_PLAYBACK_METRIC_PLAYER_STATE, value: PlayerState.CONVIVA_PLAYING.rawValue)
    }
    
    func timeUpdate(event: TimeUpdateEvent) {
        conviva.reportPlaybackMetric(CIS_SSDK_PLAYBACK_METRIC_PLAY_HEAD_TIME, value: event.currentTimeInMilliseconds)
    }
    
    func pause(event: PauseEvent) {
        conviva.reportPlaybackMetric(CIS_SSDK_PLAYBACK_METRIC_PLAYER_STATE, value: PlayerState.CONVIVA_PAUSED.rawValue)
    }
    
    func waiting(event: WaitingEvent) {
        conviva.reportPlaybackMetric(CIS_SSDK_PLAYBACK_METRIC_PLAYER_STATE, value: PlayerState.CONVIVA_BUFFERING.rawValue)
    }
    
    func seeking(event: SeekingEvent) {
        conviva.reportPlaybackMetric(CIS_SSDK_PLAYBACK_METRIC_SEEK_STARTED, value: event.currentTimeInMilliseconds)
    }
    
    func seeked(event: SeekedEvent) {
        conviva.reportPlaybackMetric(CIS_SSDK_PLAYBACK_METRIC_SEEK_ENDED, value: event.currentTimeInMilliseconds)
    }
    
    func error(event: ErrorEvent) {
        conviva.reportPlaybackFailed(event.error, contentInfo: nil)
    }
    
    func networkError(event: NetworkErrorEvent) {
        conviva.reportPlaybackError(event.error?.message ?? Utilities.defaultStringValue, errorSeverity: .ERROR_WARNING)
    }
    
    func sourceChange(event: SourceChangeEvent, selectedSource: String?) {
        if event.source != currentSession.source?.description, currentSession.source != nil {
            reportEndedIfPlayed()
        }
        
        // clear all stored values for the previous source
        self.storage.clear()
        
        let newSource: Session.Source?
        
        if let source = event.source, let url = selectedSource {
            newSource = .init(description: source, url: url)
            let assetName = source.metadata?.title ?? Utilities.defaultStringValue;
            let contentInfo = [
                CIS_SSDK_METADATA_PLAYER_NAME: Utilities.playerFrameworkName,
                CIS_SSDK_METADATA_STREAM_URL: url,
                CIS_SSDK_METADATA_ASSET_NAME: assetName,
                CIS_SSDK_METADATA_IS_LIVE: NSNumber(value: false),
                CIS_SSDK_METADATA_DURATION: NSNumber(value: -1)
            ] as [String: Any]
            self.conviva.setContentInfo(contentInfo)
            self.storage.storeKeyValuePair(key: CIS_SSDK_METADATA_ASSET_NAME, value: assetName)
        } else {
            newSource = nil
            #if DEBUG
            print("[THEOplayerConnectorConviva] setting unknown source")
            #endif
        }
        currentSession.source = newSource
    }
    
    func renderedFramerateUpdate(framerate: Float) {
        conviva.reportPlaybackMetric(CIS_SSDK_PLAYBACK_METRIC_RENDERED_FRAMERATE, value: NSNumber(value: Int(framerate.rounded())))
    }
    
    func ended(event: EndedEvent) {
        conviva.reportPlaybackMetric(CIS_SSDK_PLAYBACK_METRIC_PLAYER_STATE, value: PlayerState.CONVIVA_STOPPED.rawValue)
        reportEndedIfPlayed()
    }
    
    func reportEndedIfPlayed() {
        if currentSession.started {
            conviva.reportPlaybackEnded()
            currentSession = Session()
        }
    }
    
    func durationChange(event: DurationChangeEvent) {
        if let duration = event.duration, currentSession.source?.url != nil {
            if duration.isInfinite {
                conviva.setContentInfo([
                    CIS_SSDK_METADATA_IS_LIVE: NSNumber(value: true)
                ])
            } else {
                conviva.setContentInfo([
                    CIS_SSDK_METADATA_IS_LIVE: NSNumber(value: false),
                    CIS_SSDK_METADATA_DURATION: NSNumber(value: duration)
                ])
            }
        }
    }
    
    func destroy(event: DestroyEvent) {
        reportEndedIfPlayed()
    }
    
    deinit {
        reportEndedIfPlayed()
    }
}
