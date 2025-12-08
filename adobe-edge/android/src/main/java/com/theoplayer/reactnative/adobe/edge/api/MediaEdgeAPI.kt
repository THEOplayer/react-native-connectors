package com.theoplayer.reactnative.adobe.edge.api

import com.adobe.marketing.mobile.edge.media.Media
import com.adobe.marketing.mobile.edge.media.MediaConstants
import kotlin.Any
import kotlin.String

private const val MAIN_PING_INTERVAL = 10000L
private const val AD_PING_INTERVAL = 1000L

class MediaEdgeAPI(
  channel: String,
  private var debugSessionId: String? = null
) {
  /**
   * https://developer.adobe.com/client-sdks/edge/media-for-edge-network/api-reference/#createtrackerwithconfig
   */
  private val tracker = Media.createTracker(
    mutableMapOf<String, Any>(
      MediaConstants.TrackerConfig.CHANNEL to channel,
      MediaConstants.TrackerConfig.MAIN_PING_INTERVAL to MAIN_PING_INTERVAL,
      MediaConstants.TrackerConfig.AD_PING_INTERVAL to AD_PING_INTERVAL,
    )
  )

  var sessionId: String? = null
    private set

  var hasSessionFailed = false
    private set

  fun setDebugSessionId(id: String?) {
    debugSessionId = id
  }

  fun hasSessionStarted(): Boolean = sessionId != null

  fun reset() {
    sessionId = null
    hasSessionFailed = false
  }

  fun play() {
    tracker.trackPlay()
  }

  fun pause() {
    tracker.trackPause()
  }

  fun error(errorDetails: AdobeErrorDetails) {
    tracker.trackError(errorDetails.name)
  }

  fun bufferStart() {
    tracker.trackEvent(Media.Event.BufferStart, null, null)
  }

  fun bufferComplete() {
    tracker.trackEvent(Media.Event.BufferComplete, null, null)
  }

  fun seekComplete() {
    tracker.trackEvent(Media.Event.SeekStart, null, null)
  }

  fun seekStart() {
    tracker.trackEvent(Media.Event.SeekComplete, null, null)
  }

  /**
   * Tracks the completion of the media playback session. Call this method only when the media has
   * been completely viewed. If the viewing session is ended before the media is completely viewed,
   * use trackSessionEnd instead.
   */
  fun sessionComplete() {
    tracker.trackComplete()
  }

  /**
   * Tracks the end of a media playback session. Call this method when the viewing session ends,
   * even if the user has not viewed the media to completion. If the media is viewed to completion,
   * use trackComplete instead.
   */
  fun sessionEnd() {
    tracker.trackSessionEnd()
  }

  /**
   * Provides the current media playhead value to the MediaTracker instance. For accurate tracking,
   * call this method every time the playhead value changes. If the player does not notify playhead
   * value changes, call this method once every second with the most recent playhead value.
   */
  fun updateCurrentPlayhead(playhead: Double?) {
    tracker.updateCurrentPlayhead(sanitisePlayhead(playhead))
  }

  fun statesUpdate() {
    // TODO
//    Media.createStateObject(MediaConstants.PlayerState.FULLSCREEN)
  }

  fun bitrateChange(qoeDataDetails: AdobeQoeDataDetails) {
    tracker.updateQoEObject(
      Media.createQoEObject(
        qoeDataDetails.bitrate ?: 0,
        qoeDataDetails.timeToStart ?: 0,
        qoeDataDetails.framesPerSecond ?: 0,
        qoeDataDetails.droppedFrames ?: 0
      )
    )
  }

  fun chapterSkip() {
    tracker.trackEvent(Media.Event.ChapterSkip, null, null)
  }

  fun chapterStart(
    chapterDetails: AdobeChapterDetails,
    customMetadata: List<AdobeCustomMetadataDetails>? = null
  ) {
    tracker.trackEvent(
      Media.Event.ChapterStart,
      Media.createChapterObject(
        chapterDetails.friendlyName ?: "",
        chapterDetails.index,
        chapterDetails.length,
        chapterDetails.offset
      ),
      customMetadata?.associate { it.name to (it.value ?: "") }
    )
  }

  fun chapterComplete() {
    tracker.trackEvent(Media.Event.ChapterComplete, null, null)
  }

  fun adBreakStart(advertisingPodDetails: AdobeAdvertisingPodDetails) {
    tracker.trackEvent(
      Media.Event.AdBreakStart,
      Media.createAdBreakObject(
        advertisingPodDetails.friendlyName ?: "",
        advertisingPodDetails.index,
        advertisingPodDetails.offset
      ),
      null
    )
  }

  fun adBreakComplete() {
    tracker.trackEvent(Media.Event.AdBreakComplete, null, null)
  }

  fun adStart(
    advertisingDetails: AdobeAdvertisingDetails,
    customMetadata: List<AdobeCustomMetadataDetails>? = null,
  ) {
    tracker.trackEvent(
      Media.Event.AdStart,
      Media.createAdObject(
        advertisingDetails.name,
        advertisingDetails.id ?: "",
        advertisingDetails.podPosition,
        advertisingDetails.length
      ),
      customMetadata?.associate { it.name to (it.value ?: "") }
    )
  }

  fun adSkip() {
    tracker.trackEvent(Media.Event.AdSkip, null, null)
  }

  fun adComplete() {
    tracker.trackEvent(Media.Event.AdComplete, null, null)
  }

  fun startSession(
    sessionDetails: AdobeSessionDetails,
    customMetadata: List<AdobeCustomMetadataDetails>? = null
  ) {
    tracker.trackSessionStart(
      Media.createMediaObject(
        sessionDetails.friendlyName ?: "",
        sessionDetails.assetID ?: "",
        sessionDetails.length,
        sessionDetails.contentType.name,
        when (sessionDetails.streamType) {
          StreamType.AUDIO ->Media.MediaType.Audio
          else -> Media.MediaType.Video
        }
      ),
      customMetadata?.associate { it.name to (it.value ?: "") }
    )
  }
}
