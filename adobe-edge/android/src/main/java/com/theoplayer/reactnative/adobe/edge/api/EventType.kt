package com.theoplayer.reactnative.adobe.edge.api

/**
 * Enum representing the types of media events.
 */
enum class EventType(val value: String) {
  SESSION_START("media.sessionStart"),
  PLAY("media.play"),
  PING("media.ping"),
  BITRATE_CHANGE("media.bitrateChange"),
  BUFFER_START("media.bufferStart"),
  PAUSE_START("media.pauseStart"),
  AD_BREAK_START("media.adBreakStart"),
  AD_START("media.adStart"),
  AD_COMPLETE("media.adComplete"),
  AD_SKIP("media.adSkip"),
  AD_BREAK_COMPLETE("media.adBreakComplete"),
  CHAPTER_START("media.chapterStart"),
  CHAPTER_SKIP("media.chapterSkip"),
  CHAPTER_COMPLETE("media.chapterComplete"),
  ERROR("media.error"),
  SESSION_END("media.sessionEnd"),
  SESSION_COMPLETE("media.sessionComplete"),
  STATES_UPDATE("media.statesUpdate")
}
