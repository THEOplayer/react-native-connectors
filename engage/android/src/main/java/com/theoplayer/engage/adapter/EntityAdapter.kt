package com.theoplayer.engage.adapter

import android.util.Log
import com.google.android.engage.common.datamodel.AccountProfile
import com.google.android.engage.common.datamodel.DisplayTimeWindow
import com.google.android.engage.common.datamodel.Entity
import com.google.android.engage.common.datamodel.Image
import com.google.android.engage.common.datamodel.PlatformSpecificUri
import com.google.android.engage.common.datamodel.Price
import com.google.android.engage.video.datamodel.RatingSystem
import com.theoplayer.engage.adapter.Constants.PROP_ACCOUNT_ID
import com.theoplayer.engage.adapter.ParseUtils.getInt
import com.theoplayer.engage.adapter.ParseUtils.getLong
import com.theoplayer.engage.adapter.ParseUtils.getString
import com.theoplayer.engage.adapter.ParseUtils.parseImageTheme
import com.theoplayer.engage.adapter.Constants.PROP_AVAILABILITY_END
import com.theoplayer.engage.adapter.Constants.PROP_AVAILABILITY_START
import com.theoplayer.engage.adapter.Constants.PROP_CONTENT_RATING
import com.theoplayer.engage.adapter.Constants.PROP_CONTENT_RATING_AGENCY
import com.theoplayer.engage.adapter.Constants.PROP_CURRENT_PRICE
import com.theoplayer.engage.adapter.Constants.PROP_PLATFORM_TYPE
import com.theoplayer.engage.adapter.Constants.PROP_PLAYBACK_URI
import com.theoplayer.engage.adapter.Constants.PROP_POSTER_HEIGHT
import com.theoplayer.engage.adapter.Constants.PROP_POSTER_THEME
import com.theoplayer.engage.adapter.Constants.PROP_POSTER_URI
import com.theoplayer.engage.adapter.Constants.PROP_POSTER_WIDTH
import com.theoplayer.engage.adapter.Constants.PROP_PROFILE_ID
import com.theoplayer.engage.adapter.Constants.PROP_STRIKETHROUGH_PRICE
import com.theoplayer.engage.adapter.Constants.PROP_TYPE
import com.theoplayer.engage.adapter.ParseUtils.getUri
import org.json.JSONArray
import org.json.JSONObject

private const val TAG = "EntityAdapter"

private const val TYPE_LIVE_STREAM = "liveStream"
private const val TYPE_MOVIE = "movie"
private const val TYPE_EPISODE = "tvEpisode"
private const val TYPE_SEASON = "tvSeason"
private const val TYPE_SHOW = "tvShow"
private const val TYPE_CLIP = "videoClip"
private const val TYPE_SIGNIN = "signIn"
private const val TYPE_SUBSCRIPTION = "subscription"

object EntityAdapter {
  fun convertItems(items: JSONArray?): List<Entity> {
    return mutableListOf<Entity>().apply {
      for (i in 0 until (items?.length() ?: 0)) {
        try {
          this += convertItem(items?.getJSONObject(i))
        } catch (e: Exception) {
          Log.w(TAG, "Failed to parse entity: ${e.message}")
        }
      }
    }
  }

  fun convertItem(item: String): Entity {
    return convertItem(JSONObject(item))
  }

  fun convertItem(item: JSONObject?): Entity {
    return when (item?.getString(PROP_TYPE)) {
      TYPE_MOVIE -> MovieAdapter.convert(item)
      TYPE_EPISODE -> TvEpisodeAdapter.convert(item)
      TYPE_SEASON -> TvSeasonAdapter.convert(item)
      TYPE_SHOW -> TvShowAdapter.convert(item)
      TYPE_LIVE_STREAM -> LiveStreamAdapter.convert(item)
      TYPE_CLIP -> VideoClipAdapter.convert(item)
      TYPE_SIGNIN -> SignInAdapter.convert(item)
      TYPE_SUBSCRIPTION -> SubscriptionAdapter.convert(item)
      else -> throw Exception("Unknown entity type: ${item?.getString(PROP_TYPE)}")
    }
  }

  fun convertImages(images: JSONArray): List<Image> {
    return mutableListOf<Image>().apply {
      for (i in 0 until images.length()) {
        this += convertImage(images.getJSONObject(i))
      }
    }
  }

  private fun convertImage(image: JSONObject): Image {
    return Image.Builder().apply {
      getString(image, PROP_POSTER_THEME)?.let {
        setImageTheme(parseImageTheme(it))
      }
      getUri(image, PROP_POSTER_URI)?.let { uri ->
        setImageUri(uri)
      }
      getInt(image, PROP_POSTER_WIDTH)?.let { width ->
        setImageWidthInPixel(width)
      }
      getInt(image, PROP_POSTER_HEIGHT)?.let { height ->
        setImageHeightInPixel(height)
      }
    }.build()
  }

  fun convertPrice(item: JSONObject): Price {
    return Price.Builder().apply {
      getString(item, PROP_CURRENT_PRICE)?.let {
        setCurrentPrice(it)
      }
      getString(item, PROP_STRIKETHROUGH_PRICE)?.let {
        setStrikethroughPrice(it)
      }
    }.build()
  }

  private fun convertRatingSystem(rating: JSONObject): RatingSystem {
    return RatingSystem.Builder().apply {
      getString(rating, PROP_CONTENT_RATING)?.let { r ->
        setRating(r)
      }
      getString(rating, PROP_CONTENT_RATING_AGENCY)?.let { agency ->
        setAgencyName(agency)
      }
    }.build()
  }

  fun convertRatingSystems(ratings: JSONArray): List<RatingSystem> {
    return mutableListOf<RatingSystem>().apply {
      for (i in 0 until ratings.length()) {
        this += convertRatingSystem(ratings.getJSONObject(i))
      }
    }
  }

  private fun convertDisplayTimeWindow(window: JSONObject) : DisplayTimeWindow {
    return DisplayTimeWindow.Builder().apply {
      getLong(window, PROP_AVAILABILITY_START)?.let { start ->
       setStartTimestampMillis(start)
      }
      getLong(window, PROP_AVAILABILITY_END)?.let { end ->
        setEndTimestampMillis(end)
      }
    }.build()
  }

  fun convertDisplayTimeWindows(windows: JSONArray): List<DisplayTimeWindow> {
    return mutableListOf<DisplayTimeWindow>().apply {
      for (i in 0 until windows.length()) {
        this += convertDisplayTimeWindow(windows.getJSONObject(i))
      }
    }
  }

  private fun convertPlatformSpecificUri(platformUri: JSONObject): PlatformSpecificUri {
    return PlatformSpecificUri.Builder().apply {
      getUri(platformUri, PROP_PLAYBACK_URI)?.let { uri ->
        setActionUri(uri)
      }
      getInt(platformUri, PROP_PLATFORM_TYPE)?.let { platform ->
        setPlatformType(platform)
      }
    }.build()
  }

  fun convertPlatformSpecificUris(platformUris: JSONArray): List<PlatformSpecificUri> {
    return mutableListOf<PlatformSpecificUri>().apply {
      for (i in 0 until platformUris.length()) {
        this += convertPlatformSpecificUri(platformUris.getJSONObject(i))
      }
    }
  }

  fun convertAccountProfile(profile: JSONObject): AccountProfile {
    return AccountProfile.Builder().apply {
      getString(profile, PROP_ACCOUNT_ID)?.let { id ->
        setAccountId(id)
      }
      getString(profile, PROP_PROFILE_ID)?.let { id ->
        setProfileId(id)
      }
    }.build()
  }
}
