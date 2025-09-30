package com.theoplayeryoubora.adapter

import com.facebook.react.bridge.ReadableMap
import com.npaw.core.options.AnalyticsOptions

object AnalyticsOptionsAdapter {
  fun fromMap(readableMap: ReadableMap): AnalyticsOptions {
    val map = readableMap.toHashMap()
    return AnalyticsOptions.Builder().apply {
      (map["appName"] as? String)?.let { appName = it }
      (map["appReleaseVersion"] as? String)?.let { appReleaseVersion = it }
      (map["appSessionStopTimeout"] as? Long)?.let { appSessionStopTimeout = it }
      (map["authToken"] as? String)?.let { authToken = it }
      (map["deviceBrand"] as? String)?.let { deviceBrand = it }
      (map["deviceCode"] as? String)?.let { deviceCode = it }
      (map["deviceEDID"] as? String)?.let { deviceEDID = it }
      (map["deviceId"] as? String)?.let { deviceId = it }
      (map["deviceIsAnonymous"] as? Boolean)?.let { deviceIsAnonymous = it }
      (map["deviceModel"] as? String)?.let { deviceModel = it }
      (map["deviceOsName"] as? String)?.let { deviceOsName = it }
      (map["deviceOsVersion"] as? String)?.let { deviceOsVersion = it }
      (map["deviceType"] as? String)?.let { deviceType = it }
      (map["host"] as? String)?.let { host = it }
      (map["isAdBlockerDetected"] as? Boolean)?.let { isAdBlockerDetected = it }
      (map["isAutoDetectBackground"] as? Boolean)?.let { isAutoDetectBackground = it }
      (map["isEnabled"] as? Boolean)?.let { isEnabled = it }
      (map["isOffline"] as? Boolean)?.let { isOffline = it }
      (map["profileId"] as? String)?.let { profileId = it }
      (map["userAnonymousId"] as? String)?.let { userAnonymousId = it }
      (map["userId"] as? String)?.let { userId = it }
      (map["userObfuscateIp"] as? Boolean)?.let { userObfuscateIp = it }
      (map["userPrivacyProtocol"] as? String)?.let { userPrivacyProtocol = it }
      (map["userType"] as? String)?.let { userType = it }
      (map["username"] as? String)?.let { username = it }
    }.build()
  }
}
