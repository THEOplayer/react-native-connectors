package com.theoplayer.engage.publish

import android.content.Context
import android.util.Log
import androidx.work.WorkerParameters
import androidx.work.CoroutineWorker
import com.google.android.engage.common.datamodel.ContinuationCluster
import com.google.android.engage.common.datamodel.Entity
import com.google.android.engage.common.datamodel.FeaturedCluster
import com.google.android.engage.common.datamodel.RecommendationCluster
import com.google.android.engage.common.datamodel.SignInCardEntity
import com.google.android.engage.service.AppEngageException
import com.google.android.engage.service.AppEngagePublishClient
import com.google.android.engage.service.AppEngagePublishStatusCode
import com.google.android.engage.service.PublishContinuationClusterRequest
import com.google.android.engage.service.PublishFeaturedClusterRequest
import com.google.android.engage.service.PublishRecommendationClustersRequest
import com.google.android.engage.service.PublishStatusRequest
import com.google.android.engage.service.PublishUserAccountManagementRequest
import com.google.android.gms.tasks.Task
import com.theoplayer.engage.adapter.ClusterAdapter
import com.theoplayer.engage.adapter.EntityAdapter
import com.theoplayer.engage.publish.Constants.PUBLISH_CLUSTER
import com.theoplayer.engage.publish.Constants.CLUSTER_TYPE
import com.theoplayer.engage.publish.Constants.PUBLISH_TYPE_CONTINUATION
import com.theoplayer.engage.publish.Constants.PUBLISH_TYPE_FEATURED
import com.theoplayer.engage.publish.Constants.PUBLISH_TYPE_RECOMMENDATIONS
import com.theoplayer.engage.publish.Constants.PUBLISH_TYPE_USER_ACCOUNT_MANAGEMENT
import com.theoplayer.engage.publish.Constants.WORK_PUBLISH
import com.theoplayer.engage.publish.Constants.WORK_TYPE
import com.theoplayer.engage.publish.Constants.WORK_UNPUBLISH
import kotlinx.coroutines.tasks.await

private const val TAG = "EngageServiceWorker"

class EngageServiceWorker(
  context: Context,
  workerParams: WorkerParameters
) : CoroutineWorker(context, workerParams) {

  private var client = AppEngagePublishClient(context)

  override suspend fun doWork(): Result {
    if (runAttemptCount > Constants.MAX_PUBLISHING_ATTEMPTS) {
      return Result.failure()
    }

    if (!client.isServiceAvailable.await()) {
      Log.w(TAG, "Engage service not available")
      return Result.failure()
    }

    val clusterType = inputData.getString(CLUSTER_TYPE)

    return when (inputData.getString(WORK_TYPE)) {
      WORK_PUBLISH -> publish(inputData.getString(PUBLISH_CLUSTER), clusterType)
      WORK_UNPUBLISH -> unpublish(clusterType)
      else -> Result.failure()
    }
  }

  private suspend fun publish(payload: String?, clusterType: String?): Result {
    if (payload.isNullOrEmpty()) {
      return Result.failure()
    }
    return when (clusterType) {
      PUBLISH_TYPE_RECOMMENDATIONS -> publishRecommendations(
        ClusterAdapter.convertRecommendationCluster(payload)
      )
      PUBLISH_TYPE_CONTINUATION -> publishContinuation(
        ClusterAdapter.convertContinuationCluster(payload)
      )
      PUBLISH_TYPE_FEATURED -> publishFeatured(
        ClusterAdapter.convertFeaturedCluster(payload)
      )
//      PUBLISH_TYPE_SUBSCRIPTION -> publishSubscription(cluster)
      PUBLISH_TYPE_USER_ACCOUNT_MANAGEMENT -> publishUserAccountManagement(
        EntityAdapter.convertItem(payload)
      )
      else -> throw IllegalArgumentException("Bad publish type")
    }
  }

  private suspend fun unpublish(clusterType: String?): Result {
    return when (clusterType) {
      PUBLISH_TYPE_RECOMMENDATIONS -> deleteRecommendations()
      PUBLISH_TYPE_CONTINUATION -> deleteContinuation()
      PUBLISH_TYPE_FEATURED -> deleteFeatured()
      PUBLISH_TYPE_USER_ACCOUNT_MANAGEMENT -> deleteUserAccountManagement()
      else -> throw IllegalArgumentException("Bad publish type")
    }
  }

  private suspend fun deleteRecommendations(): Result {
    return publishAndProvideResult(
      client.deleteRecommendationsClusters(),
      AppEngagePublishStatusCode.PUBLISHED
    )
  }

  private suspend fun publishRecommendations(cluster: RecommendationCluster): Result {
    val publishTask: Task<Void> = client.publishRecommendationClusters(
      PublishRecommendationClustersRequest.Builder()
        .addRecommendationCluster(cluster)
        .build()
    )
    return publishAndProvideResult(publishTask, AppEngagePublishStatusCode.PUBLISHED)
  }

  private suspend fun deleteContinuation(): Result {
    return publishAndProvideResult(
      client.deleteContinuationCluster(),
      AppEngagePublishStatusCode.PUBLISHED
    )
  }

  private suspend fun publishContinuation(cluster: ContinuationCluster): Result {
    val publishTask: Task<Void> = client.publishContinuationCluster(
      PublishContinuationClusterRequest.Builder()
        .setContinuationCluster(cluster)
        .build()
    )
    return publishAndProvideResult(publishTask, AppEngagePublishStatusCode.PUBLISHED)
  }

  private suspend fun deleteFeatured(): Result {
    return publishAndProvideResult(
      client.deleteFeaturedCluster(),
      AppEngagePublishStatusCode.PUBLISHED
    )
  }

  private suspend fun publishFeatured(cluster: FeaturedCluster): Result {
    val publishTask: Task<Void> = client.publishFeaturedCluster(
      PublishFeaturedClusterRequest.Builder()
        .setFeaturedCluster(cluster)
        .build()
    )
    return publishAndProvideResult(publishTask, AppEngagePublishStatusCode.PUBLISHED)
  }

  private suspend fun deleteUserAccountManagement(): Result {
    return publishAndProvideResult(
      client.deleteUserManagementCluster(),
      AppEngagePublishStatusCode.PUBLISHED
    )
  }

  private suspend fun publishUserAccountManagement(item: Entity): Result {
    val publishTask: Task<Void> = client.publishUserAccountManagementRequest(
      PublishUserAccountManagementRequest.Builder()
        .setSignInCardEntity(item as SignInCardEntity).build()
    )
    return publishAndProvideResult(publishTask, AppEngagePublishStatusCode.PUBLISHED)
  }

  private suspend fun publishAndProvideResult(
    publishTask: Task<Void>,
    publishStatusCode: Int
  ): Result {
    setPublishStatusCode(publishStatusCode)

    var result: Result = Result.success()
    try {
      publishTask.await()
    } catch (publishException: Exception) {
      Publisher.logPublishing(publishException as AppEngageException)
      result =
        if (Publisher.isErrorRecoverable(publishException)) Result.retry() else Result.failure()
    }
    return result
  }

  private fun setPublishStatusCode(statusCode: Int) {
    client
      .updatePublishStatus(PublishStatusRequest.Builder().setStatusCode(statusCode).build())
      .addOnSuccessListener {
        Log.i(TAG, "Successfully updated publish status code to $statusCode")
      }
      .addOnFailureListener { exception ->
        Log.e(TAG, "Failed to update publish status code to $statusCode\n${exception.stackTrace}")
      }
  }
}
