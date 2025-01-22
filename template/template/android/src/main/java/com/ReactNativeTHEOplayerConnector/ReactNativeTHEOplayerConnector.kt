package com.ReactNativeTHEOplayerConnector

import android.content.Context
import com.theoplayer.android.api.player.Player

class ReactNativeTHEOplayerConnector(
    private val context: Context,
    private val player: Player,
    private val config: ReactNativeTHEOplayerConnectorConfiguration
) {

    init {
        // Initialize connector
    }

    fun destroy() {
        // Destroy connector
    }
}