package com.theoplayercomscore.integration

import com.theoplayer.android.api.player.Player

class ComscoreStreamingAnalytics(
  player: Player,
  playerVersion: String?,
  configuration: ComscoreConfiguration,
  metadata: ComscoreMetaData
) {
  private val adapter: ComscoreTHEOplayerAdapter

  init {
    adapter = ComscoreTHEOplayerAdapter(player, playerVersion, configuration, metadata)
  }

  fun reportEnd() {
    adapter.notifyEnd()
  }

  fun reportPause() {
    adapter.notifyPause()
  }

  fun setPersistentLabel(label: String, value: String) {
    adapter.setPersistentLabel(label, value)
  }

  fun setPersistentLabels(labels: Map<String, String>) {
    adapter.setPersistentLabels(labels)
  }

  fun update(metadata: ComscoreMetaData) {
    adapter.setMedatata(metadata)
  }
}
