package com.theoplayercomscore

import android.util.Log
import com.facebook.react.bridge.*
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.util.ViewResolver
import com.theoplayercomscore.integration.*

private const val TAG = "ComscoreModule"
private const val PUBLISHER_ID = "publisherId"

class ReactTHEOplayerComscoreModule(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver

  private var comscoreConnectors: HashMap<Int, ComscoreConnector> = HashMap()

  init {
    viewResolver = ViewResolver(context)
  }

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun initialize(tag: Int, comscoreMetadata: ReadableMap, comscoreConfig: ReadableMap) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.player?. let { player ->
        val customerKey = comscoreConfig.getString(PUBLISHER_ID) ?: ""
        if (customerKey.isEmpty()) {
          Log.e(TAG, "Invalid $PUBLISHER_ID")
        } else {
          comscoreConnectors[tag] = ComscoreConnector(view.context, player, mapConfig(comscoreConfig), mapMetadata(comscoreMetadata) )
        }
      }
    }
  }

  @ReactMethod
  fun update(tag: Int, comscoreMetadata: ReadableMap) {
    comscoreConnectors[tag]?.update(mapMetadata(comscoreMetadata))
  }

  @ReactMethod
  fun setPersistentLabels(tag: Int, labels: ReadableMap) {
    comscoreConnectors[tag]?.setPersistentLabels(mapLabels(labels))
  }

  @ReactMethod
  fun setPersistentLabel(tag: Int, label: String, value: String) {
    comscoreConnectors[tag]?.setPersistentLabel(label,value)
  }

  @ReactMethod
  fun destroy(tag: Int) {
    comscoreConnectors[tag]?.destroy()
    comscoreConnectors.remove(tag)
  }

  private fun mapLabels(labels: ReadableMap): Map<String,String> {
    return labels.toHashMap().mapValues { it.toString() }
  }

  private fun mapConfig(config: ReadableMap): ComscoreConfiguration {
    return ComscoreConfiguration(
      config.getString("publisherId"),
      config.getString("applicationName"),
      config.getString("userConsent"),
      false, // TODO: bring in line with other platforms
      false, // TODO: bring in line with other platforms
      config.getBoolean("debug")
    )
  }

  private fun mapDate(date: ReadableMap?): ComscoreDate? {
    val day = date?.getInt("day")
    val month = date?.getInt("month")
    val year = date?.getInt("year")
    return if (day != null && month != null && year != null) {
      ComscoreDate(year,month,day)
    } else {
      null
    }
  }

  private fun mapTime(time: ReadableMap?): ComscoreTime? {
    val hours = time?.getInt("hours")
    val minutes = time?.getInt("minutes")
    return if (hours != null && minutes != null) {
      ComscoreTime(hours,minutes)
    } else {
      null
    }
  }

  private fun mapDimension(dimension: ReadableMap?): ComscoreDimension? {
    val width = dimension?.getInt("width")
    val height = dimension?.getInt("height")
    return if (width != null && height != null) {
      ComscoreDimension(width,height)
    } else {
      null
    }
  }

  private fun mapMediaType(mediaType: String?): ComscoreMediaType? {
    when(mediaType) {
      "longFormOnDemand" -> return ComscoreMediaType.LONG_FORM_ON_DEMAND
      "shortFormOnDemand" -> return ComscoreMediaType.SHORT_FORM_ON_DEMAND
      "live" -> return ComscoreMediaType.LIVE
      "userGeneratedLongFormOnDemand" -> return ComscoreMediaType.USER_GENERATED_LONG_FORM_ON_DEMAND
      "userGeneratedShortFormOnDemand" -> return ComscoreMediaType.USER_GENERATED_SHORT_FORM_ON_DEMAND
      "userGeneratedLive" -> return ComscoreMediaType.USER_GENERATED_LIVE
      "bumper" -> return ComscoreMediaType.BUMPER
      "other" -> return ComscoreMediaType.OTHER
    }
    return null
  }

  private fun mapFeedType(feedType: String?): ComscoreFeedType? {
    when(feedType) {
      "easthd" -> return ComscoreFeedType.EASTHD
      "westhd" -> return ComscoreFeedType.WESTHD
      "eastsd" -> return ComscoreFeedType.EASTSD
      "westsd" -> return ComscoreFeedType.WESTSD
    }
    return null
  }

  private fun mapDeliveryMode(deliveryMode: String?): ComscoreDeliveryMode? {
    when(deliveryMode) {
      "linear" -> return ComscoreDeliveryMode.LINEAR
      "ondemand" -> return ComscoreDeliveryMode.ON_DEMAND
    }
    return null
  }

  private fun mapDeliverySubscriptionType(deliverySubscriptionType: String?): ComscoreDeliverySubscriptionType? {
    when(deliverySubscriptionType) {
      "traditionalMvpd" -> return ComscoreDeliverySubscriptionType.TRADITIONAL_MVPD
      "virtualMvpd" -> return ComscoreDeliverySubscriptionType.VIRTUAL_MVPD
      "subscription" -> return ComscoreDeliverySubscriptionType.SUBSCRIPTION
      "transactional" -> return ComscoreDeliverySubscriptionType.TRANSACTIONAL
      "advertising" -> return ComscoreDeliverySubscriptionType.ADVERTISING
      "premium" -> return ComscoreDeliverySubscriptionType.PREMIUM
    }
    return null
  }

  private fun mapDeliveryComposition(deliveryComposition: String?): ComscoreDeliveryComposition? {
    when(deliveryComposition) {
      "clean" -> return ComscoreDeliveryComposition.CLEAN
      "embed" -> return ComscoreDeliveryComposition.EMBED
    }
    return null
  }

  private fun mapDeliveryAdvertisementCapability(deliveryAdvertisementCapability: String?): ComscoreDeliveryAdvertisementCapability? {
    when(deliveryAdvertisementCapability) {
      "none" -> return ComscoreDeliveryAdvertisementCapability.NONE
      "dynamicLoad" -> return ComscoreDeliveryAdvertisementCapability.DYNAMIC_LOAD
      "dynamicReplacement" -> return ComscoreDeliveryAdvertisementCapability.DYNAMIC_REPLACEMENT
      "linear1day" -> return ComscoreDeliveryAdvertisementCapability.LINEAR_1DAY
      "linear2day" -> return ComscoreDeliveryAdvertisementCapability.LINEAR_2DAY
      "linear3day" -> return ComscoreDeliveryAdvertisementCapability.LINEAR_3DAY
      "linear4day" -> return ComscoreDeliveryAdvertisementCapability.LINEAR_4DAY
      "linear5day" -> return ComscoreDeliveryAdvertisementCapability.LINEAR_5DAY
      "linear6day" -> return ComscoreDeliveryAdvertisementCapability.LINEAR_6DAY
      "linear7day" -> return ComscoreDeliveryAdvertisementCapability.LINEAR_7DAY
    }
    return null
  }

  private fun mapMediaFormat(mediaFormat: String?): ComscoreMediaFormat? {
    when(mediaFormat) {
      "fullContentEpisode" -> return ComscoreMediaFormat.FULL_CONTENT_EPISODE
      "fullContentMovie" -> return ComscoreMediaFormat.FULL_CONTENT_MOVIE
      "fullContentPodcast" -> return ComscoreMediaFormat.FULL_CONTENT_PODCAST
      "fullContentGeneric" -> return ComscoreMediaFormat.FULL_CONTENT_GENERIC
      "partialContentEpisode" -> return ComscoreMediaFormat.PARTIAL_CONTENT_EPISODE
      "partialContentMovie" -> return ComscoreMediaFormat.PARTIAL_CONTENT_MOVIE
      "partialContentPodcast" -> return ComscoreMediaFormat.PARTIAL_CONTENT_PODCAST
      "partialContentGeneric" -> return ComscoreMediaFormat.PARTIAL_CONTENT_GENERIC
      "previewEpisode" -> return ComscoreMediaFormat.PREVIEW_EPISODE
      "previewMovie" -> return ComscoreMediaFormat.PREVIEW_MOVIE
      "previewGeneric" -> return ComscoreMediaFormat.PREVIEW_GENERIC
      "extraEpisode" -> return ComscoreMediaFormat.EXTRA_EPISODE
      "extraMovie" -> return ComscoreMediaFormat.EXTRA_MOVIE
      "extraGeneric" -> return ComscoreMediaFormat.EXTRA_GENERIC
    }
    return null
  }

  private fun mapDistributionModel(distributionModel: String?): ComscoreDistributionModel? {
    when(distributionModel) {
      "tvAndOnline" -> return ComscoreDistributionModel.TV_AND_ONLINE
      "exclusivelyOnline" -> return  ComscoreDistributionModel.EXCLUSIVELY_ONLINE
    }
    return null
  }

  private fun mapMetadata(metadata: ReadableMap): ComscoreMetaData {
    val mediaType = mapMediaType(metadata.getString("mediaType"))
    val uniqueId = metadata.getString("uniqueId")
    val length = metadata.getInt("length").toLong()
    val c3 = metadata.getString("c3")
    val c4 = metadata.getString("c4")
    val c6 = metadata.getString("c6")
    val stationTitle = metadata.getString("stationTitle")
    val stationCode = metadata.getString("stationCode")
    val networkAffiliate = metadata.getString("networkAffiliate")
    val publisherName = metadata.getString("publisherName")
    val programTitle = metadata.getString("programTitle")
    val programId = metadata.getString("programId")
    val episodeTitle = metadata.getString("episodeTitle")
    val episodeId = metadata.getString("episodeId")
    val episodeSeasonNumber = metadata.getString("episodeSeasonNumber")
    val episodeNumber = metadata.getString("episodeNumber")
    val genreName = metadata.getString("genreName")
    val genreId = metadata.getString("genreId")
    val carryTvAdvertisementLoad = metadata.getBoolean("carryTvAdvertisementLoad")
    val classifyAsCompleteEpisode = metadata.getBoolean("classifyAsCompleteEpisode")
    val dateOfProduction = mapDate(metadata.getMap("dateOfProduction"))
    val timeOfProduction = mapTime(metadata.getMap("timeOfProduction"))
    val dateOfTvAiring = mapDate(metadata.getMap("dateOfTvAiring"))
    val timeOfTvAiring = mapTime(metadata.getMap("timeOfTvAiring"))
    val dateOfDigitalAiring = mapDate(metadata.getMap("dateOfDigitalAiring"))
    val timeOfDigitalAiring = mapTime(metadata.getMap("timeOfDigitalAiring"))
    val feedType = mapFeedType(metadata.getString("feedType"))
    val classifyAsAudioStream = metadata.getBoolean("classifyAsAudioStream")
    val deliveryMode = mapDeliveryMode(metadata.getString("deliveryMode"))
    val deliverySubscriptionType = mapDeliverySubscriptionType(metadata.getString("deliverySubscriptionType"))
    val deliveryComposition = mapDeliveryComposition(metadata.getString("deliveryComposition"))
    val deliveryAdvertisementCapability = mapDeliveryAdvertisementCapability(metadata.getString("deliveryAdvertisementCapability"))
    val mediaFormat = mapMediaFormat(metadata.getString("mediaFormat"))
    val distributionModel = mapDistributionModel(metadata.getString("distributionModel"))
    val playlistTitle = metadata.getString("playlistTitle")
    val totalSegments = metadata.getInt("totalSegments")
    val clipUrl = metadata.getString("clipUrl")
    val videoDimension = mapDimension(metadata.getMap("videoDimension"))
    val customLabels = metadata.getMap("customLabels")
    return ComscoreMetaData(
      mediaType,
      uniqueId,
      length,
      c3,
      c4,
      c6,
      stationTitle,
      stationCode,
      networkAffiliate,
      publisherName,
      programTitle,
      programId,
      episodeTitle,
      episodeId,
      episodeSeasonNumber,
      episodeNumber,
      genreName,
      genreId,
      carryTvAdvertisementLoad,
      classifyAsCompleteEpisode,
      dateOfProduction,
      timeOfProduction,
      dateOfTvAiring,
      timeOfTvAiring,
      dateOfDigitalAiring,
      timeOfDigitalAiring,
      feedType,
      classifyAsAudioStream,
      deliveryMode,
      deliverySubscriptionType,
      deliveryComposition,
      deliveryAdvertisementCapability,
      mediaFormat,
      distributionModel,
      playlistTitle,
      totalSegments,
      clipUrl,
      videoDimension,
      customLabels?.toHashMap()?.mapValues { it.value.toString() }
    )
  }
}
