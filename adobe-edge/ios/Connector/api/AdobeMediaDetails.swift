//  AdobeMediaDetails.swift

/// Media details information.
///
/// - SeeAlso: [Adobe XDM MediaDetails Schema](https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/mediadetails.schema.md)
struct AdobeMediaDetails: Codable {
    /// If the content is live, the playhead must be the current second of the day, 0 <= playhead < 86400.
    /// If the content is recorded, the playhead must be the current second of content, 0 <= playhead < content length.
    let playhead: Int?

    /// Identifies an instance of a content stream unique to an individual playback.
    let sessionID: String?

    /// Session details information related to the experience event.
    let sessionDetails: AdobeSessionDetails?

    /// Advertising details information related to the experience event.
    let advertisingDetails: AdobeAdvertisingDetails?

    /// Advertising Pod details information
    let advertisingPodDetails: AdobeAdvertisingPodDetails?

    /// Chapter details information related to the experience event.
    let chapterDetails: AdobeChapterDetails?

    /// Error details information related to the experience event.
    let errorDetails: AdobeErrorDetails?

    /// Qoe data details information related to the experience event.
    let qoeDataDetails: AdobeQoeDataDetails?

    /// The list of states start.
    let statesStart: [AdobePlayerStateData]?

    /// The list of states end.
    let statesEnd: [AdobePlayerStateData]?

    /// The list of states.
    let states: [AdobePlayerStateData]?

    /// The list of custom metadata.
    let customMetadata: [AdobeCustomMetadataDetails]?
}
