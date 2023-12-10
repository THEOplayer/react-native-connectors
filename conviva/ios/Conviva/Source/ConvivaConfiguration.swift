//
//  ConvivaConfiguration.swift
//  
//
//  Created by Damiaan Dufaux on 31/08/2022.
//

import ConvivaSDK

/// Settings that specify how to communicate with the Conviva backend
public struct ConvivaConfiguration {
    /// Specifies the customer account. Different keys shall be used for development / debug versus production environment. Find your keys on the [account info](https://pulse.conviva.com/settings/account_summary) page in Pulse.
    public let customerKey: String

    /// The URL of the Conviva platform to report data to. The default value is highly recommended in production environments.
    public let gatewayURL: String?

    /// The level of log messages to print in the console log and report to conviva backend. We recommend using log level warning during development and lowering to debug when more information is required to troubleshoot specific issues.
    public let logLevel: LogLevel
    
    // MARK: -
    
    /// Creates a struct that contains settings to connect to conviva
    /// - Parameters:
    ///   - customerKey: Specifies the customer account. Different keys shall be used for development / debug versus production environment. Find your keys on the [account info](https://pulse.conviva.com/settings/account_summary) page in Pulse.
    ///   - gatewayURL: The URL of the Conviva platform to report data to. The default value is highly recommended in production environments.
    ///   - logLevel: The level of log messages to print in the console log and report to conviva backend. We recommend using log level warning during development and lowering to debug when more information is required to troubleshoot specific issues.
    public init(customerKey: String, gatewayURL: String? = nil, logLevel: LogLevel = .LOGLEVEL_NONE) {
        self.customerKey = customerKey
        self.gatewayURL = gatewayURL
        self.logLevel = logLevel
    }
    
    var convivaSettingsDictionary: [AnyHashable: Any] {
        if let gateway = gatewayURL {
            return [
                CIS_SSDK_SETTINGS_GATEWAY_URL: gateway,
                CIS_SSDK_SETTINGS_LOG_LEVEL: logLevel.rawValue
            ]
        } else {
            return [CIS_SSDK_SETTINGS_LOG_LEVEL: logLevel.rawValue]
        }
    }
}
