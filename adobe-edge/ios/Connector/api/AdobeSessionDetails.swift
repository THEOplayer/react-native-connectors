//  AdobeSessionDetails.swift

/// Session details information related to the experience event.
///
/// - SeeAlso: [Adobe XDM SessionDetails Schema](https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/sessiondetails.schema.md)
struct AdobeSessionDetails: Codable {
    /// This identifies an instance of a content stream unique to an individual playback.
    var ID: String?
    
    /// The number of ads started during the playback.
    var adCount: Int?
    
    /// The type of ad loaded as defined by each customer's internal representation.
    var adLoad: String?
    
    /// The name of the album that the music recording or video belongs to.
    var album: String?
    
    /// The SDK version used by the player.
    var appVersion: String?
    
    /// The name of the album artist or group performing the music recording or video.
    var artist: String?
    
    /// This is the unique identifier for the content of the media asset.
    var assetID: String?
    
    /// Name of the media author.
    var author: String?
    
    /// Describes the average content time spent for a specific media item.
    var averageMinuteAudience: Int?
    
    /// Distribution channel from where the content was played.
    var channel: String
    
    /// The number of chapters started during the playback.
    var chapterCount: Int?
    
    /// The type of the stream delivery.
    var contentType: ContentType
    
    /// A property that defines the time of the day when the content was broadcast or played.
    var dayPart: String?
    
    /// The number of the episode.
    var episode: String?
    
    /// The estimated number of video or audio streams per each individual content.
    var estimatedStreams: Int?
    
    /// The type of feed, which can either represent actual feed-related data such as EAST HD or SD, or the source of the feed like a URL.
    var feed: String?
    
    /// The date when the content first aired on television.
    var firstAirDate: String?
    
    /// The date when the content first aired on any digital channel or platform.
    var firstDigitalDate: String?
    
    /// This is the "friendly" (human-readable) name of the content.
    var friendlyName: String?
    
    /// Type or grouping of content as defined by content producer.
    var genre: String?
    
    /// Indicates if one or more pauses occurred during the playback of a single media item.
    var hasPauseImpactedStreams: Bool?
    
    /// Indicates that the playhead passed the 10% marker of media based on stream length.
    var hasProgress10: Bool?
    
    /// Indicates that the playhead passed the 25% marker of media based on stream length.
    var hasProgress25: Bool?
    
    /// Indicates that the playhead passed the 50% marker of media based on stream length.
    var hasProgress50: Bool?
    
    /// Indicates that the playhead passed the 75% marker of media based on stream length.
    var hasProgress75: Bool?
    
    /// Indicates that the playhead passed the 95% marker of media based on stream length.
    var hasProgress95: Bool?
    
    /// Marks each playback that was resumed after more than 30 minutes of buffer, pause, or stall period.
    var hasResume: Bool?
    
    /// Indicates when at least one frame, not necessarily the first has been viewed.
    var hasSegmentView: Bool?
    
    /// The user has been authorized via Adobe authentication.
    var isAuthorized: Bool?
    
    /// Indicates if a timed media asset was watched to compvarion.
    var isCompvared: Bool?
    
    /// The stream was played locally on the device after being downloaded.
    var isDownloaded: Bool?
    
    /// Set to true when the hit is federated.
    var isFederated: Bool?
    
    /// First frame of media is consumed.
    var isPlayed: Bool?
    
    /// Load event for the media.
    var isViewed: Bool?
    
    /// Name of the record label.
    var label: String?
    
    /// Clip Length/Runtime - This is the maximum length (or duration) of the content being consumed (in seconds).
    var length: Int
    
    /// MVPD provided via Adobe authentication.
    var mvpd: String?
    
    /// Content ID of the content, which can be used to tie back to other industry / CMS IDs.
    var name: String
    
    /// The network/channel name.
    var network: String?
    
    /// Creator of the content.
    var originator: String?
    
    /// The number of pause periods that occurred during playback.
    var pauseCount: Int?
    
    /// Describes the duration in seconds in which playback was paused by the user.
    var pauseTime: Int?
    
    /// Name of the content player.
    var playerName: String
    
    /// Name of the audio content publisher.
    var publisher: String?
    
    /// Rating as defined by TV Parental Guidelines.
    var rating: String?
    
    /// The season number the show belongs to.
    var season: String?
    
    /// Indicates the amount of time, in seconds, that passed between the user's last known interaction and the moment the session was closed.
    var secondsSinceLastCall: Int?
    
    /// The interval that describes the part of the content that has been viewed in minutes.
    var segment: String?
    
    /// Program/Series Name.
    var show: String?
    
    /// The type of content for example, trailer or full episode.
    var showType: String?
    
    /// The radio station name on which the audio is played.
    var station: String?
    
    /// Format of the stream (HD, SD).
    var streamFormat: String?
    
    /// The type of the media stream.
    var streamType: StreamType?
    
    /// Sums the event duration (in seconds) for all events of type PLAY on the main content.
    var timePlayed: Int?
    
    /// Describes the total amount of time spent by a user on a specific timed media asset, which includes time spent watching ads.
    var totalTimePlayed: Int?
    
    /// Describes the sum of the unique intervals seen by a user on a timed media asset.
    var uniqueTimePlayed: Int?
}

/// The type of the stream delivery.
enum ContentType: String, Codable {
    case vod = "VOD"
    case live = "LIVE"
    case linear = "LINEAR"
    case ugc = "UGC"
    case dvod = "DVOD"
    case radio = "RADIO"
    case podcast = "PODCAST"
    case audiobook = "AUDIOBOOK"
    case song = "SONG"
}

/// The type of the media stream.
enum StreamType: String, Codable {
    case video = "VIDEO"
    case audio = "AUDIO"
}
