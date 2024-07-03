package com.theoplayer.engage.publish

object Constants {
  const val MAX_PUBLISHING_ATTEMPTS: Int = 5

  const val WORKER_NAME_RECOMMENDATIONS: String = "Upload Recommendations"
  const val WORKER_NAME_CONTINUATION: String = "Upload Continuation"
  const val WORKER_NAME_FEATURED: String = "Upload Featured"

  const val PUBLISH_TYPE: String = "type"
  const val PUBLISH_ITEMS: String = "items"
  const val PUBLISH_TYPE_RECOMMENDATIONS = "recommendations"
  const val PUBLISH_TYPE_CONTINUATION = "continuation"
  const val PUBLISH_TYPE_FEATURED = "featured"
}
