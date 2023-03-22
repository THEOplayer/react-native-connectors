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
          // TODO: create connector
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

  fun mapLabels(labels: ReadableMap): Map<String,String> {
    return mapOf("a" to "1", "b" to "2") //TODO
  }

  fun mapConfig(config: ReadableMap): ComscoreConfiguration {
    return ComscoreConfiguration(
      config.getString("publisherId"),
      config.getString("applicationName"),
      config.getString("userConsent"),
      false, // TODO: bring in line with other platforms
      false, // TODO: bring in line with other platforms
      config.getBoolean("debug")
    )
  }

  fun mapDate(date: ReadableMap): ComscoreDate {
    var day = date.getInt("day")
    var month = date.getInt("month")
    var year = date.getInt("year")
    return ComscoreDate(year,month,day)
  }

  fun mapTime(time: ReadableMap): ComscoreTime {
    var hours = time.getInt("hours")
    var minutes = time.getInt("minutes")
    return ComscoreTime(hours,minutes)
  }

  fun mapDimension(dimension: ReadableMap): ComscoreDimension {
    var width = dimension.getInt("width")
    var height = dimension.getInt("height")
    return ComscoreDimension(width,height)
  }

  fun mapMediaType(mediaType: String?): ComscoreMediaType? {
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

  fun mapFeedType(feedType: String?): ComscoreFeedType? {
    when(feedType) {
      "easthd" -> return ComscoreFeedType.EASTHD
      "westhd" -> return ComscoreFeedType.WESTHD
      "eastsd" -> return ComscoreFeedType.EASTSD
      "westsd" -> return ComscoreFeedType.WESTSD
    }
    return null
  }

  fun mapDeliveryMode(deliveryMode: String?): ComscoreDeliveryMode? {
    when(deliveryMode) {
      "linear" -> return ComscoreDeliveryMode.LINEAR
      "ondemand" -> return ComscoreDeliveryMode.ON_DEMAND
    }
    return null
  }

  fun mapDeliverySubscriptionType(deliverySubscriptionType: String?): ComscoreDeliverySubscriptionType? {
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

  fun mapDeliveryComposition(deliveryComposition: String?): ComscoreDeliveryComposition? {
    when(deliveryComposition) {
      "clean" -> return ComscoreDeliveryComposition.CLEAN
      "embed" -> return ComscoreDeliveryComposition.EMBED
    }
    return null
  }

  fun mapDeliveryAdvertisementCapability(deliveryAdvertisementCapability: String?): ComscoreDeliveryAdvertisementCapability? {
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

  fun mapMediaFormat(mediaFormat: String?): ComscoreMediaFormat? {
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

  fun mapDistributionModel(distributionModel: String?): ComscoreDistributionModel? {
    when(distributionModel) {
      "tvAndOnline" -> return ComscoreDistributionModel.TV_AND_ONLINE
      "exclusivelyOnline" -> return  ComscoreDistributionModel.EXCLUSIVELY_ONLINE
    }
    return null
  }

  fun mapMetadata(metadata: ReadableMap): ComscoreMetaData {
    var mediaType = mapMediaType(metadata.getString("mediaType"))
    var uniqueId = metadata.getString("uniqueId")
    var length = metadata.getInt("length")
    var c3 = metadata.getString("c3")
    var c4 = metadata.getString("c4")
    var c6 = metadata.getString("c6")
    var stationTitle = metadata.getString("stationTitle")
    var stationCode = metadata.getString("stationCode")
    var networkAffiliate = metadata.getString("networkAffiliate")
    var publisherName = metadata.getString("publisherName")
    var programTitle = metadata.getString("programTitle")
    var programId = metadata.getString("programId")
    var episodeTitle = metadata.getString("episodeTitle")
    var episodeId = metadata.getString("episodeId")
    var episodeSeasonNumber = metadata.getString("episodeSeasonNumber")
    var episodeNumber = metadata.getString("episodeNumber")
    var genreName = metadata.getString("genreName")
    var genreId = metadata.getString("genreId")
    var carryTvAdvertisementLoad = metadata.getBoolean("carryTvAdvertisementLoad")
    var classifyAsCompleteEpisode = metadata.getBoolean("classifyAsCompleteEpisode")
//    var dateOfProduction = mapDate(metadata.getMap("dateOfProduction"))
//    var timeOfProduction = mapTime(metadata.getMap("timeOfProduction"))
//    var dateOfTvAiring = mapDate(metadata.getMap("dateOfTvAiring"))
//    var timeOfTvAiring = mapTime(metadata.getMap("timeOfTvAiring"))
//    var dateOfDigitalAiring = mapDate(metadata.getMap("dateOfDigitalAiring"))
//    var timeOfDigitalAiring = mapTime(metadata.getMap("timeOfDigitalAiring"))
    var feedType = mapFeedType(metadata.getString("feedType"))
    var classifyAsAudioStream = metadata.getBoolean("classifyAsAudioStream")
    var deliveryMode = mapDeliveryMode(metadata.getString("deliveryMode"))
    var deliverySubscriptionType = mapDeliverySubscriptionType(metadata.getString("deliverySubscriptionType"))
    var deliveryComposition = mapDeliveryComposition(metadata.getString("deliveryComposition"))
    var deliveryAdvertisementCapability = mapDeliveryAdvertisementCapability(metadata.getString("deliveryAdvertisementCapability"))
    var mediaFormat = mapMediaFormat(metadata.getString("mediaFormat"))
    var distributionModel = mapDistributionModel(metadata.getString("distributionModel"))
    var playlistTitle = metadata.getString("playlistTitle")
    var totalSegments = metadata.getInt("totalSegments")
    var clipUrl = metadata.getString("clipUrl")
//    var videoDimension = mapDimension(metadata.getMap("videoDimension"))
    var customLabels = metadata.getMap("customLabels")
    
    return ComscoreMetaData(
      uniqueId,
      publisherName,
      programTitle,
      programId,
      episodeTitle,
      episodeId,
      episodeSeasonNumber,
      episodeNumber,
      genreName,
      carryTvAdvertisementLoad,
      dateOfDigitalAiring,
      dateOfTvAiring,
      stationTitle,
      c3,
      c4,
      c6,
      classifyAsCompleteEpisode,
      feedType,
      distributionModel,
      stationCode,
      mediaType,
      length
    )
  }
}
