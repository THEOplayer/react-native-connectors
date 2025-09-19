//  MediaEdgeAPI.swift

import Foundation

struct QueuedEvent {
  let path: String
  let mediaDetails: [String: Any?]
}

class MediaEdgeAPI {
  private let baseUrl: String
  private let configId: String
  private let userAgent: String
  private var debugSessionId: String?
  private let urlSession: URLSession
  private let jsonEncoder = JSONEncoder()
  private let jsonDecoder = JSONDecoder()
  private(set) var sessionId: String?
  private var hasSessionFailed = false
  private var eventQueue = [QueuedEvent]()
  private let dispatchQueue = DispatchQueue.main
  
  private let pathToEventTypeMap: [String: EventType] = [
    "/play": .play,
    "/pauseStart": .pauseStart,
    "/error": .error,
    "/ping": .ping,
    "/bufferStart": .bufferStart,
    "/sessionComplete": .sessionComplete,
    "/sessionEnd": .sessionEnd,
    "/statesUpdate": .statesUpdate,
    "/bitrateChange": .bitrateChange,
    "/chapterSkip": .chapterSkip,
    "/chapterStart": .chapterStart,
    "/chapterComplete": .chapterComplete,
    "/adBreakStart": .adBreakStart,
    "/adBreakComplete": .adBreakComplete,
    "/adStart": .adStart,
    "/adSkip": .adSkip,
    "/adComplete": .adComplete
  ]
  
  init(baseUrl: String, configId: String, userAgent: String, debugSessionId: String? = nil) {
    self.baseUrl = baseUrl
    self.configId = configId
    self.userAgent = userAgent
    self.debugSessionId = debugSessionId
    self.urlSession = URLSession.shared
    self.jsonEncoder.dateEncodingStrategy = .iso8601
    self.jsonDecoder.dateDecodingStrategy = .iso8601
  }
  
  func setDebugSessionId(id: String?) {
    debugSessionId = id
  }
  
  func hasSessionStarted() -> Bool {
    return sessionId != nil
  }
  
  func reset() {
    sessionId = nil
    hasSessionFailed = false
    eventQueue.removeAll()
  }
  
  func play(playhead: Double?, qoeDataDetails: AdobeQoeDataDetails? = nil) {
    maybeQueueEvent(path: "/play", mediaDetails: [
      "playhead": sanitisePlayhead(playhead),
      "qoeDataDetails": qoeDataDetails
    ])
  }
  
  func pause(playhead: Double?, qoeDataDetails: AdobeQoeDataDetails? = nil) {
    maybeQueueEvent(path: "/pauseStart", mediaDetails: [
      "playhead": sanitisePlayhead(playhead),
      "qoeDataDetails": qoeDataDetails
    ])
  }
  
  func error(playhead: Double?, errorDetails: AdobeErrorDetails, qoeDataDetails: AdobeQoeDataDetails? = nil) {
    maybeQueueEvent(path: "/error", mediaDetails: [
      "playhead": sanitisePlayhead(playhead),
      "qoeDataDetails": qoeDataDetails,
      "errorDetails": errorDetails
    ])
  }
  
  func ping(playhead: Double?, qoeDataDetails: AdobeQoeDataDetails? = nil) {
    guard let sessionId = sessionId else { return }
    Task { @MainActor in
      await postEvent(sessionId: sessionId, path: "/ping", mediaDetails: [
        "playhead": sanitisePlayhead(playhead),
        "qoeDataDetails": qoeDataDetails
      ])
    }
  }
  
  func bufferStart(playhead: Double?, qoeDataDetails: AdobeQoeDataDetails? = nil) {
    maybeQueueEvent(path: "/bufferStart", mediaDetails: [
      "playhead": sanitisePlayhead(playhead),
      "qoeDataDetails": qoeDataDetails
    ])
  }
  
  func sessionComplete(playhead: Double?, qoeDataDetails: AdobeQoeDataDetails? = nil) {
    maybeQueueEvent(path: "/sessionComplete", mediaDetails: [
      "playhead": sanitisePlayhead(playhead),
      "qoeDataDetails": qoeDataDetails
    ])
  }
  
  func sessionEnd(playhead: Double?, qoeDataDetails: AdobeQoeDataDetails? = nil) {
    maybeQueueEvent(path: "/sessionEnd", mediaDetails: [
      "playhead": sanitisePlayhead(playhead),
      "qoeDataDetails": qoeDataDetails
    ])
    sessionId = nil
  }
  
  func statesUpdate(
    playhead: Double?,
    statesStart: [AdobePlayerStateData]? = nil,
    statesEnd: [AdobePlayerStateData]? = nil,
    qoeDataDetails: AdobeQoeDataDetails? = nil
  ) {
    maybeQueueEvent(path: "/statesUpdate", mediaDetails: [
      "playhead": sanitisePlayhead(playhead),
      "statesStart": statesStart,
      "statesEnd": statesEnd,
      "qoeDataDetails": qoeDataDetails
    ])
  }
  
  func bitrateChange(playhead: Double?, qoeDataDetails: AdobeQoeDataDetails) {
    maybeQueueEvent(path: "/bitrateChange", mediaDetails: [
      "playhead": sanitisePlayhead(playhead),
      "qoeDataDetails": qoeDataDetails
    ])
  }
  
  func chapterSkip(playhead: Double?, qoeDataDetails: AdobeQoeDataDetails? = nil) {
    maybeQueueEvent(path: "/chapterSkip", mediaDetails: [
      "playhead": sanitisePlayhead(playhead),
      "qoeDataDetails": qoeDataDetails
    ])
  }
  
  func chapterStart(
    playhead: Double?,
    chapterDetails: AdobeChapterDetails,
    customMetadata: [AdobeCustomMetadataDetails]? = nil,
    qoeDataDetails: AdobeQoeDataDetails? = nil
  ) {
    maybeQueueEvent(path: "/chapterStart", mediaDetails: [
      "playhead": sanitisePlayhead(playhead),
      "chapterDetails": chapterDetails,
      "customMetadata": customMetadata,
      "qoeDataDetails": qoeDataDetails
    ])
  }
  
  func chapterComplete(playhead: Double?, qoeDataDetails: AdobeQoeDataDetails? = nil) {
    maybeQueueEvent(path: "/chapterComplete", mediaDetails: [
      "playhead": sanitisePlayhead(playhead),
      "qoeDataDetails": qoeDataDetails
    ])
  }
  
  func adBreakStart(
    playhead: Double,
    advertisingPodDetails: AdobeAdvertisingPodDetails,
    qoeDataDetails: AdobeQoeDataDetails? = nil
  ) {
    maybeQueueEvent(path: "/adBreakStart", mediaDetails: [
      "playhead": sanitisePlayhead(playhead),
      "advertisingPodDetails": advertisingPodDetails,
      "qoeDataDetails": qoeDataDetails
    ])
  }
  
  func adBreakComplete(playhead: Double?, qoeDataDetails: AdobeQoeDataDetails? = nil) {
    maybeQueueEvent(path: "/adBreakComplete", mediaDetails: [
      "playhead": sanitisePlayhead(playhead),
      "qoeDataDetails": qoeDataDetails
    ])
  }
  
  func adStart(
    playhead: Double,
    advertisingDetails: AdobeAdvertisingDetails,
    customMetadata: [AdobeCustomMetadataDetails]? = nil,
    qoeDataDetails: AdobeQoeDataDetails? = nil
  ) {
    maybeQueueEvent(path: "/adStart", mediaDetails: [
      "playhead": sanitisePlayhead(playhead),
      "advertisingDetails": advertisingDetails,
      "customMetadata": customMetadata,
      "qoeDataDetails": qoeDataDetails
    ])
  }
  
  func adSkip(playhead: Double?, qoeDataDetails: AdobeQoeDataDetails? = nil) {
    maybeQueueEvent(path: "/adSkip", mediaDetails: [
      "playhead": sanitisePlayhead(playhead),
      "qoeDataDetails": qoeDataDetails
    ])
  }
  
  func adComplete(playhead: Double?, qoeDataDetails: AdobeQoeDataDetails? = nil) {
    maybeQueueEvent(path: "/adComplete", mediaDetails: [
      "playhead": sanitisePlayhead(playhead),
      "qoeDataDetails": qoeDataDetails
    ])
  }
  
  private func createUrlWithClientParams(baseUrl: String) -> URL? {
    var components = URLComponents(string: baseUrl)
    components?.queryItems = [
      URLQueryItem(name: "configId", value: configId)
    ]
    if let debugSessionId = debugSessionId {
      components?.queryItems?.append(URLQueryItem(name: "debugSessionId", value: debugSessionId))
    }
    return components?.url
  }
  
  private func sendRequest(url: String, body: String) async throws -> Data? {
    guard let url = createUrlWithClientParams(baseUrl: url) else {
      throw URLError(.badURL)
    }
    
    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
    request.setValue(userAgent, forHTTPHeaderField: "User-Agent")
    request.httpBody = body.data(using: .utf8)
    
    do {
      let (data, response) = try await urlSession.data(for: request)
      guard let httpResponse = response as? HTTPURLResponse,
            (200...299).contains(httpResponse.statusCode) else {
        throw URLError(.badServerResponse)
      }
      return data
    } catch {
      throw error
    }
  }
  
  func startSession(
    sessionDetails: AdobeSessionDetails,
    customMetadata: [AdobeCustomMetadataDetails]? = nil,
    qoeDataDetails: AdobeQoeDataDetails? = nil
  ) async {
    do {
      let event = [
        "xdm": [
          "eventType": EventType.sessionStart.rawValue,
          "timestamp": ISO8601DateFormatter().string(from: Date()),
          "mediaCollection": [
            "playhead": 0,
            "sessionDetails": sessionDetails,
            "qoeDataDetails": qoeDataDetails as Any,
            "customMetadata": customMetadata as Any
          ].compactMapValues { $0 }
        ]
      ].compactMapValues { $0 }
      
      let body = ["events": [event]]
      
      let jsonData = try JSONSerialization.data(withJSONObject: body, options: [])
      guard let jsonString = String(data: jsonData, encoding: .utf8) else {
        throw EncodingError.invalidValue(body, EncodingError.Context(codingPath: [], debugDescription: "Failed to convert data to string"))
      }
      
      let responseData = try await sendRequest(url: "\(baseUrl)/sessionStart", body: jsonString)
      
      if let responseData = responseData,
         let jsonResponse = try? JSONSerialization.jsonObject(with: responseData) as? [String: Any] {
        
        if let error = jsonResponse["error"] as? [String: Any] {
          throw NSError(domain: "MediaEdgeAPI", code: 1, userInfo: error)
        } else if let errors = (jsonResponse["data"] as? [String: Any])?["errors"] as? [[String: Any]] {
          throw NSError(domain: "MediaEdgeAPI", code: 1, userInfo: ["errors": errors])
        }
        
        if let handle = jsonResponse["handle"] as? [[String: Any]] {
            sessionId = handle.first { item in
                item["type"] as? String == "media-analytics:new-session"
            }.flatMap { item in
                // payload is a dictionary
                (item["payload"] as? [String: Any])?["sessionId"] as? String
            }
        }
      }
      
      if !eventQueue.isEmpty, let sessionId = sessionId {
        for event in eventQueue {
          await postEvent(sessionId: sessionId, path: event.path, mediaDetails: event.mediaDetails)
        }
        eventQueue.removeAll()
      }
    } catch {
      print("Failed to start session. \(error.localizedDescription)")
      hasSessionFailed = true
    }
  }
  
  private func maybeQueueEvent(path: String, mediaDetails: [String: Any?]) {
    guard !hasSessionFailed else { return }
    
    if let sessionId = sessionId {
      Task { @MainActor in
        await postEvent(sessionId: sessionId, path: path, mediaDetails: mediaDetails)
      }
    } else {
      eventQueue.append(QueuedEvent(path: path, mediaDetails: mediaDetails))
    }
  }
  
  private func postEvent(sessionId: String, path: String, mediaDetails: [String: Any?]) async {
    do {
      // Clean up nil values and add sessionID
      var mediaCollection = mediaDetails.compactMapValues { $0 }
      mediaCollection["sessionID"] = sessionId
      
      // Create the event structure
      let event: [String: Any] = [
        "xdm": [
          "eventType": pathToEventTypeMap[path]?.rawValue ?? path,
          "timestamp": ISO8601DateFormatter().string(from: Date()),
          "mediaCollection": mediaCollection
        ]
      ]
      let body: [String: Any] = ["events": [event]]
      let jsonData = try JSONSerialization.data(withJSONObject: body, options: [])
      guard let jsonString = String(data: jsonData, encoding: .utf8) else {
        throw EncodingError.invalidValue(body, EncodingError.Context(codingPath: [], debugDescription: "Failed to convert data to string"))
      }
      
      print("postEvent - \(path) \(jsonString)")
      
      let responseData = try await sendRequest(url: "\(baseUrl)\(path)", body: jsonString)
      
      if let responseData = responseData,
         let jsonResponse = try? JSONSerialization.jsonObject(with: responseData) as? [String: Any] {
        
        if let error = jsonResponse["error"] as? [String: Any] {
          print("Failed to send event. \(error)")
        } else if let errors = (jsonResponse["data"] as? [String: Any])?["errors"] as? [[String: Any]] {
          print("Failed to send event. \(errors)")
        }
      }
    } catch {
      print("Failed to send event. \(error.localizedDescription)")
    }
  }
  
  private func sanitisePlayhead(_ playhead: Double?) -> Int {
    guard let playhead = playhead else {
      return 0
    }
    
    if playhead.isInfinite {
      // If content is live, the playhead must be the current second of the day
      let now = Date().timeIntervalSince1970
      return Int(now) % 86400
    }
    
    return Int(playhead.rounded())
  }
}
