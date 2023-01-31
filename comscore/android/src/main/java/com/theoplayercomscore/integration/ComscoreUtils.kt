package com.theoplayercomscore.integration

import android.os.Build
import com.comscore.Analytics

object ComscoreUtils {
    fun notifyHiddenEvent(publisherId: String, label: String, value: String) {
      Analytics.getConfiguration().getPublisherConfiguration(publisherId)
        .setPersistentLabel(label, value)
    }

    fun notifyHiddenEvents(publisherId: String, labels: Map<String, String>) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
          Analytics.getConfiguration().getPublisherConfiguration(publisherId).let { config ->
            labels.forEach { (name: String, value: String) ->
              config.setPersistentLabel(name, value)
            }
          }
        }
    }
}
