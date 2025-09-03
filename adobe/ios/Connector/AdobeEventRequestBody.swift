// AdobeEventRequestBody.swift

import Foundation

class AdobeEventRequestBodyPlayerTime {
    var playhead: Double
    var ts: Int
    
    init(playhead: Double, ts: Int) {
        self.playhead = playhead
        self.ts = ts
    }
    
    convenience init(from dict: [String: Any]?) {
        let playhead = dict?["playhead"] as? Double ?? 0.0
        let ts = dict?["ts"] as? Int ?? 0
        self.init(playhead: playhead, ts: ts)
    }
    
    func toDictionary() -> [String: Any] {
        return [
            "playhead": playhead,
            "ts": ts
        ]
    }
}

class AdobeEventRequestBody: AdobeMetadata {
    var playerTime: AdobeEventRequestBodyPlayerTime
    var eventType: String?
    
    init(playerTime: AdobeEventRequestBodyPlayerTime,
         eventType: String? = nil,
         params: [String: Any]? = nil,
         qoeData: [String: Any]? = nil,
         customMetadata: [String: Any]? = nil) {
        self.playerTime = playerTime
        self.eventType = eventType
        super.init(params: params, qoeData: qoeData, customMetadata: customMetadata)
    }
    
    convenience init(from dict: [String: Any]?) {
        let playerTime = AdobeEventRequestBodyPlayerTime(from: dict?["eventType"] as? [String:Double] )
        let eventType = dict?["eventType"] as? String
        let params = dict?["params"] as? [String: Any]
        let qoeData = dict?["qoeData"] as? [String: Any]
        let customMetadata = dict?["customMetadata"] as? [String: Any]
        self.init(playerTime: playerTime,
                  eventType: eventType,
                  params: params,
                  qoeData: qoeData,
                  customMetadata: customMetadata)
    }
    
    override func toDictionary() -> [String: Any] {
        var dict = super.toDictionary()
        dict["playerTime"] = playerTime.toDictionary()
        dict["eventType"] = eventType ?? "unknown"
        return dict
    }
}
