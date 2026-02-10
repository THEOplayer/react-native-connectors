package com.theoplayer.reactnative.bitmovin

import android.content.Context
import android.util.Log
import com.bitmovin.analytics.api.AnalyticsConfig
import com.bitmovin.analytics.api.CustomData
import com.bitmovin.analytics.api.DefaultMetadata
import com.bitmovin.analytics.api.SourceMetadata
import com.bitmovin.analytics.theoplayer.api.ITHEOplayerCollector
import com.theoplayer.android.api.event.EventListener
import com.theoplayer.android.api.event.player.PlayerEventTypes
import com.theoplayer.android.api.event.player.SourceChangeEvent
import com.theoplayer.android.api.player.Player
import com.theoplayer.android.api.source.metadata.MetadataDescription
import com.theoplayer.reactnative.bitmovin.BitmovinAdapter.parseCustomDataFromJSON
import org.json.JSONObject
import kotlin.apply

class BitmovinHandler(
  context: Context,
  private val player: Player,
  config: AnalyticsConfig,
  defaultMetadata: DefaultMetadata?
) {

  private val collector: ITHEOplayerCollector = ITHEOplayerCollector.create(context, config)
  private val onSourceChange = EventListener<SourceChangeEvent> { handleSourceChange() }
  var currentSourceMetadata: SourceMetadata? = null

  init {
    player.addEventListener(PlayerEventTypes.SOURCECHANGE, onSourceChange)
    defaultMetadata?.let {
      collector.defaultMetadata = it
    }
  }

  var customData: CustomData
    get() = collector.customData
    set(value) {
      collector.customData = value
    }

  fun programChange(sourceMetadata: SourceMetadata) {
    collector.programChange(sourceMetadata)
  }

  fun sendCustomDataEvent(customData: CustomData) {
    collector.sendCustomDataEvent(customData)
  }

  private fun handleSourceChange() {
    Log.d("BitmovinConnector", "Handling source change event")
    // Detach player before setting new SourceMetadata.
    collector.detachPlayer()
    /**
     * Merge the current source metadata with the new metadata from the player source, if available.
     * Prioritize the player source's metadata.
     */
    mergeSourceMetadata(currentSourceMetadata, player.source?.metadata)?.let {
      collector.sourceMetadata = it
    }
    currentSourceMetadata = null
    collector.attachPlayer(player)
  }

  private fun mergeSourceMetadata(
    sourceMetadata: SourceMetadata?, metadata: MetadataDescription?
  ): SourceMetadata? {
    if (metadata == null) return sourceMetadata
    return SourceMetadata.Builder().apply {
      setTitle(metadata.get<String>("title") ?: sourceMetadata?.title)
      setVideoId(metadata.get<String>("videoId") ?: sourceMetadata?.videoId)
      setPath(metadata.get<String>("path") ?: sourceMetadata?.path)
      setCdnProvider(metadata.get<String>("cdnProvider") ?: sourceMetadata?.cdnProvider)
      setIsLive(metadata.get<Boolean>("isLive") ?: sourceMetadata?.isLive)
      val customData = (metadata.get<Any>("customData") as? JSONObject?)?.let {
        parseCustomDataFromJSON(
          json = it,
          buildUpon = sourceMetadata?.customData?.buildUpon())
      } ?: sourceMetadata?.customData
      customData?.let { setCustomData(it) }
    }.build()
  }

  fun destroy() {
    collector.detachPlayer()
    player.removeEventListener(PlayerEventTypes.SOURCECHANGE, onSourceChange)
  }
}
