package com.theoplayeryoubora.adapter

import com.facebook.react.bridge.ReadableMap
import com.npaw.balancer.BalancerOptions
import com.npaw.balancer.models.api.DynamicRules
import kotlin.collections.mapKeys
import kotlin.collections.mapValues

object BalancerOptionsAdapter {
  fun fromMap(readableMap: ReadableMap): BalancerOptions {
    val map = readableMap.toHashMap()
    return BalancerOptions().apply {
      (map["allowSpecialDelimitersInUrl"] as? Boolean)?.let { allowSpecialDelimitersInUrl = it }
      (map["authData"] as? Map<*, *>)?.let { authData = asStringMap(it) }
      (map["balanceAudio"] as? Boolean)?.let { balanceAudio = it }
      (map["balanceManifests"] as? Boolean)?.let { balanceManifests = it }
      (map["balanceSubtitles"] as? Boolean)?.let { balanceSubtitles = it }
      (map["bucketName"] as? String)?.let { bucketName = it }
      (map["chunkExpirationProbingMs"] as? Int)?.let { chunkExpirationProbingMs = it }
      (map["domainWhitelist"] as? List<*>)?.let { domainWhitelist = asStringList(it) }
      (map["domainWhitelistRegex"] as? List<*>)?.let { domainWhitelistRegex = asStringList(it) }
      (map["dynamicRules"] as? Map<*, *>)?.let { dynamicRules = dynamicRulesFromMap(it) }
      (map["forceDecisionCall"] as? Boolean)?.let { forceDecisionCall = it }
      (map["isDev"] as? Boolean)?.let { isDev = it }
      (map["isLive"] as? Boolean)?.let { isLive = it }
      (map["jwtAuthType"] as? String)?.let { jwtAuthType = it }
      (map["jwtToken"] as? String)?.let { jwtToken = it }
      (map["noProbing"] as? Boolean)?.let { noProbing = it }
      (map["probeOnlyOnBanned"] as? Boolean)?.let { probeOnlyOnBanned = it }
      (map["profileName"] as? String)?.let { profileName = it }
      (map["signManifestUsingApi"] as? Boolean)?.let { signManifestUsingApi = it }
      (map["stripPathForDomainRegex"] as? List<*>)?.let { stripPathForDomainRegex = asStringList(it) }
      (map["stripPathRegex"] as? String)?.let { stripPathRegex = it }
      (map["updateTime"] as? Long)?.let { updateTime = it }
      (map["videoId"] as? String)?.let { videoId = it }
    }
  }

  private fun dynamicRulesFromMap(map: Map<*,*>): DynamicRules {
    return DynamicRules(
      mediaType = map["mediaType"] as? String,
      userType = map["userType"] as? String,
      contentType = map["contentType"] as? String,
      custom1 = map["custom1"] as? String,
    )
  }
}

private fun asStringList(list: List<*>): List<String> {
  return list.map { entry -> entry.toString() }
}

private fun asStringMap(map: Map<*, *>): Map<String, Any> {
  return map
    .mapKeys { entry -> entry.key as String }
    .mapValues { entry -> entry.value as Any }
}
