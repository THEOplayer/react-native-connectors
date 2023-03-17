package com.theoplayernielsen

import android.content.Context
import com.theoplayer.android.api.player.Player

class NielsenConnector(
    appContext: Context,
    player: Player,
    appId: String,
    debug: Boolean = false,
) {
    private val nielsenHandler: NielsenHandler

    init {
        nielsenHandler = NielsenHandler(appContext, player, appId, debug)
    }

    fun updateMetadata(metadata: HashMap<String, Any>) {
        nielsenHandler.updateMetadata(metadata)
    }

    fun destroy() {
        this.nielsenHandler.destroy()
    }
}
