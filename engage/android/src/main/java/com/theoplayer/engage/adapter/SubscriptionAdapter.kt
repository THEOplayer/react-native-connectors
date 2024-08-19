package com.theoplayer.engage.adapter

import com.google.android.engage.common.datamodel.SubscriptionEntitlement
import com.google.android.engage.common.datamodel.SubscriptionEntity
import com.theoplayer.engage.adapter.Constants.PROP_ENTITLEMENTS
import com.theoplayer.engage.adapter.ParseUtils.getInt
import com.theoplayer.engage.adapter.ParseUtils.getLong
import com.theoplayer.engage.adapter.ParseUtils.getString

import com.theoplayer.engage.adapter.Constants.PROP_EXPIRATION_TIME
import com.theoplayer.engage.adapter.Constants.PROP_ID
import com.theoplayer.engage.adapter.Constants.PROP_NAME
import com.theoplayer.engage.adapter.Constants.PROP_PROVIDER_PACKAGE_NAME
import com.theoplayer.engage.adapter.Constants.PROP_SUBSCRIPTION_TYPE
import com.theoplayer.engage.adapter.ParseUtils.getArray
import org.json.JSONArray

import org.json.JSONObject

object SubscriptionAdapter {
  /**
   * Create a SubscriptionEntity from bridge data.
   */
  fun convert(subscription: JSONObject): SubscriptionEntity {
    return SubscriptionEntity.Builder().apply {
      getString(subscription, PROP_PROVIDER_PACKAGE_NAME)?.let {
        setProviderPackageName(it)
      }
      getLong(subscription, PROP_EXPIRATION_TIME)?.let {
        setExpirationTimeMillis(it)
      }
      getInt(subscription, PROP_SUBSCRIPTION_TYPE)?.let {
        setSubscriptionType(it)
      }
      getArray(subscription, PROP_ENTITLEMENTS)?.let {
        addEntitlements(convertSubscriptionEntitlements(it))
      }
    }.build()
  }

  private fun convertSubscriptionEntitlements(entitlements: JSONArray): List<SubscriptionEntitlement> {
    return mutableListOf<SubscriptionEntitlement>().apply {
      for (i in 0 until entitlements.length()) {
        this += convertSubscriptionEntitlement(entitlements.getJSONObject(i))
      }
    }
  }

  private fun convertSubscriptionEntitlement(entitlement: JSONObject): SubscriptionEntitlement {
    return SubscriptionEntitlement.Builder().apply {
      getString(entitlement, PROP_NAME)?.let {
        setDisplayName(it)
      }
      getString(entitlement, PROP_ID)?.let {
        setEntitlementId(it)
      }
      getLong(entitlement, PROP_EXPIRATION_TIME)?.let {
        setExpirationTimeMillis(it)
      }
    }.build()
  }
}
