import THEOplayerSDK
#if os(tvOS) && canImport(GemiusSDKtvOS)
import GemiusSDKtvOS
#else
import GemiusSDK
#endif

public struct GemiusConfiguration {
  let applicationName: String
  let applicationVersion: String
  let hitCollectorHost: String
  let gemiusId: String
  let debug: Bool
  let adProcessor: ((THEOplayerSDK.Ad) -> GSMAdData)?
  
  public init(applicationName: String, applicationVersion: String, hitCollectorHost: String, gemiusId: String, debug: Bool, adProcessor: ((THEOplayerSDK.Ad) -> GSMAdData)? = nil) {
    self.applicationName = applicationName
    self.applicationVersion = applicationVersion
    self.hitCollectorHost = hitCollectorHost
    self.gemiusId = gemiusId
    self.debug = debug
    self.adProcessor = adProcessor
  }
}

public struct GemiusConnector {
  private let adapter: GemiusAdapter
  private let player: THEOplayer
  
  
  public init(configuration: GemiusConfiguration, player: THEOplayer) {
    self.player = player
    self.adapter = GemiusAdapter(configuration: configuration, player: player, adProcessor: configuration.adProcessor)
  }
  
  public func update(programId: String, programData: GSMProgramData) {
    self.adapter.update(programId: programId, programData: programData)
  }
  
  public func destroy() {
    self.adapter.destroy()
  }
}
