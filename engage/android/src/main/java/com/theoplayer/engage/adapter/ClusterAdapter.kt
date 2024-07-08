package com.theoplayer.engage.adapter

import com.google.android.engage.common.datamodel.ContinuationCluster
import com.google.android.engage.common.datamodel.FeaturedCluster
import com.google.android.engage.common.datamodel.RecommendationCluster
import com.google.android.engage.common.datamodel.SubscriptionCluster
import com.google.android.engage.common.datamodel.SubscriptionEntity
import com.theoplayer.engage.adapter.Constants.PROP_ACCOUNT_PROFILE
import com.theoplayer.engage.adapter.Constants.PROP_ACTION_TEXT
import com.theoplayer.engage.adapter.Constants.PROP_ACTION_URI
import com.theoplayer.engage.adapter.Constants.PROP_CONFIG
import com.theoplayer.engage.adapter.Constants.PROP_ENTITIES
import com.theoplayer.engage.adapter.Constants.PROP_SUBTITLE
import com.theoplayer.engage.adapter.Constants.PROP_SYNC_ACROSS_DEVICES
import com.theoplayer.engage.adapter.Constants.PROP_TITLE
import com.theoplayer.engage.adapter.EntityAdapter.convertAccountProfile
import com.theoplayer.engage.adapter.EntityAdapter.convertItems
import com.theoplayer.engage.adapter.ParseUtils.getBool
import com.theoplayer.engage.adapter.ParseUtils.getObject
import com.theoplayer.engage.adapter.ParseUtils.getString
import com.theoplayer.engage.adapter.ParseUtils.getUri
import org.json.JSONObject

object ClusterAdapter {
  fun convertContinuationCluster(cluster: String): ContinuationCluster {
    return ContinuationCluster.Builder().apply {
      val json = JSONObject(cluster)
      convertItems(json.optJSONArray(PROP_ENTITIES)).forEach { entity ->
        addEntity(entity)
      }
      getObject(json, PROP_CONFIG)?.let { config ->
        getObject(config, PROP_ACCOUNT_PROFILE)?.let {
          setAccountProfile(convertAccountProfile(it))
        }
        getBool(config, PROP_SYNC_ACROSS_DEVICES)?.let {
          setSyncAcrossDevices(it)
        }
      }
    }.build()
  }

  fun convertRecommendationCluster(cluster: String): RecommendationCluster {
    return RecommendationCluster.Builder().apply {
      val json = JSONObject(cluster)
      convertItems(json.optJSONArray(PROP_ENTITIES)).forEach { entity ->
        addEntity(entity)
      }
      getObject(json, PROP_CONFIG)?.let { config ->
        getString(config, PROP_TITLE)?.let {
          setTitle(it)
        }
        getString(config, PROP_SUBTITLE)?.let {
          setSubtitle(it)
        }
        getString(config, PROP_ACTION_TEXT)?.let {
          setActionText(it)
        }
        getUri(config, PROP_ACTION_URI)?.let {
          setActionUri(it)
        }
      }
    }.build()
  }

  fun convertFeaturedCluster(cluster: String): FeaturedCluster {
    return FeaturedCluster.Builder().apply {
      val json = JSONObject(cluster)
      convertItems(json.optJSONArray(PROP_ENTITIES)).forEach { entity ->
        addEntity(entity)
      }
    }.build()
  }

  fun convertSubscriptionCluster(cluster: String): SubscriptionCluster {
    return SubscriptionCluster.Builder().apply {
      val json = JSONObject(cluster)
      convertItems(json.optJSONArray(PROP_ENTITIES)).forEach { entity ->
        addSubscriptionEntity(entity as SubscriptionEntity)
      }
    }.build()
  }
}
