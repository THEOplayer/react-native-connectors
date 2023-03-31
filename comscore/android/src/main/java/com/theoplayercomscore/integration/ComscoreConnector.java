package com.theoplayercomscore.integration;

import android.content.Context;
import android.util.Log;

import com.comscore.BuildConfig;
import com.theoplayer.android.api.THEOplayerGlobal;
import com.theoplayer.android.api.player.Player;

import java.util.Map;

public class ComscoreConnector {
  private ComscoreStreamingAnalytics streamingAnalytics;

  public ComscoreConnector(Context appContext, Player player, ComscoreConfiguration configuration, ComscoreMetaData metadata) {
    ComscoreAnalytics.start(configuration, appContext);
    try {
      this.streamingAnalytics = ComscoreAnalytics.createComscoreStreamingAnalytics(player, THEOplayerGlobal.getVersion(), metadata);
      if (BuildConfig.DEBUG) {
        Log.i("THEOlog", "DEBUG: initializing the analytics adapter success");
      }
    } catch (Exception e) {
      if (BuildConfig.DEBUG) {
        Log.e("THEOlog", "DEBUG: initializing the analytics adapter failed");
      }
      e.printStackTrace();
    }
  }

  public void update(ComscoreMetaData metadata) {
    streamingAnalytics.update(metadata);
  }

  public void setPersistentLabels(Map<String, String> labels) {
    streamingAnalytics.setPersistentLabels(labels);
  }

  public void setPersistentLabel(String label, String value) {
    streamingAnalytics.setPersistentLabel(label, value);
  }

  public void destroy() {
    // TODO
  }
}
