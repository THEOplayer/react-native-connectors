package com.theoplayer.reactnative.adobe.edge.api

/**
 * Session details information related to the experience event.
 *
 * @see <a href="https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/sessiondetails.schema.md">Adobe XDM SessionDetails Schema</a>
 */
data class AdobeSessionDetails(
  // This identifies an instance of a content stream unique to an individual playback.
  val ID: String? = null,
  // The number of ads started during the playback.
  val adCount: Int? = null,
  // The type of ad loaded as defined by each customer's internal representation.
  val adLoad: String? = null,
  // The name of the album that the music recording or video belongs to.
  val album: String? = null,
  // The SDK version used by the player.
  val appVersion: String? = null,
  // The name of the album artist or group performing the music recording or video.
  val artist: String? = null,
  // This is the unique identifier for the content of the media asset.
  val assetID: String? = null,
  // Name of the media author.
  val author: String? = null,
  // Describes the average content time spent for a specific media item.
  val averageMinuteAudience: Double? = null,
  // Distribution channel from where the content was played.
  val channel: String,
  // The number of chapters started during the playback.
  val chapterCount: Int? = null,
  // The type of the stream delivery.
  val contentType: ContentType,
  // A property that defines the time of the day when the content was broadcast or played.
  val dayPart: String? = null,
  // The number of the episode.
  val episode: String? = null,
  // The estimated number of video or audio streams per each individual content.
  val estimatedStreams: Int? = null,
  // The type of feed, which can either represent actual feed-related data such as EAST HD or SD, or the source of the feed like a URL.
  val feed: String? = null,
  // The date when the content first aired on television.
  val firstAirDate: String? = null,
  // The date when the content first aired on any digital channel or platform.
  val firstDigitalDate: String? = null,
  // This is the “friendly” (human-readable) name of the content.
  val friendlyName: String? = null,
  // Type or grouping of content as defined by content producer.
  val genre: String? = null,
  // Indicates if one or more pauses occurred during the playback of a single media item.
  val hasPauseImpactedStreams: Boolean? = null,
  // Indicates that the playhead passed the 10% marker of media based on stream length.
  val hasProgress10: Boolean? = null,
  // Indicates that the playhead passed the 25% marker of media based on stream length.
  val hasProgress25: Boolean? = null,
  // Indicates that the playhead passed the 50% marker of media based on stream length.
  val hasProgress50: Boolean? = null,
  // Indicates that the playhead passed the 75% marker of media based on stream length.
  val hasProgress75: Boolean? = null,
  // Indicates that the playhead passed the 95% marker of media based on stream length.
  val hasProgress95: Boolean? = null,
  // Marks each playback that was resumed after more than 30 minutes of buffer, pause, or stall period.
  val hasResume: Boolean? = null,
  // Indicates when at least one frame, not necessarily the first has been viewed.
  val hasSegmentView: Boolean? = null,
  // The user has been authorized via Adobe authentication.
  val isAuthorized: Boolean? = null,
  // Indicates if a timed media asset was watched to completion.
  val isCompleted: Boolean? = null,
  // The stream was played locally on the device after being downloaded.
  val isDownloaded: Boolean? = null,
  // Set to true when the hit is federated.
  val isFederated: Boolean? = null,
  // First frame of media is consumed.
  val isPlayed: Boolean? = null,
  // Load event for the media.
  val isViewed: Boolean? = null,
  // Name of the record label.
  val label: String? = null,
  // Clip Length/Runtime - This is the maximum length (or duration) of the content being consumed (in seconds).
  val length: Double,
  // MVPD provided via Adobe authentication.
  val mvpd: String? = null,
  // Content ID of the content, which can be used to tie back to other industry / CMS IDs.
  val name: String,
  // The network/channel name.
  val network: String? = null,
  // Creator of the content.
  val originator: String? = null,
  // The number of pause periods that occurred during playback.
  val pauseCount: Int? = null,
  // Describes the duration in seconds in which playback was paused by the user.
  val pauseTime: Double? = null,
  // Name of the content player.
  val playerName: String,
  // Name of the audio content publisher.
  val publisher: String? = null,
  // Rating as defined by TV Parental Guidelines.
  val rating: String? = null,
  // The season number the show belongs to.
  val season: String? = null,
  // Indicates the amount of time, in seconds, that passed between the user's last known interaction and the moment the session was closed.
  val secondsSinceLastCall: Double? = null,
  // The interval that describes the part of the content that has been viewed in minutes.
  val segment: String? = null,
  // Program/Series Name.
  val show: String? = null,
  // The type of content for example, trailer or full episode.
  val showType: String? = null,
  // The radio station name on which the audio is played.
  val station: String? = null,
  // Format of the stream (HD, SD).
  val streamFormat: String? = null,
  // The type of the media stream.
  val streamType: StreamType? = null,
  // Sums the event duration (in seconds) for all events of type PLAY on the main content.
  val timePlayed: Double? = null,
  // Describes the total amount of time spent by a user on a specific timed media asset, which includes time spent watching ads.
  val totalTimePlayed: Double? = null,
  // Describes the sum of the unique intervals seen by a user on a timed media asset.
  val uniqueTimePlayed: Double? = null
)

/**
 * The type of the stream delivery.
 */
enum class ContentType {
  // Video-on-demand
  VOD,
  // Live streaming
  LIVE,
  // Linear playback of the media asset
  LINEAR,
  // User-generated content
  UGC,
  // Downloaded video-on-demand
  DVOD,
  // Radio show
  RADIO,
  // Audio podcast
  PODCAST,
  // Audiobook
  AUDIOBOOK,
  // Song
  SONG
}

/**
 * The type of the media stream.
 */
enum class StreamType {
  VIDEO,
  AUDIO
}
