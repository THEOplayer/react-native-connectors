//
//  AdobeEdgeEvent.swift
//

enum AdobeEdgeEventType: Int {
    case PLAYING = 0
    case PAUSE
    case AD_BREAK_START
    case AD_BREAK_COMPLETE
    case AD_START
    case AD_COMPLETE
    case AD_SKIP
    case SEEK_START
    case SEEK_COMPLETE
    case BUFFER_START
    case BUFFER_COMPLETE
    case BITRATE_CHANGE
    case STATE_START
    case STATE_END
    case PLAYHEAD_UPDATE
    case ERROR
    case COMPLETE
    case QOE_UPDATE
    case SESSION_END
}

struct AdobeEdgeEvent {
    var type: AdobeEdgeEventType
    var info: [String: Any]? = nil
    var metadata: [String: String]? = nil
}
