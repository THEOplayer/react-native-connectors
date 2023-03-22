package com.theoplayercomscore.integration;

import android.content.Context;
import android.util.Log;

import com.theoplayer.android.api.THEOplayerConfig;
import com.theoplayer.android.api.THEOplayerGlobal;
import com.theoplayer.android.api.player.Player;

import java.util.Map;

public class ComscoreConnector {
    private ComscoreStreamingAnalytics streamingAnalytics;
    private Player player;

  public ComscoreConnector(Context appContext, Player player, ComscoreConfiguration configuration, ComscoreMetaData metadata) throws Exception {
    this.player = player;
    ComscoreAnalytics.start(configuration,appContext);
    try {
      this.streamingAnalytics = ComscoreAnalytics.createComscoreStreamingAnalytics(player, THEOplayerGlobal.getVersion(),metadata);
      Log.i("THEOlog", "DEBUG: initializing the analytics adapter success");
    } catch (Exception e) {
      Log.i("THEOlog", "DEBUG: initializing the analytics adapter failed");
      e.printStackTrace();
    }
  }

  public void update(ComscoreMetaData metadata) {
    streamingAnalytics.update(metadata);
  }

  public void setPersistentLabels(Map<String,String> labels) {
    streamingAnalytics.setPersistentLabels(labels);
  }

  public void setPersistentLabel(String label, String value) {
    streamingAnalytics.setPersistentLabel(label,value);
  }

  public void destroy() {
    // TODO
  }
}
