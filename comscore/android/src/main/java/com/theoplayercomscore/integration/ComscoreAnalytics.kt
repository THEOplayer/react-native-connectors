package com.theoplayercomscore.integration

import android.content.Context
import android.util.Log
import com.comscore.Analytics
import com.comscore.BuildConfig
import com.comscore.PublisherConfiguration
import com.theoplayer.android.api.player.Player

private const val TAG = "ComscoreConnector"

class ComscoreAnalytics {
  companion object {
    private var startedTracking = false
    private var comscoreConfiguration: ComscoreConfiguration? = null

    fun start(configuration: ComscoreConfiguration, context: Context?) {
      if (!startedTracking) {
        if (BuildConfig.DEBUG) {
          Log.i(TAG, "calling start")
        }
        comscoreConfiguration = configuration
        val publisherConfigurationBuilder = PublisherConfiguration.Builder()
          .publisherId(configuration.publisherId)
          .secureTransmission(configuration.isSecureTransmission)
        if (configuration.userConsent === "1" || configuration.userConsent === "0") {
          publisherConfigurationBuilder.persistentLabels(object :
            HashMap<String?, String?>() {
            init {
              put("cs_ucfr", configuration.userConsent)
            }
          })
        }
        val publisherConfiguration = publisherConfigurationBuilder.build()
        val comscoreConfiguration = Analytics.getConfiguration()
        comscoreConfiguration.addClient(publisherConfiguration)
        comscoreConfiguration.setApplicationName(configuration.applicationName)
        if (configuration.isChildDirected) {
          comscoreConfiguration.enableChildDirectedApplicationMode()
        }
        if (configuration.isDebug) {
          comscoreConfiguration.enableImplementationValidationMode()
        }
        Analytics.start(context)
        startedTracking = true
      }
    }

    @Throws(ComscoreAnalyticsException::class)
    fun createComscoreStreamingAnalytics(
      player: Player,
      playerVersion: String,
      metadata: ComscoreMetaData
    ): ComscoreStreamingAnalytics {
      val config = comscoreConfiguration
      return if (startedTracking && config != null) {
        if (BuildConfig.DEBUG) {
          Log.i(TAG, "will create CSA object")
        }
        ComscoreStreamingAnalytics(
          player,
          playerVersion,
          config,
          metadata
        )
      } else {
        throw ComscoreAnalyticsException("start should be called first, can't create the streaming analytics")
      }
    }
  }

  fun setPersistentLabel(label: String, value: String) {
    if (startedTracking) {
      comscoreConfiguration?.let { config ->
        ComscoreUtils.notifyHiddenEvent(config.publisherId, label, value)
      }
    }
  }

  fun setPersistentLabels(labels: Map<String, String>) {
    if (startedTracking) {
      comscoreConfiguration?.let { config ->
        ComscoreUtils.notifyHiddenEvents(config.publisherId, labels)
      }
    }
  }
}
