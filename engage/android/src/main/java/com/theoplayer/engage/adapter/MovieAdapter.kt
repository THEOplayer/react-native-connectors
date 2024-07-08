package com.theoplayer.engage.adapter

import com.google.android.engage.video.datamodel.MovieEntity
import com.theoplayer.engage.adapter.ParseUtils.getArray
import com.theoplayer.engage.adapter.ParseUtils.getInt
import com.theoplayer.engage.adapter.ParseUtils.getLong
import com.theoplayer.engage.adapter.ParseUtils.getString
import com.theoplayer.engage.adapter.Constants.PROP_AVAILABILITY
import com.theoplayer.engage.adapter.Constants.PROP_AVAILABILITY_WINDOWS
import com.theoplayer.engage.adapter.Constants.PROP_CONTENT_RATINGS
import com.theoplayer.engage.adapter.Constants.PROP_DOWNLOADED_ON_DEVICE
import com.theoplayer.engage.adapter.Constants.PROP_DURATION
import com.theoplayer.engage.adapter.Constants.PROP_GENRES
import com.theoplayer.engage.adapter.Constants.PROP_ID
import com.theoplayer.engage.adapter.Constants.PROP_INFOPAGE_URI
import com.theoplayer.engage.adapter.Constants.PROP_LAST_ENGAGEMENT_TIME
import com.theoplayer.engage.adapter.Constants.PROP_LAST_PLAYBACK_POS
import com.theoplayer.engage.adapter.Constants.PROP_NAME
import com.theoplayer.engage.adapter.Constants.PROP_PLATFORM_PLAYBACK_URI
import com.theoplayer.engage.adapter.Constants.PROP_PLAYBACK_URI
import com.theoplayer.engage.adapter.Constants.PROP_POSTERS
import com.theoplayer.engage.adapter.Constants.PROP_PRICE
import com.theoplayer.engage.adapter.Constants.PROP_RELEASE_DATE
import com.theoplayer.engage.adapter.Constants.PROP_WATCHNEXT_TYPE
import com.theoplayer.engage.adapter.EntityAdapter.convertImages
import com.theoplayer.engage.adapter.ParseUtils.getBool
import com.theoplayer.engage.adapter.ParseUtils.getObject
import com.theoplayer.engage.adapter.ParseUtils.getUri
import org.json.JSONObject

object MovieAdapter {
  /**
   * Create a MovieEntity from bridge data.
   */
  fun convert(movie: JSONObject): MovieEntity {
    val builder = MovieEntity.Builder()
    getString(movie, PROP_NAME)?.let {
      builder.setName(it)
    }
    getString(movie, PROP_ID)?.let {
      builder.setEntityId(it)
    }
    getArray(movie, PROP_POSTERS)?.let { posterList ->
      builder.addPosterImages(convertImages(posterList))
    }
    getUri(movie, PROP_PLAYBACK_URI)?.let {
      builder.setPlayBackUri(it)
    }
    getArray(movie, PROP_PLATFORM_PLAYBACK_URI)?.let {
      builder.addPlatformSpecificPlaybackUris(EntityAdapter.convertPlatformSpecificUris(it))
    }
    getUri(movie, PROP_INFOPAGE_URI)?.let {
      builder.setInfoPageUri(it)
    }
    getLong(movie, PROP_RELEASE_DATE)?.let {
      builder.setReleaseDateEpochMillis(it)
    }
    getInt(movie, PROP_AVAILABILITY)?.let {
      builder.setAvailability(it)
    }
    getObject(movie, PROP_PRICE)?.let {
      builder.setPrice(EntityAdapter.convertPrice(it))
    }
    getLong(movie, PROP_DURATION)?.let {
      builder.setDurationMillis(it)
    }
    getArray(movie, PROP_GENRES)?.let {
      for (i in 0 until it.length()) {
        builder.addGenre(it.getString(i))
      }
    }
    getLong(movie, PROP_LAST_ENGAGEMENT_TIME)?.let {
      builder.setLastEngagementTimeMillis(it)
    }
    getLong(movie, PROP_LAST_PLAYBACK_POS)?.let {
      builder.setLastPlayBackPositionTimeMillis(it)
    }
    getBool(movie, PROP_DOWNLOADED_ON_DEVICE)?.let {
      builder.setDownloadedOnDevice(it)
    }
    getArray(movie, PROP_AVAILABILITY_WINDOWS)?.let {
      builder.addAllAvailabilityTimeWindows(EntityAdapter.convertDisplayTimeWindows(it))
    }
    getArray(movie, PROP_CONTENT_RATINGS)?.let {
      builder.addContentRatings(EntityAdapter.convertRatingSystems(it))
    }
    getInt(movie, PROP_WATCHNEXT_TYPE)?.let {
      builder.setWatchNextType(it)
    }
    return builder.build()
  }
}

