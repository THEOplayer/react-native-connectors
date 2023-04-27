package com.theoplayercomscore.integration

import android.os.Build
import com.comscore.Analytics

object ComscoreUtils {
    fun notifyHiddenEvent(publisherId: String?, label: String?, value: String?) {
        val publisherConfiguration =
            Analytics.getConfiguration().getPublisherConfiguration(publisherId)
        publisherConfiguration.setPersistentLabel(label, value)
    }

    fun notifyHiddenEvents(publisherId: String, labels: Map<String, String>) {
        val publisherConfiguration =
            Analytics.getConfiguration().getPublisherConfiguration(publisherId)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            labels.forEach { (name: String, value: String) ->
                publisherConfiguration.setPersistentLabel(
                    name,
                    value
                )
            }
        }
    }
}
