package com.theoplayer.reactnative.adobe.edge.api

/**
 * Media details information.
 *
 * @see <a href="https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/mediadetails.schema.md">Adobe XDM MediaDetails Schema</a>
 */
data class AdobeMediaDetails(
  // If the content is live, the playhead must be the current second of the day, 0 <= playhead < 86400.
  // If the content is recorded, the playhead must be the current second of content, 0 <= playhead < content length.
  val playhead: Double? = null,
  // Identifies an instance of a content stream unique to an individual playback.
  val sessionID: String? = null,
  // Session details information related to the experience event.
  val sessionDetails: AdobeSessionDetails? = null,
  // Advertising details information related to the experience event.
  val advertisingDetails: AdobeAdvertisingDetails? = null,
  // Advertising Pod details information
  val advertisingPodDetails: AdobeAdvertisingPodDetails? = null,
  // Chapter details information related to the experience event.
  val chapterDetails: AdobeChapterDetails? = null,
  // Error details information related to the experience event.
  val errorDetails: AdobeErrorDetails? = null,
  // Qoe data details information related to the experience event.
  val qoeDataDetails: AdobeQoeDataDetails? = null,
  // The list of states start.
  val statesStart: List<AdobePlayerStateData>? = null,
  // The list of states end.
  val statesEnd: List<AdobePlayerStateData>? = null,
  // The list of states.
  val states: List<AdobePlayerStateData>? = null,
  // The list of custom metadata.
  val customMetadata: List<AdobeCustomMetadataDetails>? = null
)
