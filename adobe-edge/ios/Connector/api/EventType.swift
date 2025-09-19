//  EventType.swift

/// Enum representing the types of media events.
enum EventType: String, Codable {
    case sessionStart = "media.sessionStart"
    case play = "media.play"
    case ping = "media.ping"
    case bitrateChange = "media.bitrateChange"
    case bufferStart = "media.bufferStart"
    case pauseStart = "media.pauseStart"
    case adBreakStart = "media.adBreakStart"
    case adStart = "media.adStart"
    case adComplete = "media.adComplete"
    case adSkip = "media.adSkip"
    case adBreakComplete = "media.adBreakComplete"
    case chapterStart = "media.chapterStart"
    case chapterSkip = "media.chapterSkip"
    case chapterComplete = "media.chapterComplete"
    case error = "media.error"
    case sessionEnd = "media.sessionEnd"
    case sessionComplete = "media.sessionComplete"
    case statesUpdate = "media.statesUpdate"
}
