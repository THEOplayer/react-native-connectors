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

  /**
   * Create Comscore ContentMetadata instance.
   */
  fun toComscoreContentMetadata(): ContentMetadata {
    return ContentMetadata.Builder().apply {
      mediaType(mediaType.toComscore())
      uniqueId(uniqueId)
      length(length)
      if (c3 != null) dictionaryClassificationC3(c3)
      if (c4 != null) dictionaryClassificationC4(c4)
      if (c6 != null) dictionaryClassificationC6(c6)
      stationTitle(stationTitle)
      if (stationCode != null) stationCode(stationCode)
      if (networkAffiliate != null) networkAffiliate(networkAffiliate)
      if (publisherName != null) publisherName(publisherName)
      programTitle(programTitle)
      if (programId != null) programId(programId)
      episodeTitle(episodeTitle)
      if (episodeId != null) episodeId(episodeId)
      if (episodeSeasonNumber != null) episodeSeasonNumber(episodeSeasonNumber)
      if (episodeNumber != null) episodeNumber(episodeNumber)
      genreName(genreName)
      if (genreId != null) genreId(genreId)
      if (carryTvAdvertisementLoad != null) carryTvAdvertisementLoad(carryTvAdvertisementLoad)
      if (classifyAsCompleteEpisode != null) classifyAsCompleteEpisode(classifyAsCompleteEpisode)
      if (dateOfProduction != null) dateOfProduction(
        dateOfProduction.year,
        dateOfProduction.month,
        dateOfProduction.day
      )
      if (timeOfProduction != null) timeOfProduction(
        timeOfProduction.hours,
        timeOfProduction.minutes
      )
      if (dateOfTvAiring != null) dateOfTvAiring(
        dateOfTvAiring.year,
        dateOfTvAiring.month,
        dateOfTvAiring.day
      )
      if (timeOfTvAiring != null) timeOfTvAiring(timeOfTvAiring.hours, timeOfTvAiring.minutes)
      if (dateOfDigitalAiring != null) dateOfDigitalAiring(
        dateOfDigitalAiring.year,
        dateOfDigitalAiring.month,
        dateOfDigitalAiring.day
      )
      if (timeOfDigitalAiring != null) timeOfDigitalAiring(
        timeOfDigitalAiring.hours,
        timeOfDigitalAiring.minutes
      )
      if (feedType != null) feedType(feedType.toComscore())
      classifyAsAudioStream(classifyAsAudioStream)
      if (deliveryMode != null) deliveryMode(deliveryMode.toComscore())
      if (deliverySubscriptionType != null) deliverySubscriptionType(deliverySubscriptionType.toComscore())
      if (deliveryComposition != null) deliveryComposition(deliveryComposition.toComscore())
      if (deliveryAdvertisementCapability != null) deliveryAdvertisementCapability(
        deliveryAdvertisementCapability.toComscore()
      )
      if (mediaFormat != null) mediaFormat(mediaFormat.toComscore())
      if (distributionModel != null) distributionModel(distributionModel.toComscore())
      if (playlistTitle != null) playlistTitle(playlistTitle)
      if (totalSegments != null) totalSegments(totalSegments)
      if (clipUrl != null) clipUrl(clipUrl)
      if (videoDimension != null) videoDimensions(videoDimension.width, videoDimension.height)
      if (customLabels.isNotEmpty()) {
        customLabels(customLabels)
      }
    }.build()
  }
}
