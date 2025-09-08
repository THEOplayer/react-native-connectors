// AdobeUtils.swift

import Foundation
import THEOplayerSDK

class AdobeUtils {
    // singleton setup
    static let shared = AdobeUtils()
    private var defaultUrlSession: URLSession!
    private var defaultOperationQueue = OperationQueue()
    
    private init() {
        let defaultConfig: URLSessionConfiguration = URLSessionConfiguration.default
        defaultConfig.networkServiceType = NSURLRequest.NetworkServiceType.default
        self.defaultOperationQueue.maxConcurrentOperationCount = 4
        self.defaultOperationQueue.qualityOfService = .utility
        self.defaultUrlSession = URLSession(configuration: defaultConfig, delegate: nil, delegateQueue: self.defaultOperationQueue)
    }
    
    func sendRequest(url: URL, method: String, body: [String:Any], headers: [String:String], completion:((Data?, Int, [String:String], Error?) -> Void)? = nil) {
        var request = URLRequest(url: url)
        request.httpMethod = method
        for (key, value) in headers {
            request.addValue(value, forHTTPHeaderField: key)
        }
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: body, options: [])
        } catch {
            print("Failed to POST. Error: \(error)")
        }
        let task = self.defaultUrlSession.dataTask(with: request) { data, response, error in
            if let urlResponse = response as? HTTPURLResponse {
                let statusCode = urlResponse.statusCode
                let responseHeaders = urlResponse.allHeaderFields
                var allHeaders: [String:String] = [:]
                for (key, value) in responseHeaders {
                    if let headerKey = key as? String,
                       let headerValue = value as? String {
                        allHeaders[headerKey.lowercased()] = headerValue
                    }
                }
                completion?(data, statusCode, allHeaders, error)
            } else {
                completion?(data, -1, [:], error)
            }
            
        }
        // start the task
        task.resume()
    }
    
    class func buildUserAgent() -> String {
        let device = UIDevice.current
        let model = device.model
        let osVersion = device.systemVersion.replacingOccurrences(of: ".", with: "_")
        let locale = (UserDefaults.standard.array(forKey: "AppleLanguages")?.first as? String) ?? Locale.current.identifier
        let userAgent = "Mozilla/5.0 (\(model); CPU OS \(osVersion) like Mac OS X; \(locale))"
        return userAgent
    }
    
    class func extractSessionId(from headers: [String:String]) -> String? {
        if let locationHeader = headers["location"] {
            return locationHeader.components(separatedBy: "/sessions/").last
        }
        return nil
    }
}
