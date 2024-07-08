package com.theoplayer.engage.publish

object Constants {
  const val MAX_PUBLISHING_ATTEMPTS: Int = 5

  const val WORKER_NAME_RECOMMENDATIONS: String = "Upload Recommendations"
  const val WORKER_NAME_CONTINUATION: String = "Upload Continuation"
  const val WORKER_NAME_FEATURED: String = "Upload Featured"
  const val WORKER_NAME_SUBSCRIPTION: String = "Upload Subscription"
  const val WORKER_NAME_USER_ACCOUNT_MANAGEMENT: String = "Upload User Account Management"

  const val WORK_TYPE = "workType"
  const val WORK_PUBLISH = "publish"
  const val WORK_UNPUBLISH = "unpublish"

  const val CLUSTER_TYPE: String = "type"

  const val PUBLISH_CLUSTER: String = "cluster"
  const val PUBLISH_TYPE_RECOMMENDATIONS = "recommendations"
  const val PUBLISH_TYPE_CONTINUATION = "continuation"
  const val PUBLISH_TYPE_FEATURED = "featured"
  const val PUBLISH_TYPE_SUBSCRIPTION = "subscription"
  const val PUBLISH_TYPE_USER_ACCOUNT_MANAGEMENT = "userAccount"
}
