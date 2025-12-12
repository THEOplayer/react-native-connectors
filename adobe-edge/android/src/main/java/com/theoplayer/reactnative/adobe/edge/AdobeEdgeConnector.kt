package com.theoplayer.reactnative.adobe.edge

import com.adobe.marketing.mobile.LoggingMode
import com.theoplayer.android.api.player.Player

class AdobeEdgeConnector(
  player: Player,
  trackerConfig: Map<String, String>,
) {

  private val handler = AdobeEdgeHandler(player, trackerConfig)

  fun updateMetadata(metadata: HashMap<String, String>) {
    handler.updateMetadata(metadata)
  }

  fun stopAndStartNewSession(metadata: Map<String, String>?) {
    handler.stopAndStartNewSession(metadata)
  }

  fun setLoggingMode(loggingMode: LoggingMode) {
    handler.setLoggingMode(loggingMode)
  }

  fun setError(errorId: String) {
    handler.setError(errorId)
  }

  fun destroy() {
    handler.destroy()
  }
}
