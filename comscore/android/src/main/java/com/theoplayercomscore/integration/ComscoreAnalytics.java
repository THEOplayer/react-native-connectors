package com.theoplayercomscore.integration;

import android.content.Context;
import android.util.Log;

import com.comscore.Analytics;
import com.comscore.BuildConfig;
import com.comscore.Configuration;
import com.comscore.PublisherConfiguration;
import com.theoplayer.android.api.player.Player;

import java.util.HashMap;
import java.util.Map;

@SuppressWarnings("unused")
public class ComscoreAnalytics {
  private static boolean startedTracking;
  private static ComscoreConfiguration comscoreConfiguration;

  public static void start(ComscoreConfiguration configuration, Context context) {
    if (!startedTracking) {
      if (BuildConfig.DEBUG) {
        Log.i("THEOlog", "calling start");
      }
      comscoreConfiguration = configuration;

      PublisherConfiguration.Builder publisherConfigurationBuilder = new PublisherConfiguration.Builder()
        .publisherId(configuration.getPublisherId())
        .secureTransmission(configuration.isSecureTransmission());

      if (configuration.getUserConsent() == "1" || configuration.getUserConsent() == "0") {
        publisherConfigurationBuilder.persistentLabels(new HashMap<String, String>() {
          {
            put("cs_ucfr", configuration.getUserConsent());
          }
        });
      }

      PublisherConfiguration publisherConfiguration = publisherConfigurationBuilder.build();

      Configuration comscoreConfiguration = Analytics.getConfiguration();

      comscoreConfiguration.addClient(publisherConfiguration);
      comscoreConfiguration.setApplicationName(configuration.getApplicationName());
      if (configuration.isChildDirected()) {
        comscoreConfiguration.enableChildDirectedApplicationMode();
      }

      if (configuration.isDebug()) {
        comscoreConfiguration.enableImplementationValidationMode();
      }

      Analytics.start(context);
      startedTracking = true;
    }
  }

  public void setPersistentLabel(String label, String value) {
    if (startedTracking) {
      ComscoreUtils.notifyHiddenEvent(comscoreConfiguration.getPublisherId(), label, value);
    }
  }

  public void setPersistentLabels(Map<String, String> labels) {
    if (startedTracking) {
      ComscoreUtils.notifyHiddenEvents(comscoreConfiguration.getPublisherId(), labels);
    }
  }

  public static ComscoreStreamingAnalytics createComscoreStreamingAnalytics(Player player, String playerVersion, ComscoreMetaData metadata) throws ComscoreAnalyticsException {
    if (startedTracking) {
      if (BuildConfig.DEBUG) {
        Log.i("THEOlog", "will create CSA object");
      }
      return new ComscoreStreamingAnalytics(player, playerVersion, comscoreConfiguration, metadata);
    } else {
      throw new ComscoreAnalyticsException("start should be called first, can't create the streaming analytics");
    }
  }
}

