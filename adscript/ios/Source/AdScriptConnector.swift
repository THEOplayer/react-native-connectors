import THEOplayerSDK
#if canImport(AdScriptApiClient)
import AdScriptApiClient
#endif

public struct AdScriptConfiguration {
    let implementationId: String
    let debug: Bool

    public init(implementationId: String, debug: Bool) {
        self.implementationId = implementationId
        self.debug = debug
    }
}

public struct AdScriptConnector {
    private let adapter: AdScriptAdapter
    private let player: THEOplayer


    public init(configuration: AdScriptConfiguration, player: THEOplayer, metadata: AdScriptDataObject) {
        self.player = player
        self.adapter = AdScriptAdapter(configuration: configuration, player: player, metadata: metadata)
    }

    public func sessionStart() {
        self.adapter.sessionStart()
    }

    public func update(metadata: AdScriptDataObject) {
        self.adapter.update(metadata: metadata)
    }

    public func updateUser(i12n: AdScriptI12n) {
        self.adapter.updateUser(i12n: i12n)
    }
}
