import THEOplayerSDK
#if canImport(GemiusSDK)
import GemiusSDK
#endif

let LOG_PLAYER_EVENTS = false
let LOG_GEMIUS_EVENTS = false

public class GemiusAdapter {
  private let player: THEOplayer
  private let configuration: GemiusConfiguration
  private var gsmPlayer: GSMPlayer
  private let adProcessor: ((THEOplayerSDK.Ad) -> GemiusSDK.GSMAdData)?
  
  private var programId: String?
  private var programData: GemiusSDK.GSMProgramData?
  
  private var partCount = 1
  private var adCount = 1
  private var currentAd: Ad? = nil
  
  private var sourceChangeEventListener: EventListener?
  private var playingEventListener: EventListener?
  private var playEventListener: EventListener?
  private var pauseEventListener: EventListener?
  private var waitingEventListener: EventListener?
  private var seekingEventListener: EventListener?
  private var errorEventListener: EventListener?
  private var endedEventListener: EventListener?
  private var volumeChangeEventListener: EventListener?
  
  private var addVideoTrackEventListener: EventListener?
  private var removeVideoTrackEventListener: EventListener?
  private var videoQualityChangedEventListener: EventListener?
  
  private var adBreakBeginListener: EventListener?
  private var adBeginListener: EventListener?
  private var adEndListener: EventListener?
  private var adSkipListener: EventListener?
  private var adBreakEndedListener: EventListener?
  
  public init(configuration: GemiusConfiguration, player: THEOplayer, adProcessor: ((THEOplayerSDK.Ad) -> GemiusSDK.GSMAdData)? = nil) {
    self.player = player
    self.configuration = configuration
    self.adProcessor = adProcessor
    let playerData = GemiusSDK.GSMPlayerData()
    playerData.resolution = "\(player.frame.width)x\(player.frame.height)"
    if (player.muted) {
      playerData.volume = -1
    } else {
      playerData.volume = NSNumber(value: player.volume * 100)
    }
    GemiusSDK.GEMConfig.sharedInstance().loggingEnabled = configuration.debug
    GemiusSDK.GEMConfig.sharedInstance().setAppInfo(configuration.applicationName, version: configuration.applicationVersion)
    self.gsmPlayer = GemiusSDK.GSMPlayer(id: "THEOplayer", withHost: configuration.hitCollectorHost, withGemiusID: configuration.gemiusId, with: playerData)
    
    addEventListeners()
  }
  
  deinit {
    destroy()
  }
  
  public func destroy() {
    removeEventListeners()
  }
  
  public func update(programId: String, programData: GemiusSDK.GSMProgramData) {
    self.programId = programId
    self.programData = programData
  }
  
  private func addEventListeners() {
    self.sourceChangeEventListener = player.addEventListener(type: THEOplayerSDK.PlayerEventTypes.SOURCE_CHANGE, listener: { [weak self] event in
      guard let welf: GemiusAdapter = self else { return }
      if (welf.configuration.debug && LOG_PLAYER_EVENTS) {
        print("[GemiusConnector] Player Event: \(event.type) : source = \(event.source.debugDescription)")
      }
      welf.partCount = 1
      welf.currentAd = nil
      if let programData = welf.programData, let programId = welf.programId {
        welf.gsmPlayer.newProgram(programId, with: programData)
      } else {
        print("[GemiusConnector] No program parameters were provided")
      }
      
      if let playingEventListener: THEOplayerSDK.EventListener = welf.playingEventListener {
        welf.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.PLAYING, listener: playingEventListener)
      }
      welf.playingEventListener = welf.player.addEventListener(type: THEOplayerSDK.PlayerEventTypes.PLAYING, listener:  { [weak self] event in self?.handleFirstPlaying(event: event) })
    })
    self.playingEventListener = player.addEventListener(type: THEOplayerSDK.PlayerEventTypes.PLAYING, listener:  { [weak self] event in self?.handleFirstPlaying(event: event) })
    self.playEventListener = player.addEventListener(type: THEOplayerSDK.PlayerEventTypes.PLAY, listener: { [weak self] event in
      guard let welf: GemiusAdapter = self else { return }
      if (welf.configuration.debug && LOG_PLAYER_EVENTS) {
        print("[GemiusConnector] Player Event: \(event.type) : currentTime = \(event.currentTime)")
      }
      let computedVolume = welf.player.muted ? -1 : Int(welf.player.volume * 100)
      if let currentAd = welf.currentAd, let id = currentAd.id {
        let adBreak = currentAd.adBreak
        let offset = adBreak.timeOffset
        let adEventData = GSMEventAdData()
        adEventData.adDuration = NSNumber(value: currentAd.duration ?? 0)
        adEventData.autoPlay = welf.player.autoplay ? 1 : 0
        adEventData.adPosition = NSNumber(value: welf.adCount)
        adEventData.breakSize = NSNumber(value: adBreak.ads.count)
        adEventData.volume = NSNumber(value: computedVolume)
        welf.gsmPlayer.adEvent(.PLAY, forProgram: welf.programId, forAd: id, atOffset: NSNumber(value: offset), with: adEventData)
      } else {
        if (welf.hasPrerollScheduled()) { return }
        let programEventData = GSMEventProgramData()
        programEventData.autoPlay = welf.player.autoplay ? 1 : 0
        programEventData.volume = NSNumber(value: computedVolume)
        programEventData.partID = NSNumber(value: welf.partCount)
        programEventData.programDuration = NSNumber(value: welf.player.duration ?? 0)
        welf.gsmPlayer.program(.PLAY, forProgram: welf.programId, atOffset: NSNumber(value: welf.player.currentTime), with: programEventData)
      }
    })
    self.pauseEventListener = player.addEventListener(type: THEOplayerSDK.PlayerEventTypes.PAUSE, listener: { [weak self] event in
      guard let welf: GemiusAdapter = self else { return }
      if (welf.configuration.debug && LOG_PLAYER_EVENTS) {
        print("[GemiusConnector] Player Event: \(event.type) : currentTime = \(event.currentTime)")
      }
      welf.reportBasicEvent(event: .PAUSE)
    })
    self.waitingEventListener = player.addEventListener(type: THEOplayerSDK.PlayerEventTypes.WAITING, listener: { [weak self] event in
      guard let welf: GemiusAdapter = self else { return }
      if (welf.configuration.debug && LOG_PLAYER_EVENTS) {
        print("[GemiusConnector] Player Event: \(event.type) : currentTime = \(event.currentTime)")
      }
      welf.reportBasicEvent(event: .BUFFER)
    })
    self.seekingEventListener = player.addEventListener(type: THEOplayerSDK.PlayerEventTypes.SEEKING, listener: { [weak self] event in
      guard let welf: GemiusAdapter = self else { return }
      if (welf.configuration.debug && LOG_PLAYER_EVENTS) {
        print("[GemiusConnector] Player Event: \(event.type) : currentTime = \(event.currentTime)")
      }
      welf.reportBasicEvent(event: .SEEK)
    })
    self.errorEventListener = player.addEventListener(type: THEOplayerSDK.PlayerEventTypes.ERROR, listener: { [weak self] event in
      guard let welf: GemiusAdapter = self else { return }
      if let code = event.errorObject?.code, let cause = event.errorObject?.cause, welf.configuration.debug && LOG_PLAYER_EVENTS {
        print("[GemiusConnector] Player Event: \(event.type) : code = \(code) ; cause = \(cause)")
      }
      welf.reportBasicEvent(event: .COMPLETE)
    })
    self.endedEventListener = player.addEventListener(type: THEOplayerSDK.PlayerEventTypes.ENDED, listener: { [weak self] event in
      guard let welf: GemiusAdapter = self else { return }
      if (welf.configuration.debug && LOG_PLAYER_EVENTS) {
        print("[GemiusConnector] Player Event: \(event.type) : currentTime = \(event.currentTime)")
      }
      welf.reportBasicEvent(event: .COMPLETE)
    })
    self.volumeChangeEventListener = player.addEventListener(type: THEOplayerSDK.PlayerEventTypes.VOLUME_CHANGE, listener: { [weak self] event in
      guard let welf: GemiusAdapter = self else { return }
      if (welf.configuration.debug && LOG_PLAYER_EVENTS) {
        print("[GemiusConnector] Player Event: \(event.type) : volume = \(event.volume)")
      }
      let computedVolume = welf.player.muted ? -1 : Int(welf.player.volume * 100)
      let programId = welf.programId
      if let currentAd = welf.currentAd, let id = currentAd.id {
        let adBreak = currentAd.adBreak
        let adEventData = GSMEventAdData()
        adEventData.volume = NSNumber(value: computedVolume)
        welf.gsmPlayer.adEvent(.CHANGE_VOL, forProgram: programId, forAd: id, atOffset: NSNumber(value: adBreak.timeOffset), with: adEventData)
      } else {
        let programEventData = GSMEventProgramData()
        programEventData.volume = NSNumber(value: computedVolume)
        welf.gsmPlayer.program(.CHANGE_VOL, forProgram: programId, atOffset: NSNumber( value: welf.player.currentTime), with: programEventData)
      }
    })
    
    self.addVideoTrackEventListener = player.videoTracks.addEventListener(type: VideoTrackListEventTypes.ADD_TRACK, listener: { [weak self] event in
      guard let welf: GemiusAdapter = self else { return }
      let videoTrack = event.track
      welf.videoQualityChangedEventListener =  videoTrack.addEventListener(type: MediaTrackEventTypes.ACTIVE_QUALITY_CHANGED) { [weak self] event in
        let programId = welf.programId
        let height = welf.player.videoHeight
        let width = welf.player.videoWidth
        if let currentAd = welf.currentAd, let id = currentAd.id {
          let adBreak = currentAd.adBreak
          let adEventData = GSMEventAdData()
          adEventData.quality = "\(width)x\(height)"
          welf.gsmPlayer.adEvent(.CHANGE_QUAL, forProgram: programId, forAd: id, atOffset: NSNumber(value: adBreak.timeOffset), with: adEventData)
        } else {
          let programEventData = GSMEventProgramData()
          programEventData.quality = "\(width)x\(height)"
          welf.gsmPlayer.program(.CHANGE_QUAL, forProgram: programId, atOffset: NSNumber(value: welf.player.currentTime), with: programEventData)
        }
      }
    })
    self.removeVideoTrackEventListener = player.videoTracks.addEventListener(type: VideoTrackListEventTypes.REMOVE_TRACK, listener: { [weak self] event in
      guard let welf: GemiusAdapter = self else { return }
      let videoTrack = event.track
      if let videoQualityChangedEventListener: THEOplayerSDK.EventListener = welf.videoQualityChangedEventListener {
        videoTrack.removeEventListener(type: THEOplayerSDK.MediaTrackEventTypes.ACTIVE_QUALITY_CHANGED, listener: videoQualityChangedEventListener)
      }
    })
    
    if (hasAdIntegration()) {
      self.adBreakBeginListener = player.ads.addEventListener(type: THEOplayerSDK.AdsEventTypes.AD_BREAK_BEGIN, listener: { [weak self] event in
        guard let welf: GemiusAdapter = self else { return }
        if let offset = event.ad?.timeOffset, welf.configuration.debug && LOG_PLAYER_EVENTS {
          print("[GemiusConnector] Player Event: \(event.type) : offset = \(offset)")
        }
        welf.reportBasicEvent(event: .BREAK)
        if let playingEventListener: THEOplayerSDK.EventListener = welf.playingEventListener {
          welf.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.PLAYING, listener: playingEventListener)
        }
        welf.playingEventListener = welf.player.addEventListener(type: THEOplayerSDK.PlayerEventTypes.PLAYING, listener:  { [weak self] event in self?.handleFirstPlaying(event: event) })
      })
      self.adBeginListener = player.ads.addEventListener(type: THEOplayerSDK.AdsEventTypes.AD_BEGIN, listener: { [weak self] event in
        guard let welf: GemiusAdapter = self else { return }
        if let id = event.ad?.id, welf.configuration.debug && LOG_PLAYER_EVENTS {
          print("[GemiusConnector] Player Event: \(event.type) : id = \(id)")
        }
        guard let ad = event.ad, let id = ad.id else { return }
        welf.currentAd = ad
        let adData = welf.buildAdData(ad: ad)
        welf.gsmPlayer.newAd(id, with: adData)
      })
      self.adEndListener = player.ads.addEventListener(type: THEOplayerSDK.AdsEventTypes.AD_END, listener: { [weak self] event in
        guard let welf: GemiusAdapter = self else { return }
        if let id = event.ad?.id, welf.configuration.debug && LOG_PLAYER_EVENTS {
          print("[GemiusConnector] Player Event: \(event.type) : id = \(id)")
        }
        guard let ad = event.ad, let id = ad.id else { return }
        welf.reportBasicEvent(event: .COMPLETE)
        welf.reportBasicEvent(event: .CLOSE)
        welf.adCount += 1
        welf.currentAd = nil
        if let playingEventListener: THEOplayerSDK.EventListener = welf.playingEventListener {
          welf.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.PLAYING, listener: playingEventListener)
        }
        welf.playingEventListener = welf.player.addEventListener(type: THEOplayerSDK.PlayerEventTypes.PLAYING, listener:  { [weak self] event in self?.handleFirstPlaying(event: event) })
        
      })
      self.adSkipListener = player.ads.addEventListener(type: THEOplayerSDK.AdsEventTypes.AD_SKIP, listener: { [weak self] event in
        guard let welf: GemiusAdapter = self else { return }
        if let id = event.ad?.id, welf.configuration.debug && LOG_PLAYER_EVENTS {
          print("[GemiusConnector] Player Event: \(event.type) : id = \(id)")
        }
        welf.reportBasicEvent(event: .SKIP)
      })
      self.adBreakEndedListener = player.ads.addEventListener(type: THEOplayerSDK.AdsEventTypes.AD_BREAK_END, listener: { [weak self] event in
        
        guard let welf: GemiusAdapter = self else { return }
        welf.adCount = 1
        guard let offset = event.ad?.timeOffset else { return }
        if  welf.configuration.debug && LOG_PLAYER_EVENTS {
          print("[GemiusConnector] Player Event: \(event.type) : offset = \(offset)")
        }
        if (offset > 0) {
          welf.partCount += 1
        }
        welf.gsmPlayer.newProgram(welf.programId, with: welf.programData)
        if let playingEventListener: THEOplayerSDK.EventListener = welf.playingEventListener {
          welf.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.PLAYING, listener: playingEventListener)
        }
        if (event.ad?.timeOffset == 0) {
          welf.playingEventListener = welf.player.addEventListener(type: THEOplayerSDK.PlayerEventTypes.PLAYING, listener:  { [weak self] event in self?.handleFirstPlaying(event: event) })
        }
      })
    }
  }
  
  private func removeEventListeners() {
    if let sourceChangeEventListener: THEOplayerSDK.EventListener = self.sourceChangeEventListener {
      self.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.SOURCE_CHANGE, listener: sourceChangeEventListener)
    }
    if let playingEventListener: THEOplayerSDK.EventListener = self.playingEventListener {
      self.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.PLAYING, listener: playingEventListener)
    }
    if let playEventListener: THEOplayerSDK.EventListener = self.playEventListener {
      self.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.PLAY, listener: playEventListener)
    }
    if let pauseEventListener: THEOplayerSDK.EventListener = self.pauseEventListener {
      self.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.PAUSE, listener: pauseEventListener)
    }
    if let waitingEventListener: THEOplayerSDK.EventListener = self.waitingEventListener {
      self.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.WAITING, listener: waitingEventListener)
    }
    if let seekingEventListener: THEOplayerSDK.EventListener = self.seekingEventListener {
      self.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.SEEKING, listener: seekingEventListener)
    }
    if let errorEventListener: THEOplayerSDK.EventListener = self.errorEventListener {
      self.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.ERROR, listener: errorEventListener)
    }
    if let endedEventListener: THEOplayerSDK.EventListener = self.endedEventListener {
      self.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.ENDED, listener: endedEventListener)
    }
    if let volumeChangeEventListener: THEOplayerSDK.EventListener = self.volumeChangeEventListener {
      self.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.VOLUME_CHANGE, listener: volumeChangeEventListener)
    }
    if let adBreakBeginListener: THEOplayerSDK.EventListener = self.adBreakBeginListener {
      self.player.removeEventListener(type: THEOplayerSDK.AdsEventTypes.AD_BREAK_BEGIN, listener: adBreakBeginListener)
    }
    if let adBeginListener: THEOplayerSDK.EventListener = self.adBeginListener {
      self.player.removeEventListener(type: THEOplayerSDK.AdsEventTypes.AD_BEGIN, listener: adBeginListener)
    }
    if let adEndListener: THEOplayerSDK.EventListener = self.adEndListener {
      self.player.removeEventListener(type: THEOplayerSDK.AdsEventTypes.AD_END, listener: adEndListener)
    }
    if let adSkipListener: THEOplayerSDK.EventListener = self.adSkipListener {
      self.player.removeEventListener(type: THEOplayerSDK.AdsEventTypes.AD_SKIP, listener: adSkipListener)
    }
    if let adBreakEndedListener: THEOplayerSDK.EventListener = self.adBreakEndedListener {
      self.player.removeEventListener(type: THEOplayerSDK.AdsEventTypes.AD_BREAK_END, listener: adBreakEndedListener)
    }
    if let addVideoTrackEventListener: THEOplayerSDK.EventListener = self.addVideoTrackEventListener {
      self.player.videoTracks.removeEventListener(type: THEOplayerSDK.VideoTrackListEventTypes.ADD_TRACK, listener: addVideoTrackEventListener)
    }
    if let removeVideoTrackEventListener: THEOplayerSDK.EventListener = self.removeVideoTrackEventListener {
      self.player.videoTracks.removeEventListener(type: THEOplayerSDK.VideoTrackListEventTypes.REMOVE_TRACK, listener: removeVideoTrackEventListener)
    }
  }
  
  private func handleFirstPlaying(event: PlayingEvent) {
    if (self.configuration.debug && LOG_PLAYER_EVENTS) {
      print("[GemiusConnector] Player Event: \(event.type) : currentTime = \(event.currentTime)")
    }
    let computedVolume = player.muted ? -1 : Int(player.volume * 100)
    if let currentAd = self.currentAd, let id = currentAd.id {
      let adBreak = currentAd.adBreak
      let offset = adBreak.timeOffset
      let adEventData = GSMEventAdData()
      adEventData.adDuration = NSNumber(value: currentAd.duration ?? 0)
      adEventData.autoPlay = self.player.autoplay ? 1 : 0
      adEventData.adPosition = NSNumber(value: self.adCount)
      adEventData.breakSize = NSNumber(value: adBreak.ads.count)
      adEventData.volume = NSNumber(value: computedVolume)
      self.gsmPlayer.adEvent(.PLAY, forProgram: self.programId, forAd: id, atOffset: NSNumber(value: offset), with: adEventData)
    } else {
      if (hasPrerollScheduled()) { return }
      let programEventData = GSMEventProgramData()
      programEventData.autoPlay = self.player.autoplay ? 1 : 0
      programEventData.volume = NSNumber(value: computedVolume)
      programEventData.partID = NSNumber(value: self.partCount)
      programEventData.programDuration = NSNumber(value: self.player.duration ?? 0)
      self.gsmPlayer.program(.PLAY, forProgram: self.programId, atOffset: NSNumber(value: self.player.currentTime), with: programEventData)
    }
    
    if let playingEventListener: THEOplayerSDK.EventListener = self.playingEventListener {
      self.player.removeEventListener(type: THEOplayerSDK.PlayerEventTypes.PLAYING, listener: playingEventListener)
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
        print("[GemiusConnector] no supported ad integration was found")
        return false
      }
    }
    return hasAdIntegration
  }
  
  private func buildAdData(ad: THEOplayerSDK.Ad) -> GemiusSDK.GSMAdData {
    if let adProcessor = self.adProcessor {
      return adProcessor(ad)
    }
    let adData = GemiusSDK.GSMAdData()
    if [AdIntegrationKind.google_ima, AdIntegrationKind.google_dai].contains(ad.integration),
       let imaAd = ad as? GoogleImaAd {
      adData.name = imaAd.creativeId
    }
    
    adData.adFormat = .video
    adData.adType = .AD_BREAK
    if let duration = ad.duration {
      adData.duration = NSNumber(value: duration)
    }
    adData.name = ad.id
    adData.quality = "\(ad.width)x\(ad.height)"
    adData.resolution = "\(player.frame.width)x\(player.frame.height)"
    return adData
  }
  
  private func reportBasicEvent(event: GemiusSDK.GSMEventType) {
    guard let programId = self.programId else { return }
    if let currentAd =  self.currentAd {
      self.gsmPlayer.adEvent(event, forProgram: programId, forAd: currentAd.id, atOffset: NSNumber(value: currentAd.adBreak.timeOffset), with: nil)
      
    } else {
      self.gsmPlayer.program(event, forProgram: programId, atOffset: NSNumber(value: player.currentTime), with: nil)
      
    }
  }
  
  private func hasPrerollScheduled() -> Bool {
    player.ads.scheduledAdBreaks.contains(where: {adBreak in adBreak.timeOffset == 0})
  }
}
