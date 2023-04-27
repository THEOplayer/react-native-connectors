package com.theoplayercomscore.integration

import com.comscore.streaming.ContentMetadata

class ComscoreMetaData(
  private val mediaType: ComscoreMediaType,
  private val uniqueId: String?,
  val length: Long,
  private val c3: String?,
  private val c4: String?,
  private val c6: String?,
  private val stationTitle: String?,
  private val stationCode: String?,
  private val networkAffiliate: String?,
  private val publisherName: String?,
  private val programTitle: String?,
  private val programId: String?,
  private val episodeTitle: String?,
  private val episodeId: String?,
  private val episodeSeasonNumber: String?,
  private val episodeNumber: String?,
  private val genreName: String?,
  private val genreId: String?,
  private val carryTvAdvertisementLoad: Boolean?,
  private val classifyAsCompleteEpisode: Boolean?,
  private val dateOfProduction: ComscoreDate?,
  private val timeOfProduction: ComscoreTime?,
  private val dateOfTvAiring: ComscoreDate?,
  private val timeOfTvAiring: ComscoreTime?,
  private val dateOfDigitalAiring: ComscoreDate?,
  private val timeOfDigitalAiring: ComscoreTime?,
  private val feedType: ComscoreFeedType?,
  private val classifyAsAudioStream: Boolean,
  private val deliveryMode: ComscoreDeliveryMode?,
  private val deliverySubscriptionType: ComscoreDeliverySubscriptionType?,
  private val deliveryComposition: ComscoreDeliveryComposition?,
  private val deliveryAdvertisementCapability: ComscoreDeliveryAdvertisementCapability?,
  private val mediaFormat: ComscoreMediaFormat?,
  private val distributionModel: ComscoreDistributionModel?,
  private val playlistTitle: String?,
  private val totalSegments: Int?,
  private val clipUrl: String?,
  private val videoDimension: ComscoreDimension?,
  private val customLabels: Map<String, String>
) {

  fun toComscoreContentMetadata(): ContentMetadata {
    val cm = ContentMetadata.Builder()
    cm.mediaType(mediaType.toComscore())
    cm.uniqueId(uniqueId)
    cm.length(length)
    if (c3 != null) cm.dictionaryClassificationC3(c3)
    if (c4 != null) cm.dictionaryClassificationC4(c4)
    if (c6 != null) cm.dictionaryClassificationC6(c6)
    cm.stationTitle(stationTitle)
    if (stationCode != null) cm.stationCode(stationCode)
    if (networkAffiliate != null) cm.networkAffiliate(networkAffiliate)
    if (publisherName != null) cm.publisherName(publisherName)
    cm.programTitle(programTitle)
    if (programId != null) cm.programId(programId)
    cm.episodeTitle(episodeTitle)
    if (episodeId != null) cm.episodeId(episodeId)
    if (episodeSeasonNumber != null) cm.episodeSeasonNumber(episodeSeasonNumber)
    if (episodeNumber != null) cm.episodeNumber(episodeNumber)
    cm.genreName(genreName)
    if (genreId != null) cm.genreId(genreId)
    if (carryTvAdvertisementLoad != null) cm.carryTvAdvertisementLoad(carryTvAdvertisementLoad)
    if (classifyAsCompleteEpisode != null) cm.classifyAsCompleteEpisode(
      classifyAsCompleteEpisode
    )
    if (dateOfProduction != null) cm.dateOfProduction(
      dateOfProduction.year,
      dateOfProduction.month,
      dateOfProduction.day
    )
    if (timeOfProduction != null) cm.timeOfProduction(
      timeOfProduction.hours,
      timeOfProduction.minutes
    )
    if (dateOfTvAiring != null) cm.dateOfTvAiring(
      dateOfTvAiring.year,
      dateOfTvAiring.month,
      dateOfTvAiring.day
    )
    if (timeOfTvAiring != null) cm.timeOfTvAiring(timeOfTvAiring.hours, timeOfTvAiring.minutes)
    if (dateOfDigitalAiring != null) cm.dateOfDigitalAiring(
      dateOfDigitalAiring.year,
      dateOfDigitalAiring.month,
      dateOfDigitalAiring.day
    )
    if (timeOfDigitalAiring != null) cm.timeOfDigitalAiring(
      timeOfDigitalAiring.hours,
      timeOfDigitalAiring.minutes
    )
    if (feedType != null) cm.feedType(feedType.toComscore())
    cm.classifyAsAudioStream(classifyAsAudioStream)
    if (deliveryMode != null) cm.deliveryMode(deliveryMode.toComscore())
    if (deliverySubscriptionType != null) cm.deliverySubscriptionType(deliverySubscriptionType.toComscore())
    if (deliveryComposition != null) cm.deliveryComposition(deliveryComposition.toComscore())
    if (deliveryAdvertisementCapability != null) cm.deliveryAdvertisementCapability(
      deliveryAdvertisementCapability.toComscore()
    )
    if (mediaFormat != null) cm.mediaFormat(mediaFormat.toComscore())
    if (distributionModel != null) cm.distributionModel(distributionModel.toComscore())
    if (playlistTitle != null) cm.playlistTitle(playlistTitle)
    if (totalSegments != null) cm.totalSegments(totalSegments)
    if (clipUrl != null) cm.clipUrl(clipUrl)
    if (videoDimension != null) cm.videoDimensions(videoDimension.width, videoDimension.height)
    if (customLabels.isNotEmpty()) {
      cm.customLabels(customLabels)
    }
    return cm.build()
  }

  /**
   * The builder for [ComscoreMetaData].
   */
  class Builder {
    private var mediaType: ComscoreMediaType = ComscoreMediaType.OTHER
    private var uniqueId: String? = null
    private var length: Long = 0
    private var c3: String? = null
    private var c4: String? = null
    private var c6: String? = null
    private var stationTitle: String? = null
    private var stationCode: String? = null
    private var networkAffiliate: String? = null
    private var publisherName: String? = null
    private var programTitle: String? = null
    private var programId: String? = null
    private var episodeTitle: String? = null
    private var episodeId: String? = null
    private var episodeSeasonNumber: String? = null
    private var episodeNumber: String? = null
    private var genreName: String? = null
    private var genreId: String? = null
    private var carryTvAdvertisementLoad: Boolean? = null
    private var classifyAsCompleteEpisode: Boolean? = null
    private var dateOfProduction: ComscoreDate? = null
    private var timeOfProduction: ComscoreTime? = null
    private var dateOfTvAiring: ComscoreDate? = null
    private var timeOfTvAiring: ComscoreTime? = null
    private var dateOfDigitalAiring: ComscoreDate? = null
    private var timeOfDigitalAiring: ComscoreTime? = null
    private var feedType: ComscoreFeedType? = null
    private var classifyAsAudioStream: Boolean = false
    private var deliveryMode: ComscoreDeliveryMode? = null
    private var deliverySubscriptionType: ComscoreDeliverySubscriptionType? = null
    private var deliveryComposition: ComscoreDeliveryComposition? = null
    private var deliveryAdvertisementCapability: ComscoreDeliveryAdvertisementCapability? = null
    private var mediaFormat: ComscoreMediaFormat? = null
    private var distributionModel: ComscoreDistributionModel? = null
    private var playlistTitle: String? = null
    private var totalSegments: Int? = null
    private var clipUrl: String? = null
    private var videoDimension: ComscoreDimension? = null
    private var customLabels: Map<String, String> = mapOf()

    fun mediaType(mediaType: ComscoreMediaType): Builder {
      this.mediaType = mediaType
      return this
    }

    fun uniqueId(uniqueId: String): Builder {
      this.uniqueId = uniqueId
      return this
    }

    fun length(length: Long): Builder {
      this.length = length
      return this
    }

    fun c3(c3: String): Builder {
      this.c3 = c3
      return this
    }

    fun c4(c4: String): Builder {
      this.c4 = c4
      return this
    }

    fun c6(c6: String): Builder {
      this.c6 = c6
      return this
    }

    fun stationTitle(stationTitle: String): Builder {
      this.stationTitle = stationTitle
      return this
    }

    fun stationCode(stationCode: String): Builder {
      this.stationCode = stationCode
      return this
    }

    fun networkAffiliate(networkAffiliate: String): Builder {
      this.networkAffiliate = networkAffiliate
      return this
    }

    fun publisherName(publisherName: String): Builder {
      this.publisherName = publisherName
      return this
    }

    fun programTitle(programTitle: String): Builder {
      this.programTitle = programTitle
      return this
    }

    fun programId(programId: String): Builder {
      this.programId = programId
      return this
    }

    fun episodeTitle(episodeTitle: String): Builder {
      this.episodeTitle = episodeTitle
      return this
    }

    fun episodeId(episodeId: String): Builder {
      this.episodeId = episodeId
      return this
    }

    fun episodeSeasonNumber(episodeSeasonNumber: String): Builder {
      this.episodeSeasonNumber = episodeSeasonNumber
      return this
    }

    fun episodeNumber(episodeNumber: String): Builder {
      this.episodeNumber = episodeNumber
      return this
    }

    fun genreName(genreName: String): Builder {
      this.genreName = genreName
      return this
    }

    fun genreId(genreId: String): Builder {
      this.genreId = genreId
      return this
    }

    fun carryTvAdvertisementLoad(carryTvAdvertisementLoad: Boolean): Builder {
      this.carryTvAdvertisementLoad = carryTvAdvertisementLoad
      return this
    }

    fun classifyAsCompleteEpisode(classifyAsCompleteEpisode: Boolean): Builder {
      this.classifyAsCompleteEpisode = classifyAsCompleteEpisode
      return this
    }

    fun dateOfProduction(dateOfProduction: ComscoreDate): Builder {
      this.dateOfProduction = dateOfProduction
      return this
    }

    fun timeOfProduction(timeOfProduction: ComscoreTime): Builder {
      this.timeOfProduction = timeOfProduction
      return this
    }

    fun dateOfTvAiring(dateOfTvAiring: ComscoreDate): Builder {
      this.dateOfTvAiring = dateOfTvAiring
      return this
    }

    fun timeOfTvAiring(timeOfTvAiring: ComscoreTime): Builder {
      this.timeOfTvAiring = timeOfTvAiring
      return this
    }

    fun dateOfDigitalAiring(dateOfDigitalAiring: ComscoreDate): Builder {
      this.dateOfDigitalAiring = dateOfDigitalAiring
      return this
    }

    fun timeOfDigitalAiring(timeOfDigitalAiring: ComscoreTime): Builder {
      this.timeOfDigitalAiring = timeOfDigitalAiring
      return this
    }

    fun feedType(feedType: ComscoreFeedType): Builder {
      this.feedType = feedType
      return this
    }

    fun classifyAsAudioStream(classifyAsAudioStream: Boolean): Builder {
      this.classifyAsAudioStream = classifyAsAudioStream
      return this
    }

    fun deliveryMode(deliveryMode: ComscoreDeliveryMode): Builder {
      this.deliveryMode = deliveryMode
      return this
    }

    fun deliverySubscriptionType(deliverySubscriptionType: ComscoreDeliverySubscriptionType): Builder {
      this.deliverySubscriptionType = deliverySubscriptionType
      return this
    }

    fun deliveryComposition(deliveryComposition: ComscoreDeliveryComposition): Builder {
      this.deliveryComposition = deliveryComposition
      return this
    }

    fun deliveryAdvertisementCapability(deliveryAdvertisementCapability: ComscoreDeliveryAdvertisementCapability): Builder {
      this.deliveryAdvertisementCapability = deliveryAdvertisementCapability
      return this
    }

    fun mediaFormat(mediaFormat: ComscoreMediaFormat): Builder {
      this.mediaFormat = mediaFormat
      return this
    }

    fun distributionModel(distributionModel: ComscoreDistributionModel): Builder {
      this.distributionModel = distributionModel
      return this
    }

    fun playlistTitle(playlistTitle: String): Builder {
      this.playlistTitle = playlistTitle
      return this
    }

    fun totalSegments(totalSegments: Int): Builder {
      this.totalSegments = totalSegments
      return this
    }

    fun clipUrl(clipUrl: String): Builder {
      this.clipUrl = clipUrl
      return this
    }

    fun videoDimension(videoDimension: ComscoreDimension): Builder {
      this.videoDimension = videoDimension
      return this
    }

    fun customLabels(customLabels: Map<String, String>): Builder {
      this.customLabels = customLabels
      return this
    }

    fun build(): ComscoreMetaData {
      return createComscoreMetadata(
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
        customLabels
      )
    }

    companion object {
      private fun createComscoreMetadata(
        mediaType: ComscoreMediaType,
        uniqueId: String?,
        length: Long,
        c3: String?,
        c4: String?,
        c6: String?,
        stationTitle: String?,
        stationCode: String?,
        networkAffiliate: String?,
        publisherName: String?,
        programTitle: String?,
        programId: String?,
        episodeTitle: String?,
        episodeId: String?,
        episodeSeasonNumber: String?,
        episodeNumber: String?,
        genreName: String?,
        genreId: String?,
        carryTvAdvertisementLoad: Boolean?,
        classifyAsCompleteEpisode: Boolean?,
        dateOfProduction: ComscoreDate?,
        timeOfProduction: ComscoreTime?,
        dateOfTvAiring: ComscoreDate?,
        timeOfTvAiring: ComscoreTime?,
        dateOfDigitalAiring: ComscoreDate?,
        timeOfDigitalAiring: ComscoreTime?,
        feedType: ComscoreFeedType?,
        classifyAsAudioStream: Boolean,
        deliveryMode: ComscoreDeliveryMode?,
        deliverySubscriptionType: ComscoreDeliverySubscriptionType?,
        deliveryComposition: ComscoreDeliveryComposition?,
        deliveryAdvertisementCapability: ComscoreDeliveryAdvertisementCapability?,
        mediaFormat: ComscoreMediaFormat?,
        distributionModel: ComscoreDistributionModel?,
        playlistTitle: String?,
        totalSegments: Int?,
        clipUrl: String?,
        videoDimension: ComscoreDimension?,
        customLabels: Map<String, String>
      ): ComscoreMetaData {
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
          customLabels
        )
      }

      /**
       * Creates a builder for a default Comscore metadata object.
       *
       * <pre>
       * - This configuration does not contain any sources.
      </pre> *
       */
      fun comscoreMetadata(): Builder {
        return Builder()
      }
    }
  }
}
