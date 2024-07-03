package com.theoplayer.engage.data

import android.net.Uri
import com.google.android.engage.video.datamodel.TvEpisodeEntity
import com.theoplayer.engage.data.Constants.PROP_AIR_DATE
import com.theoplayer.engage.data.ParseUtils.getArray
import com.theoplayer.engage.data.ParseUtils.getInt
import com.theoplayer.engage.data.ParseUtils.getLong
import com.theoplayer.engage.data.ParseUtils.getString
import com.theoplayer.engage.data.Constants.PROP_AVAILABILITY
import com.theoplayer.engage.data.Constants.PROP_AVAILABILITY_WINDOWS
import com.theoplayer.engage.data.Constants.PROP_CONTENT_RATINGS
import com.theoplayer.engage.data.Constants.PROP_DOWNLOADED_ON_DEVICE
import com.theoplayer.engage.data.Constants.PROP_DURATION
import com.theoplayer.engage.data.Constants.PROP_EPISODE_DISPLAY_NUMBER
import com.theoplayer.engage.data.Constants.PROP_EPISODE_NUMBER
import com.theoplayer.engage.data.Constants.PROP_GENRES
import com.theoplayer.engage.data.Constants.PROP_ID
import com.theoplayer.engage.data.Constants.PROP_INFOPAGE_URI
import com.theoplayer.engage.data.Constants.PROP_LAST_ENGAGEMENT_TIME
import com.theoplayer.engage.data.Constants.PROP_LAST_PLAYBACK_POS
import com.theoplayer.engage.data.Constants.PROP_NAME
import com.theoplayer.engage.data.Constants.PROP_NEXT_EPISODE_AVAILABLE
import com.theoplayer.engage.data.Constants.PROP_PLATFORM_PLAYBACK_URI
import com.theoplayer.engage.data.Constants.PROP_PLAYBACK_URI
import com.theoplayer.engage.data.Constants.PROP_POSTERS
import com.theoplayer.engage.data.Constants.PROP_PRICE
import com.theoplayer.engage.data.Constants.PROP_SEASON_NUMBER
import com.theoplayer.engage.data.Constants.PROP_SEASON_TITLE
import com.theoplayer.engage.data.Constants.PROP_SHOW_TITLE
import com.theoplayer.engage.data.Constants.PROP_WATCHNEXT_TYPE
import com.theoplayer.engage.data.EntityAdapter.convertImages
import com.theoplayer.engage.data.ParseUtils.getBool
import com.theoplayer.engage.data.ParseUtils.getObject
import org.json.JSONObject

object TvEpisodeAdapter {
  /**
   * Create a TvEpisodeAdapter from bridge data.
   */
  fun convert(episode: JSONObject): TvEpisodeEntity {
    val builder = TvEpisodeEntity.Builder()
    getString(episode, PROP_NAME)?.let {
      builder.setName(it)
    }
    getString(episode, PROP_ID)?.let {
      builder.setEntityId(it)
    }
    getArray(episode, PROP_POSTERS)?.let { posterList ->
      builder.addPosterImages(convertImages(posterList))
    }
    getString(episode, PROP_PLAYBACK_URI)?.let {
      builder.setPlayBackUri(Uri.parse(it))
    }
    getArray(episode, PROP_PLATFORM_PLAYBACK_URI)?.let {
      builder.addPlatformSpecificPlaybackUris(EntityAdapter.convertPlatformSpecificUris(it))
    }
    getString(episode, PROP_INFOPAGE_URI)?.let {
      builder.setInfoPageUri(Uri.parse(it))
    }
    getString(episode, PROP_SHOW_TITLE)?.let {
      builder.setShowTitle(it)
    }
    getString(episode, PROP_SEASON_TITLE)?.let {
      builder.setSeasonTitle(it)
    }
    getString(episode, PROP_SEASON_NUMBER)?.let {
      builder.setSeasonNumber(it)
    }
    getInt(episode, PROP_EPISODE_NUMBER)?.let {
      builder.setEpisodeNumber(it)
    }
    getString(episode, PROP_EPISODE_DISPLAY_NUMBER)?.let {
      builder.setEpisodeDisplayNumber(it)
    }
    getLong(episode, PROP_AIR_DATE)?.let {
      builder.setAirDateEpochMillis(it)
    }
    getInt(episode, PROP_AVAILABILITY)?.let {
      builder.setAvailability(it)
    }
    getObject(episode, PROP_PRICE)?.let {
      builder.setPrice(EntityAdapter.convertPrice(it))
    }
    getLong(episode, PROP_DURATION)?.let {
      builder.setDurationMillis(it)
    }
    getArray(episode, PROP_GENRES)?.let {
      for (i in 0 until it.length()) {
        builder.addGenre(it.getString(i))
      }
    }
    getArray(episode, PROP_CONTENT_RATINGS)?.let {
      builder.addContentRatings(EntityAdapter.convertRatingSystems(it))
    }
    getInt(episode, PROP_WATCHNEXT_TYPE)?.let {
      builder.setWatchNextType(it)
    }
    getBool(episode, PROP_DOWNLOADED_ON_DEVICE)?.let {
      builder.setDownloadedOnDevice(it)
    }
    getBool(episode, PROP_NEXT_EPISODE_AVAILABLE)?.let {
      builder.setIsNextEpisodeAvailable(it)
    }
    getLong(episode, PROP_LAST_ENGAGEMENT_TIME)?.let {
      builder.setLastEngagementTimeMillis(it)
    }
    getLong(episode, PROP_LAST_PLAYBACK_POS)?.let {
      builder.setLastPlayBackPositionTimeMillis(it)
    }
    getArray(episode, PROP_AVAILABILITY_WINDOWS)?.let {
      builder.addAllAvailabilityTimeWindows(EntityAdapter.convertDisplayTimeWindows(it))
    }
    return builder.build()
  }
}

