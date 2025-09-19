//  AdobePlayerStateData.swift

/// Player state data information.
///
/// - SeeAlso: [Adobe XDM PlayerStateData Schema](https://github.com/adobe/xdm/blob/master/components/datatypes/playerstatedata.schema.json)
struct AdobePlayerStateData: Codable {
    /// The name of the player state.
    let name: String

    /// Whether or not the player state is set on that state.
    let isSet: Bool?

    /// The number of times that player state was set on the stream.
    let count: Int?

    /// The total duration of that player state.
    let time: Int?
}
