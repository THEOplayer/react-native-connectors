package com.theoplayer.engage.data

import android.net.Uri
import com.google.android.engage.video.datamodel.TvShowEntity
import com.theoplayer.engage.data.ParseUtils.getArray
import com.theoplayer.engage.data.ParseUtils.getInt
import com.theoplayer.engage.data.ParseUtils.getLong
import com.theoplayer.engage.data.ParseUtils.getString
import com.theoplayer.engage.data.Constants.PROP_AVAILABILITY
import com.theoplayer.engage.data.Constants.PROP_AVAILABILITY_WINDOWS
import com.theoplayer.engage.data.Constants.PROP_CONTENT_RATINGS
import com.theoplayer.engage.data.Constants.PROP_FIRST_EPISODE_AIR_DATE
import com.theoplayer.engage.data.Constants.PROP_GENRES
import com.theoplayer.engage.data.Constants.PROP_ID
import com.theoplayer.engage.data.Constants.PROP_INFOPAGE_URI
import com.theoplayer.engage.data.Constants.PROP_LAST_ENGAGEMENT_TIME
import com.theoplayer.engage.data.Constants.PROP_LAST_EPISODE_AIR_DATE
import com.theoplayer.engage.data.Constants.PROP_LAST_PLAYBACK_POS
import com.theoplayer.engage.data.Constants.PROP_NAME
import com.theoplayer.engage.data.Constants.PROP_PLAYBACK_URI
import com.theoplayer.engage.data.Constants.PROP_POSTERS
import com.theoplayer.engage.data.Constants.PROP_PRICE
import com.theoplayer.engage.data.Constants.PROP_SEASON_COUNT
import com.theoplayer.engage.data.Constants.PROP_WATCHNEXT_TYPE
import com.theoplayer.engage.data.EntityAdapter.convertImages
import com.theoplayer.engage.data.ParseUtils.getObject
import org.json.JSONObject

object TvShowAdapter {
  /**
   * Create a TvShowEntity from bridge data.
   */
  fun convert(show: JSONObject): TvShowEntity {
    val builder = TvShowEntity.Builder()
    getString(show, PROP_NAME)?.let {
      builder.setName(it)
    }
    getString(show, PROP_ID)?.let {
      builder.setEntityId(it)
    }
    getArray(show, PROP_POSTERS)?.let { posterList ->
      builder.addPosterImages(convertImages(posterList))
    }
    getString(show, PROP_PLAYBACK_URI)?.let {
      builder.setPlayBackUri(Uri.parse(it))
    }
    getString(show, PROP_INFOPAGE_URI)?.let {
      builder.setInfoPageUri(Uri.parse(it))
    }
    getLong(show, PROP_FIRST_EPISODE_AIR_DATE)?.let {
      builder.setFirstEpisodeAirDateEpochMillis(it)
    }
    getLong(show, PROP_LAST_EPISODE_AIR_DATE)?.let {
      builder.setLatestEpisodeAirDateEpochMillis(it)
    }
    getInt(show, PROP_AVAILABILITY)?.let {
      builder.setAvailability(it)
    }
    getObject(show, PROP_PRICE)?.let {
      builder.setPrice(EntityAdapter.convertPrice(it))
    }
    getInt(show, PROP_SEASON_COUNT)?.let {
      builder.setSeasonCount(it)
    }
    getArray(show, PROP_GENRES)?.let {
      for (i in 0 until it.length()) {
        builder.addGenre(it.getString(i))
      }
    }
    getArray(show, PROP_CONTENT_RATINGS)?.let {
      builder.addContentRatings(EntityAdapter.convertRatingSystems(it))
    }
    getInt(show, PROP_WATCHNEXT_TYPE)?.let {
      builder.setWatchNextType(it)
    }
    getLong(show, PROP_LAST_ENGAGEMENT_TIME)?.let {
      builder.setLastEngagementTimeMillis(it)
    }
    getLong(show, PROP_LAST_PLAYBACK_POS)?.let {
      builder.setLastPlayBackPositionTimeMillis(it)
    }
    getArray(show, PROP_AVAILABILITY_WINDOWS)?.let {
      builder.addAllAvailabilityTimeWindows(EntityAdapter.convertDisplayTimeWindows(it))
    }
    return builder.build()
  }
}

