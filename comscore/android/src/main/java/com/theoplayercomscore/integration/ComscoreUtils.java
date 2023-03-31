package com.theoplayercomscore.integration;

import android.os.Build;

import com.comscore.Analytics;
import com.comscore.PublisherConfiguration;

import java.util.Map;

public class ComscoreUtils {
  public static void notifyHiddenEvent(String publisherId, String label, String value) {
    PublisherConfiguration publisherConfiguration = Analytics.getConfiguration().getPublisherConfiguration(publisherId);
    publisherConfiguration.setPersistentLabel(label, value);
  }

  public static void notifyHiddenEvents(String publisherId, Map<String, String> labels) {
    PublisherConfiguration publisherConfiguration = Analytics.getConfiguration().getPublisherConfiguration(publisherId);
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
      labels.forEach(publisherConfiguration::setPersistentLabel);
    }
  }
}
