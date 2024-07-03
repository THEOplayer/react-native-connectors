package com.theoplayer.engage.publish

import android.content.Context
import com.google.android.engage.common.datamodel.ContinuationCluster
import com.google.android.engage.common.datamodel.Entity
import com.google.android.engage.common.datamodel.FeaturedCluster
import com.google.android.engage.common.datamodel.RecommendationCluster
import com.google.android.engage.service.PublishContinuationClusterRequest
import com.google.android.engage.service.PublishFeaturedClusterRequest
import com.google.android.engage.service.PublishRecommendationClustersRequest
import com.theoplayer.engage.EngageConfiguration
import com.theoplayer.engage.R

class ClusterRequestFactory(context: Context) {
  private val defaultRecommendationClusterTitle = context.resources.getString(R.string.recommendation_cluster_title)

  fun constructRecommendationClusterRequest(items: List<Entity>): PublishRecommendationClustersRequest {
    val recommendationCluster = RecommendationCluster.Builder()
    for (item in items) {
      recommendationCluster.addEntity(item)
    }
    val recommendationClusterTitle = EngageConfiguration.recommendationTitle ?: defaultRecommendationClusterTitle
    return PublishRecommendationClustersRequest.Builder()
      .addRecommendationCluster(recommendationCluster.setTitle(recommendationClusterTitle).build())
      .build()
  }

  fun constructContinuationClusterRequest(items: List<Entity>): PublishContinuationClusterRequest {
    val continuationCluster = ContinuationCluster.Builder()
    for (item in items) {
      continuationCluster.addEntity(item)
    }
    return PublishContinuationClusterRequest.Builder()
      .setContinuationCluster(continuationCluster.build())
      .build()
  }

  fun constructFeaturedClusterRequest(items: List<Entity>): PublishFeaturedClusterRequest {
    val featuredCluster = FeaturedCluster.Builder()
    for (item in items) {
      featuredCluster.addEntity(item)
    }
    return PublishFeaturedClusterRequest.Builder()
      .setFeaturedCluster(featuredCluster.build())
      .build()
  }
}
