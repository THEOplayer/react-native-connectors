package com.theoplayercomscore.integration;

import com.theoplayer.android.api.player.Player;

import java.util.Map;

public class ComscoreStreamingAnalytics {

    private ComscoreTHEOplayerAdapter adapter;

    public ComscoreStreamingAnalytics(Player player, String playerVersion, ComscoreConfiguration configuration, ComscoreMetaData metadata) {
        adapter = new ComscoreTHEOplayerAdapter(player, playerVersion, configuration,metadata);
    }

    public void reportEnd() {
        adapter.notifyEnd();
    }

    public void reportPause() {
        adapter.notifyPause();
    }

    public void setPersistentLabel(String label, String value) {
        adapter.setPersistentLabel(label,value);
    }

    public void setPersistentLabels(Map<String,String> labels) {
        adapter.setPersistentLabels(labels);
    }

    public void update(ComscoreMetaData metadata) {
        adapter.setMedatata(metadata);
    }
}
