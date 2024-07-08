package com.theoplayer.engage.publish

import android.content.Context
import android.util.Log
import androidx.work.ExistingWorkPolicy
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.workDataOf
import com.google.android.engage.service.AppEngageErrorCode
import com.google.android.engage.service.AppEngageException
import com.theoplayer.engage.publish.Constants.PUBLISH_CLUSTER
import com.theoplayer.engage.publish.Constants.CLUSTER_TYPE
import com.theoplayer.engage.publish.Constants.PUBLISH_TYPE_CONTINUATION
import com.theoplayer.engage.publish.Constants.PUBLISH_TYPE_FEATURED
import com.theoplayer.engage.publish.Constants.PUBLISH_TYPE_RECOMMENDATIONS
import com.theoplayer.engage.publish.Constants.PUBLISH_TYPE_SUBSCRIPTION
import com.theoplayer.engage.publish.Constants.PUBLISH_TYPE_USER_ACCOUNT_MANAGEMENT
import com.theoplayer.engage.publish.Constants.WORKER_NAME_CONTINUATION
import com.theoplayer.engage.publish.Constants.WORKER_NAME_FEATURED
import com.theoplayer.engage.publish.Constants.WORKER_NAME_RECOMMENDATIONS
import com.theoplayer.engage.publish.Constants.WORKER_NAME_SUBSCRIPTION
import com.theoplayer.engage.publish.Constants.WORKER_NAME_USER_ACCOUNT_MANAGEMENT
import com.theoplayer.engage.publish.Constants.WORK_PUBLISH
import com.theoplayer.engage.publish.Constants.WORK_TYPE
import com.theoplayer.engage.publish.Constants.WORK_UNPUBLISH
import org.json.JSONObject

object Publisher {
  private const val TAG = "Publisher"

  fun publishRecommendationClusters(context: Context, clusterJson: JSONObject) {
    queueOneTimeEngageServiceWorker(
      WORKER_NAME_RECOMMENDATIONS,
      WORK_PUBLISH,
      PUBLISH_TYPE_RECOMMENDATIONS,
      clusterJson,
      context
    )
  }

  fun unpublishRecommendationClusters(context: Context) {
    queueOneTimeEngageServiceWorker(
      WORKER_NAME_RECOMMENDATIONS,
      WORK_UNPUBLISH,
      PUBLISH_TYPE_RECOMMENDATIONS,
      null,
      context
    )
  }

  fun publishFeaturedClusters(context: Context, payload: JSONObject) {
    queueOneTimeEngageServiceWorker(
      WORKER_NAME_FEATURED,
      WORK_PUBLISH,
      PUBLISH_TYPE_FEATURED,
      payload,
      context
    )
  }

  fun unpublishFeaturedClusters(context: Context) {
    queueOneTimeEngageServiceWorker(
      WORKER_NAME_FEATURED,
      WORK_UNPUBLISH,
      PUBLISH_TYPE_FEATURED,
      null,
      context
    )
  }

  fun publishContinuationClusters(context: Context, payload: JSONObject) {
    queueOneTimeEngageServiceWorker(
      WORKER_NAME_CONTINUATION,
      WORK_PUBLISH,
      PUBLISH_TYPE_CONTINUATION,
      payload,
      context
    )
  }

  fun unpublishContinuationClusters(context: Context) {
    queueOneTimeEngageServiceWorker(
      WORKER_NAME_CONTINUATION,
      WORK_UNPUBLISH,
      PUBLISH_TYPE_CONTINUATION,
      null,
      context
    )
  }

  fun publishSubscriptionClusters(context: Context, payload: JSONObject) {
    queueOneTimeEngageServiceWorker(
      WORKER_NAME_SUBSCRIPTION,
      WORK_PUBLISH,
      PUBLISH_TYPE_SUBSCRIPTION,
      payload,
      context
    )
  }

  fun publishUserAccount(context: Context, payload: JSONObject) {
    queueOneTimeEngageServiceWorker(
      WORKER_NAME_USER_ACCOUNT_MANAGEMENT,
      WORK_PUBLISH,
      PUBLISH_TYPE_USER_ACCOUNT_MANAGEMENT,
      payload,
      context
    )
  }

  private fun queueOneTimeEngageServiceWorker(
    workerName: String,
    workType: String,
    publishType: String,
    clusterJson: JSONObject?,
    context: Context
  ) {
    val workRequest =
      OneTimeWorkRequestBuilder<EngageServiceWorker>()
        .setInputData(
          workDataOf(
            CLUSTER_TYPE to publishType,
            WORK_TYPE to workType,
            PUBLISH_CLUSTER to clusterJson?.toString()
          )
        )
        .build()
    WorkManager.getInstance(context)
      .enqueueUniqueWork(workerName, ExistingWorkPolicy.REPLACE, workRequest)
  }

  fun logPublishing(publishingException: AppEngageException) {
    val logMessage =
      when (publishingException.errorCode) {
        AppEngageErrorCode.SERVICE_NOT_FOUND ->
          "SERVICE_NOT_FOUND - The service is not available on the given device"

        AppEngageErrorCode.SERVICE_CALL_EXECUTION_FAILURE ->
          "SERVICE_CALL_EXECUTION_FAILURE - The task execution failed due to threading issues, can be retired"

        AppEngageErrorCode.SERVICE_NOT_AVAILABLE ->
          "SERVICE_NOT_AVAILABLE - The service is available on the given device, but not available at the time of the call"

        AppEngageErrorCode.SERVICE_CALL_PERMISSION_DENIED ->
          "SERVICE_CALL_PERMISSION_DENIED - The The caller is not allowed to make the service call"

        AppEngageErrorCode.SERVICE_CALL_INVALID_ARGUMENT ->
          "SERVICE_CALL_INVALID_ARGUMENT - The request contains invalid data (e.g. more than allowed number of clusters"

        AppEngageErrorCode.SERVICE_CALL_INTERNAL ->
          "SERVICE_CALL_INTERNAL - There is an error on the service side"

        AppEngageErrorCode.SERVICE_CALL_RESOURCE_EXHAUSTED ->
          "SERVICE_CALL_RESOURCE_EXHAUSTED - The service call is made too frequently"

        else -> "An unknown error has occurred"
      }
    Log.d(TAG, logMessage)
  }

  fun isErrorRecoverable(publishingException: AppEngageException): Boolean {
    return when (publishingException.errorCode) {
      // Recoverable Error codes
      AppEngageErrorCode.SERVICE_CALL_EXECUTION_FAILURE,
      AppEngageErrorCode.SERVICE_CALL_INTERNAL,
      AppEngageErrorCode.SERVICE_CALL_RESOURCE_EXHAUSTED -> true
      // Non recoverable error codes
      AppEngageErrorCode.SERVICE_NOT_FOUND,
      AppEngageErrorCode.SERVICE_CALL_INVALID_ARGUMENT,
      AppEngageErrorCode.SERVICE_CALL_PERMISSION_DENIED,
      AppEngageErrorCode.SERVICE_NOT_AVAILABLE -> false

      else -> throw IllegalArgumentException(publishingException.localizedMessage)
    }
  }
}
