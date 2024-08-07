package com.theoplayer.engage.adapter

import com.google.android.engage.common.datamodel.SubscriptionEntity
import com.theoplayer.engage.adapter.Constants.PROP_ACCOUNT_PROFILE
import com.theoplayer.engage.adapter.ParseUtils.getInt
import com.theoplayer.engage.adapter.ParseUtils.getLong
import com.theoplayer.engage.adapter.ParseUtils.getString
import com.theoplayer.engage.adapter.Constants.PROP_EXPIRATION_TIME
import com.theoplayer.engage.adapter.Constants.PROP_PROVIDER_PACKAGE_NAME
import com.theoplayer.engage.adapter.Constants.PROP_SUBSCRIPTION_TYPE
import com.theoplayer.engage.adapter.EntityAdapter.convertAccountProfile
import com.theoplayer.engage.adapter.ParseUtils.getObject
import org.json.JSONObject

object SubscriptionAdapter {
  /**
   * Create a SubscriptionEntity from bridge data.
   */
  fun convert(subscription: JSONObject): SubscriptionEntity {
    val builder = SubscriptionEntity.Builder()
    getString(subscription, PROP_PROVIDER_PACKAGE_NAME)?.let {
      builder.setProviderPackageName(it)
    }
    getLong(subscription, PROP_EXPIRATION_TIME)?.let {
      builder.setExpirationTimeMillis(it)
    }
    getInt(subscription, PROP_SUBSCRIPTION_TYPE)?.let {
      builder.setSubscriptionType(it)
    }
    getObject(subscription, PROP_ACCOUNT_PROFILE)?.let {
      builder.setAccountProfile(convertAccountProfile(it))
    }
    return builder.build()
  }
}
