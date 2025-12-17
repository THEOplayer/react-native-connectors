package com.theoplayer.reactnative.adobe.edge

import com.adobe.marketing.mobile.LoggingMode
import com.adobe.marketing.mobile.edge.identity.IdentityMap
import com.theoplayer.android.api.player.Player

class AdobeEdgeConnector(
  player: Player,
  trackerConfig: Map<String, String>,
  customIdentityMap: IdentityMap? = null,
) {

  private val handler = AdobeEdgeHandler(player, trackerConfig, customIdentityMap)

  fun updateMetadata(metadata: HashMap<String, String>) {
    handler.updateMetadata(metadata)
  }

  fun setCustomIdentityMap(customIdentityMap: IdentityMap) {
    handler.setCustomIdentityMap(customIdentityMap)
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
