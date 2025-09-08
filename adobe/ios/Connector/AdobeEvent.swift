// AdobeEvent.swift

enum AdobeEventTypes: String {
    case SESSION_START = "sessionStart"
    case PLAY = "play"
    case PING = "ping"
    case BITRATE_CHANGE = "bitrateChange"
    case BUFFER_START = "bufferStart"
    case PAUSE_START = "pauseStart"
    case AD_BREAK_START = "adBreakStart"
    case AD_START = "adStart"
    case AD_COMPLETE = "adComplete"
    case AD_SKIP = "adSkip"
    case AD_BREAK_COMPLETE = "adBreakComplete"
    case CHAPTER_START = "chapterStart"
    case CHAPTER_SKIP = "chapterSkip"
    case CHAPTER_COMPLETE = "chapterComplete"
    case ERROR = "error"
    case SESSION_END = "sessionEnd"
    case SESSION_COMPLETE = "sessionComplete"
}
