import THEOplayerSDK
import ConvivaSDK

public typealias ExternalEventDispatcher = THEOplayerSDK.EventDispatcherProtocol & THEOplayerSDK.DispatchDispatch

/// Connects to a THEOplayer instance and reports its events to conviva
public struct ConvivaConnector: ConvivaEndpointContainer {
    public let conviva: ConvivaEndpoints
    public let player: THEOplayer
    public let storage: ConvivaConnectorStorage
    
    let appEventForwarder: AppEventForwarder
    let basicEventForwarder: BasicEventForwarder
    let adEventHandler: AdEventForwarder?
    
    public init?(configuration: ConvivaConfiguration, player: THEOplayer, externalEventDispatcher: ExternalEventDispatcher? = nil) {
        guard let endpoints = ConvivaEndpoints(configuration: configuration) else { return nil }
        self.init(conviva: endpoints, player: player, externalEventDispatcher: externalEventDispatcher)
    }

    public init(conviva: ConvivaEndpoints, player: THEOplayer, externalEventDispatcher: ExternalEventDispatcher? = nil) {
        self.conviva = conviva
        self.player = player
        self.storage = ConvivaConnectorStorage()
        
        let (analytics, videoAnalytics, adAnalytics) = (conviva.analytics, conviva.videoAnalytics, conviva.adAnalytics)
        
        appEventForwarder = AppEventForwarder(
            player: player,
            eventProcessor: AppEventConvivaReporter(analytics: analytics, video: videoAnalytics, ads: adAnalytics, storage: storage)
        )
        
        basicEventForwarder = BasicEventForwarder(
            player: player,
            eventProcessor: BasicEventConvivaReporter(conviva: videoAnalytics, storage: storage)
        )
        
        adEventHandler = AdEventForwarder(
            player: player,
            externalEventDispatcher: externalEventDispatcher,
            eventProcessor: AdEventConvivaReporter(video: videoAnalytics, ads: adAnalytics, storage: storage, player: player)
        )
    }
}

extension THEOplayer {
    var hasAdsImplementation: Bool {
        getAllIntegrations().contains { $0.type == .ADS }
    }
}
