package com.theoplayer.engage.publish

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.google.android.engage.service.Intents.ACTION_PUBLISH_CONTINUATION
import com.google.android.engage.service.Intents.ACTION_PUBLISH_FEATURED
import com.google.android.engage.service.Intents.ACTION_PUBLISH_RECOMMENDATION
import com.theoplayer.engage.publish.Constants.PUBLISH_TYPE_CONTINUATION
import com.theoplayer.engage.publish.Constants.PUBLISH_TYPE_FEATURED
import com.theoplayer.engage.publish.Constants.PUBLISH_TYPE_RECOMMENDATIONS

private const val TAG = "EngageBroadcastReceiver"

/**
 *  These broadcast events are only triggered when the Engage Service determines that the content
 *  might be stale. That way, there is greater confidence that the user will have a fresh content
 *  experience, even if the application has not been opened for a long time.
 */
class EngageServiceBroadcastReceiver : BroadcastReceiver() {

  override fun onReceive(context: Context?, intent: Intent?) {
    if (intent == null || context == null) {
      return
    }
    when (intent.action) {
      ACTION_PUBLISH_RECOMMENDATION -> { onPublish(context as ReactApplicationContext, PUBLISH_TYPE_RECOMMENDATIONS) }
      ACTION_PUBLISH_FEATURED -> { onPublish(context as ReactApplicationContext, PUBLISH_TYPE_FEATURED)  }
      ACTION_PUBLISH_CONTINUATION -> { onPublish(context as ReactApplicationContext, PUBLISH_TYPE_CONTINUATION)  }
      else -> Log.e(TAG, "onReceive: Received unrecognized intent: $intent")
    }
  }

  @Suppress("UNUSED_PARAMETER")
  private fun onPublish(context: ReactApplicationContext, type: String) {
    // TODO
  }
}
