package com.theoplayer.engage
import com.facebook.react.bridge.Callback

enum class ClusterType {
  Continuation,
  Recommendation,
  Featured,
}

object EngageConfiguration {
  var debug: Boolean = false
  var recommendationTitle: String? = null
  var shouldPublishSignInCard: Boolean = false
}
