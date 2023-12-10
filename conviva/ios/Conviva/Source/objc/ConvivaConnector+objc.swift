import THEOplayerSDK
import ConvivaSDK

/// Connects to a THEOplayer instance and reports its events to conviva
@objc public class THEOplayerConvivaConnector: NSObject {
    let internalConnector: ConvivaConnector
    
    @objc public convenience init?(configuration: THEOplayerConnectorConvivaConfiguration, player: THEOplayer) {
        guard let endpoints = ConvivaEndpoints(configuration: configuration) else { return nil }
        self.init(conviva: endpoints, player: player)
    }

    public init(conviva: ConvivaEndpoints, player: THEOplayer) {
        internalConnector = ConvivaConnector(conviva: conviva, player: player)
    }
    
    @objc
    public func report(viewerID: String) {
        internalConnector.report(viewerID: viewerID)
    }
    
    @objc
    public func report(assetName: String) {
        internalConnector.report(assetName: assetName)
    }
}
