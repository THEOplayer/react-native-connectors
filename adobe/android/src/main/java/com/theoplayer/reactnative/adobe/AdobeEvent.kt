package com.theoplayer.reactnative.adobe

enum class AdobeEventTypes(val value: String) {
  SESSION_START("sessionStart"),
  PLAY("play"),
  PING("ping"),
  BITRATE_CHANGE("bitrateChange"),
  BUFFER_START("bufferStart"),
  PAUSE_START("pauseStart"),
  AD_BREAK_START("adBreakStart"),
  AD_START("adStart"),
  AD_COMPLETE("adComplete"),
  AD_SKIP("adSkip"),
  AD_BREAK_COMPLETE("adBreakComplete"),
  CHAPTER_START("chapterStart"),
  CHAPTER_SKIP("chapterSkip"),
  CHAPTER_COMPLETE("chapterComplete"),
  ERROR("error"),
  SESSION_END("sessionEnd"),
  SESSION_COMPLETE("sessionComplete")
}
