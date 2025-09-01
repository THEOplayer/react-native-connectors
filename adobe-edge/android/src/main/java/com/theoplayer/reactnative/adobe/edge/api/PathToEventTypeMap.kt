package com.theoplayer.reactnative.adobe.edge.api

val pathToEventTypeMap: Map<String, EventType> = mapOf(
  "/adBreakComplete" to EventType.AD_BREAK_COMPLETE,
  "/adBreakStart" to EventType.AD_BREAK_START,
  "/adComplete" to EventType.AD_COMPLETE,
  "/adSkip" to EventType.AD_SKIP,
  "/adStart" to EventType.AD_START,
  "/bitrateChange" to EventType.BITRATE_CHANGE,
  "/bufferStart" to EventType.BUFFER_START,
  "/chapterComplete" to EventType.CHAPTER_COMPLETE,
  "/chapterSkip" to EventType.CHAPTER_SKIP,
  "/chapterStart" to EventType.CHAPTER_START,
  "/error" to EventType.ERROR,
  "/pauseStart" to EventType.PAUSE_START,
  "/ping" to EventType.PING,
  "/play" to EventType.PLAY,
  "/sessionComplete" to EventType.SESSION_COMPLETE,
  "/sessionEnd" to EventType.SESSION_END,
  "/sessionStart" to EventType.SESSION_START,
  "/statesUpdate" to EventType.STATES_UPDATE,
)
