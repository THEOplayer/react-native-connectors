/**
 * Session details information related to the experience event.
 *
 * https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/sessiondetails.schema.md
 */
export interface AdobeSessionDetails {
  // This identifies an instance of a content stream unique to an individual playback.
  ID?: string;

  // The number of ads started during the playback.
  adCount?: number;

  // The type of ad loaded as defined by each customer's internal representation.
  adLoad?: string;

  // The name of the album that the music recording or video belongs to.
  album?: string;

  // The SDK version used by the player. This could have any custom value that makes sense for your player.
  appVersion?: string;

  // The name of the album artist or group performing the music recording or video.
  artist?: string;

  // This is the unique identifier for the content of the media asset, such as the TV series episode identifier,
  // movie asset identifier, or live event identifier. Typically, these IDs are derived from metadata authorities such
  // as EIDR, TMS/Gracenote, or Rovi. These identifiers can also be from other proprietary or in-house systems.
  assetID?: string;

  // Name of the media author.
  author?: string;

  // Describes the average content time spent for a specific media item - i.e. the total content time spent divided
  // by the length for all the playback sessions.
  averageMinuteAudience?: number;

  // Distribution channel from where the content was played.
  channel: string;

  // The number of chapters started during the playback.
  chapterCount?: number;

  // The type of the stream delivery. Available values per Stream Type: Audio: “song”, “podcast”, “audiobook”,
  // “radio”; Video: “VoD”, “Live”, “Linear”, “UGC”, “DVoD”. Customers can provide custom values for this parameter.
  contentType: ContentType;

  // A property that defines the time of the day when the content was broadcast or played. This could have any
  // value set as necessary by customers.
  dayPart?: string;

  // The number of the episode.
  episode?: string;

  // The estimated number of video or audio streams per each individual content.
  estimatedStreams?: number;

  // The type of feed, which can either represent actual feed-related data such as EAST HD or SD, or the source of
  // the feed like a URL.
  feed?: string;

  // The date when the content first aired on television. Any date format is acceptable,
  // but Adobe recommends: YYYY-MM-DD.
  firstAirDate?: string;

  // The date when the content first aired on any digital channel or platform. Any date format is acceptable but
  // Adobe recommends: YYYY-MM-DD.
  firstDigitalDate?: string;

  // This is the “friendly” (human-readable) name of the content.
  friendlyName?: string;

  // Type or grouping of content as defined by content producer. Values should be comma delimited in variable
  // implementation.
  genre?: string;

  // Indicates if one or more pauses occurred during the playback of a single media item.
  hasPauseImpactedStreams?: boolean;

  // Indicates that the playhead passed the 10% marker of media based on stream length. The marker is only counted
  // once, even if seeking backwards. If seeking forward, markers that are skipped are not counted.
  hasProgress10?: boolean;

  // Indicates that the playhead passed the 25% marker of media based on stream length. Marker only counted once,
  // even if seeking backwards. If seeking forward, markers that are skipped are not counted.
  hasProgress25?: boolean;

  // Indicates that the playhead passed the 50% marker of media based on stream length. Marker only counted once,
  // even if seeking backwards. If seeking forward, markers that are skipped are not counted.
  hasProgress50?: boolean;

  // Indicates that the playhead passed the 75% marker of media based on stream length. Marker only counted once,
  // even if seeking backwards. If seeking forward, markers that are skipped are not counted.
  hasProgress75?: boolean;

  // Indicates that the playhead passed the 95% marker of media based on stream length. Marker only counted once,
  // even if seeking backwards. If seeking forward, markers that are skipped are not counted.
  hasProgress95?: boolean;

  // Marks each playback that was resumed after more than 30 minutes of buffer, pause, or stall period.
  hasResume?: boolean;

  // Indicates when at least one frame, not necessarily the first has been viewed.
  hasSegmentView?: boolean;

  // The user has been authorized via Adobe authentication.
  isAuthorized?: boolean;

  // Indicates if a timed media asset was watched to completion, this does not necessarily mean the viewer watched
  // the whole video; viewer could have skipped ahead.
  isCompleted?: boolean;

  // The stream was played locally on the device after being downloaded.
  isDownloaded?: boolean;

  // Set to true when the hit is federated (i.e., received by the customer as part of a federated data share,
  // rather than their own implementation).
  isFederated?: boolean;

  // First frame of media is consumed. If the user drops during ad, buffering, etc., then there would be no
  // “Content Start” event.
  isPlayed?: boolean;

  // Load event for the media. (This occurs when the viewer clicks the Play button).
  // This would count even if there are pre-roll ads, buffering, errors, and so on.
  isViewed?: boolean;

  // Name of the record label.
  label?: string;

  // Clip Length/Runtime - This is the maximum length (or duration) of the content being consumed (in seconds).
  length: number;

  // MVPD provided via Adobe authentication.
  mvpd?: string;

  // Content ID of the content, which can be used to tie back to other industry / CMS IDs.
  name: string;

  // The network/channel name.
  network?: string;

  // Creator of the content.
  originator?: string;

  // The number of pause periods that occurred during playback.
  pauseCount?: number;

  // Describes the duration in seconds in which playback was paused by the user.
  pauseTime?: number;

  // Name of the content player.
  playerName: string;

  // Name of the audio content publisher.
  publisher?: string;

  // Rating as defined by TV Parental Guidelines.
  rating?: string;

  // The season number the show belongs to. Season Series is required only if the show is part of a series.
  season?: string;

  // Indicates the amount of time, in seconds, that passed between the user's last known interaction and the moment
  // the session was closed.
  secondsSinceLastCall?: number;

  // The interval that describes the part of the content that has been viewed in minutes.
  segment?: string;

  // Program/Series Name. Program Name is required only if the show is part of a series.
  show?: string;

  // The type of content for example, trailer or full episode.
  showType?: string;

  // The radio station name on which the audio is played.
  station?: string;

  // Format of the stream (HD, SD).
  streamFormat?: string;

  // The type of the media stream.
  streamType?: StreamType;

  // Sums the event duration (in seconds) for all events of type PLAY on the main content.
  timePlayed?: number;

  // Describes the total amount of time spent by a user on a specific timed media asset, which includes time spent
  // watching ads.
  totalTimePlayed?: number;

  // Describes the sum of the unique intervals seen by a user on a timed media asset - i.e. the length playback
  // intervals viewed multiple times are only counted once.
  uniqueTimePlayed?: number;
}

/**
 * The type of the stream delivery. Available values per Stream Type: Audio: “song”, “podcast”, “audiobook”,
 * “radio”; Video: “VoD”, “Live”, “Linear”, “UGC”, “DVoD”. Customers can provide custom values for this parameter.
 *
 * https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/sessiondetails.schema.md#xdmcontenttype-known-values
 */
export enum ContentType {
  // Video-on-demand
  VOD = 'VOD',

  // Live streaming
  LIVE = 'Live',

  // Linear playback of the media asset
  LINEAR = 'Linear',

  // User-generated content
  UGC = 'UGC',

  // Downloaded video-on-demand
  DVOD = 'DVOD',

  // Radio show
  RADIO = 'Radio',

  // Audio podcast
  PODCAST = 'Podcast',

  // Audiobook
  AUDIOBOOK = 'Audiobook',

  // Song
  SONG = 'Song',
}

/**
 * The type of the media stream.
 *
 * https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/sessiondetails.schema.md#xdmstreamtype
 */
export enum StreamType {
  VIDEO = 'video',
  AUDIO = 'audio',
}
