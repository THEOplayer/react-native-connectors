package com.theoplayer.engage.adapter

import com.google.android.engage.video.datamodel.LiveStreamingVideoEntity
import com.theoplayer.engage.adapter.ParseUtils.getArray
import com.theoplayer.engage.adapter.ParseUtils.getInt
import com.theoplayer.engage.adapter.ParseUtils.getLong
import com.theoplayer.engage.adapter.ParseUtils.getString
import com.theoplayer.engage.adapter.Constants.PROP_AVAILABILITY_WINDOWS
import com.theoplayer.engage.adapter.Constants.PROP_BROADCASTER
import com.theoplayer.engage.adapter.Constants.PROP_END_TIME
import com.theoplayer.engage.adapter.Constants.PROP_ID
import com.theoplayer.engage.adapter.Constants.PROP_LAST_ENGAGEMENT_TIME
import com.theoplayer.engage.adapter.Constants.PROP_LAST_PLAYBACK_POS
import com.theoplayer.engage.adapter.Constants.PROP_NAME
import com.theoplayer.engage.adapter.Constants.PROP_PLATFORM_PLAYBACK_URI
import com.theoplayer.engage.adapter.Constants.PROP_PLAYBACK_URI
import com.theoplayer.engage.adapter.Constants.PROP_POSTERS
import com.theoplayer.engage.adapter.Constants.PROP_START_TIME
import com.theoplayer.engage.adapter.Constants.PROP_VIEW_COUNT
import com.theoplayer.engage.adapter.Constants.PROP_WATCHNEXT_TYPE
import com.theoplayer.engage.adapter.EntityAdapter.convertImages
import com.theoplayer.engage.adapter.ParseUtils.getUri
import org.json.JSONObject

object LiveStreamAdapter {
  /**
   * Create a LiveStreamingVideoEntity from bridge data.
   */
  fun convert(stream: JSONObject): LiveStreamingVideoEntity {
    val builder = LiveStreamingVideoEntity.Builder()
    getString(stream, PROP_NAME)?.let {
      builder.setName(it)
    }
    getString(stream, PROP_ID)?.let {
      builder.setEntityId(it)
    }
    getArray(stream, PROP_POSTERS)?.let { posterList ->
      builder.addPosterImages(convertImages(posterList))
    }
    getUri(stream, PROP_PLAYBACK_URI)?.let {
      builder.setPlayBackUri(it)
    }
    getArray(stream, PROP_PLATFORM_PLAYBACK_URI)?.let {
      builder.addPlatformSpecificPlaybackUris(EntityAdapter.convertPlatformSpecificUris(it))
    }
    getString(stream, PROP_BROADCASTER)?.let {
      builder.setBroadcaster(it)
    }
// TODO
//    getString(stream, PROP_BROADCASTER_ICON)?.let {
//      builder.setBroadcasterIcon(it)
//    }
    getLong(stream, PROP_START_TIME)?.let {
      builder.setStartTimeEpochMillis(it)
    }
    getLong(stream, PROP_END_TIME)?.let {
      builder.setEndTimeEpochMillis(it)
    }
    getString(stream, PROP_VIEW_COUNT)?.let {
      builder.setViewCount(it)
    }
    getInt(stream, PROP_WATCHNEXT_TYPE)?.let {
      builder.setWatchNextType(it)
    }
    getLong(stream, PROP_LAST_ENGAGEMENT_TIME)?.let {
      builder.setLastEngagementTimeMillis(it)
    }
    getLong(stream, PROP_LAST_PLAYBACK_POS)?.let {
      builder.setLastPlayBackPositionTimeMillis(it)
    }
    getArray(stream, PROP_AVAILABILITY_WINDOWS)?.let {
      builder.addAllAvailabilityTimeWindows(EntityAdapter.convertDisplayTimeWindows(it))
    }
    return builder.build()
  }
}

