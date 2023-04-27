package com.theoplayercomscore.integration

import android.content.Context
import android.util.Log
import com.comscore.BuildConfig
import com.theoplayer.android.api.THEOplayerGlobal
import com.theoplayer.android.api.player.Player
import com.theoplayercomscore.integration.ComscoreAnalytics.Companion.createComscoreStreamingAnalytics
import com.theoplayercomscore.integration.ComscoreAnalytics.Companion.start

private const val TAG = "ComscoreConnector"

class ComscoreConnector(
  appContext: Context,
  player: Player,
  configuration: ComscoreConfiguration,
  metadata: ComscoreMetaData
) {
  private var streamingAnalytics: ComscoreStreamingAnalytics? = null

  init {
    start(configuration, appContext)
    try {
      streamingAnalytics =
        createComscoreStreamingAnalytics(player, THEOplayerGlobal.getVersion(), metadata)
      if (BuildConfig.DEBUG) {
        Log.i(TAG, "DEBUG: initializing the analytics adapter success")
      }
    } catch (e: Exception) {
      if (BuildConfig.DEBUG) {
        Log.e(TAG, "DEBUG: initializing the analytics adapter failed")
      }
      e.printStackTrace()
    }
  }

  fun update(metadata: ComscoreMetaData) {
    streamingAnalytics?.update(metadata)
  }

  fun setPersistentLabels(labels: Map<String, String>) {
    streamingAnalytics?.setPersistentLabels(labels)
  }

  fun setPersistentLabel(label: String, value: String) {
    streamingAnalytics?.setPersistentLabel(label, value)
  }

  fun destroy() {
    // TODO
  }
}
