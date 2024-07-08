package com.theoplayer.engage.adapter

import com.google.android.engage.video.datamodel.VideoClipEntity
import com.theoplayer.engage.adapter.ParseUtils.getArray
import com.theoplayer.engage.adapter.ParseUtils.getInt
import com.theoplayer.engage.adapter.ParseUtils.getLong
import com.theoplayer.engage.adapter.ParseUtils.getString
import com.theoplayer.engage.adapter.Constants.PROP_AVAILABILITY_WINDOWS
import com.theoplayer.engage.adapter.Constants.PROP_CREATED_TIME
import com.theoplayer.engage.adapter.Constants.PROP_CREATOR
import com.theoplayer.engage.adapter.Constants.PROP_DOWNLOADED_ON_DEVICE
import com.theoplayer.engage.adapter.Constants.PROP_DURATION
import com.theoplayer.engage.adapter.Constants.PROP_ID
import com.theoplayer.engage.adapter.Constants.PROP_LAST_ENGAGEMENT_TIME
import com.theoplayer.engage.adapter.Constants.PROP_LAST_PLAYBACK_POS
import com.theoplayer.engage.adapter.Constants.PROP_NAME
import com.theoplayer.engage.adapter.Constants.PROP_PLATFORM_PLAYBACK_URI
import com.theoplayer.engage.adapter.Constants.PROP_PLAYBACK_URI
import com.theoplayer.engage.adapter.Constants.PROP_POSTERS
import com.theoplayer.engage.adapter.Constants.PROP_VIEW_COUNT
import com.theoplayer.engage.adapter.Constants.PROP_WATCHNEXT_TYPE
import com.theoplayer.engage.adapter.EntityAdapter.convertImages
import com.theoplayer.engage.adapter.ParseUtils.getBool
import com.theoplayer.engage.adapter.ParseUtils.getUri
import org.json.JSONObject

object VideoClipAdapter {
  /**
   * Create a VideoClipEntity from bridge data.
   */
  fun convert(clip: JSONObject): VideoClipEntity {
    val builder = VideoClipEntity.Builder()
    getString(clip, PROP_NAME)?.let {
      builder.setName(it)
    }
    getString(clip, PROP_ID)?.let {
      builder.setEntityId(it)
    }
    getArray(clip, PROP_POSTERS)?.let { posterList ->
      builder.addPosterImages(convertImages(posterList))
    }
    getUri(clip, PROP_PLAYBACK_URI)?.let {
      builder.setPlayBackUri(it)
    }
    getArray(clip, PROP_PLATFORM_PLAYBACK_URI)?.let {
      builder.addPlatformSpecificPlaybackUris(EntityAdapter.convertPlatformSpecificUris(it))
    }
    getLong(clip, PROP_DURATION)?.let {
      builder.setDurationMillis(it)
    }
    getString(clip, PROP_VIEW_COUNT)?.let {
      builder.setViewCount(it)
    }
    getInt(clip, PROP_WATCHNEXT_TYPE)?.let {
      builder.setWatchNextType(it)
    }
    getLong(clip, PROP_LAST_ENGAGEMENT_TIME)?.let {
      builder.setLastEngagementTimeMillis(it)
    }
    getLong(clip, PROP_LAST_PLAYBACK_POS)?.let {
      builder.setLastPlayBackPositionTimeMillis(it)
    }
    getBool(clip, PROP_DOWNLOADED_ON_DEVICE)?.let {
      builder.setDownloadedOnDevice(it)
    }
    getLong(clip, PROP_CREATED_TIME)?.let {
      builder.setCreatedTimeEpochMillis(it)
    }
    getString(clip, PROP_CREATOR)?.let {
      builder.setCreator(it)
    }
// TODO
//    getString(clip, PROP_CREATOR_IMAGE)?.let {
//      builder.setCreatorImage(it)
//    }
    getArray(clip, PROP_AVAILABILITY_WINDOWS)?.let {
      builder.addAllAvailabilityTimeWindows(EntityAdapter.convertDisplayTimeWindows(it))
    }
    return builder.build()
  }
}
