package com.theoplayer.engage.publish

import android.content.Context
import android.util.Log
import androidx.work.WorkerParameters
import androidx.work.CoroutineWorker
import com.google.android.engage.common.datamodel.Entity
import com.google.android.engage.service.AppEngageException
import com.google.android.engage.service.AppEngagePublishClient
import com.google.android.engage.service.AppEngagePublishStatusCode
import com.google.android.engage.service.PublishStatusRequest
import com.google.android.gms.tasks.Task
import com.theoplayer.engage.data.EntityAdapter
import com.theoplayer.engage.publish.Constants.PUBLISH_ITEMS
import com.theoplayer.engage.publish.Constants.PUBLISH_TYPE
import com.theoplayer.engage.publish.Constants.PUBLISH_TYPE_CONTINUATION
import com.theoplayer.engage.publish.Constants.PUBLISH_TYPE_FEATURED
import com.theoplayer.engage.publish.Constants.PUBLISH_TYPE_RECOMMENDATIONS
import kotlinx.coroutines.tasks.await

private const val TAG = "EngageServiceWorker"

class EngageServiceWorker(
  context: Context,
  workerParams: WorkerParameters
) : CoroutineWorker(context, workerParams) {

  private var client = AppEngagePublishClient(context)
  private val clusterRequestFactory = ClusterRequestFactory(context)

  override suspend fun doWork(): Result {
    if (runAttemptCount > Constants.MAX_PUBLISHING_ATTEMPTS) {
      return Result.failure()
    }

    if (!client.isServiceAvailable.await()) {
      return Result.failure()
    }

    val items = EntityAdapter.convertItems(inputData.getString(PUBLISH_ITEMS))
    if (items.isEmpty()) {
      return Result.failure()
    }

    return when (inputData.getString(PUBLISH_TYPE)) {
      PUBLISH_TYPE_RECOMMENDATIONS -> publishRecommendations(items)
      PUBLISH_TYPE_CONTINUATION -> publishContinuation(items)
      PUBLISH_TYPE_FEATURED -> publishFeatured(items)
      else -> throw IllegalArgumentException("Bad publish type")
    }
  }

  private suspend fun publishRecommendations(items: List<Entity>): Result {
    val publishTask = client.publishRecommendationClusters(
      clusterRequestFactory.constructRecommendationClusterRequest(items)
    )
    val statusCode = AppEngagePublishStatusCode.PUBLISHED
    return publishAndProvideResult(publishTask, statusCode)
  }

  private suspend fun publishContinuation(items: List<Entity>): Result {
    val publishTask = client.publishContinuationCluster(
      clusterRequestFactory.constructContinuationClusterRequest(items)
    )
    val statusCode = AppEngagePublishStatusCode.PUBLISHED
    return publishAndProvideResult(publishTask, statusCode)
  }

  private suspend fun publishFeatured(items: List<Entity>): Result {
    val publishTask = client.publishFeaturedCluster(
      clusterRequestFactory.constructFeaturedClusterRequest(items)
    )
    val statusCode = AppEngagePublishStatusCode.PUBLISHED
    return publishAndProvideResult(publishTask, statusCode)
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
