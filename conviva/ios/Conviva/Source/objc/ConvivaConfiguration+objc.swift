//
//  THEOplayerConvivaConfiguration.swift
//  
//
//  Created by Damiaan Dufaux on 31/08/2022.
//

import ConvivaSDK

/// Settings that specify how to communicate with the Conviva backend
@objc public class THEOplayerConnectorConvivaConfiguration: NSObject {
    let internalConfig: ConvivaConfiguration
        
    /// Creates an objc class that contains settings to connect to conviva
    /// - Parameters:
    ///   - customerKey: Specifies the customer account. Different keys shall be used for development / debug versus production environment. Find your keys on the [account info](https://pulse.conviva.com/settings/account_summary) page in Pulse.
    ///   - gatewayURL: The URL of the Conviva platform to report data to. The default value is highly recommended in production environments.
    ///   - logLevel: The level of log messages to print in the console log and report to conviva backend. We recommend using log level warning during development and lowering to debug when more information is required to troubleshoot specific issues.
    @objc public init(customerKey: String, gatewayURL: String? = nil, logLevel: LogLevel = .LOGLEVEL_NONE) {
        internalConfig = ConvivaConfiguration(customerKey: customerKey, gatewayURL: gatewayURL, logLevel: logLevel)
    }
}

extension ConvivaEndpoints {
    public convenience init?(configuration: THEOplayerConnectorConvivaConfiguration) {
        self.init(configuration: configuration.internalConfig)
    }
}
