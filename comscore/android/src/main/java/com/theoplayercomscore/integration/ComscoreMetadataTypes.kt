package com.theoplayercomscore.integration

import com.comscore.streaming.ContentDeliveryAdvertisementCapability
import com.comscore.streaming.ContentDeliveryComposition
import com.comscore.streaming.ContentDeliveryMode
import com.comscore.streaming.ContentDeliverySubscriptionType
import com.comscore.streaming.ContentDistributionModel
import com.comscore.streaming.ContentFeedType
import com.comscore.streaming.ContentMediaFormat
import com.comscore.streaming.ContentType

enum class ComscoreMediaType {
  LONG_FORM_ON_DEMAND,
  SHORT_FORM_ON_DEMAND,
  LIVE,
  USER_GENERATED_LONG_FORM_ON_DEMAND,
  USER_GENERATED_SHORT_FORM_ON_DEMAND,
  USER_GENERATED_LIVE,
  BUMPER,
  OTHER;

  fun toComscore(): Int {
    return when (this) {
      LONG_FORM_ON_DEMAND -> ContentType.LONG_FORM_ON_DEMAND
      SHORT_FORM_ON_DEMAND -> ContentType.SHORT_FORM_ON_DEMAND
      LIVE -> ContentType.LIVE
      USER_GENERATED_LONG_FORM_ON_DEMAND -> ContentType.USER_GENERATED_LONG_FORM_ON_DEMAND
      USER_GENERATED_SHORT_FORM_ON_DEMAND -> ContentType.USER_GENERATED_SHORT_FORM_ON_DEMAND
      USER_GENERATED_LIVE -> ContentType.USER_GENERATED_LIVE
      BUMPER -> ContentType.BUMPER
      OTHER -> ContentType.OTHER
    }
  }
}

enum class ComscoreFeedType {
  EASTHD,
  WESTHD,
  EASTSD,
  WESTSD;

  fun toComscore(): Int {
    return when (this) {
      EASTHD -> ContentFeedType.EAST_HD
      WESTHD -> ContentFeedType.WEST_HD
      EASTSD -> ContentFeedType.EAST_SD
      WESTSD -> ContentFeedType.WEST_SD
    }
  }
}

enum class ComscoreDeliveryMode {
  LINEAR,
  ON_DEMAND;

  fun toComscore(): Int {
    return when (this) {
      LINEAR -> ContentDeliveryMode.LINEAR
      ON_DEMAND -> ContentDeliveryMode.ON_DEMAND
    }
  }
}

enum class ComscoreDeliverySubscriptionType {
  TRADITIONAL_MVPD,
  VIRTUAL_MVPD,
  SUBSCRIPTION,
  TRANSACTIONAL,
  ADVERTISING,
  PREMIUM;

  fun toComscore(): Int {
    return when (this) {
      TRADITIONAL_MVPD -> ContentDeliverySubscriptionType.TRADITIONAL_MVPD
      VIRTUAL_MVPD -> ContentDeliverySubscriptionType.VIRTUAL_MVPD
      SUBSCRIPTION -> ContentDeliverySubscriptionType.SUBSCRIPTION
      TRANSACTIONAL -> ContentDeliverySubscriptionType.TRANSACTIONAL
      ADVERTISING -> ContentDeliverySubscriptionType.ADVERTISING
      PREMIUM -> ContentDeliverySubscriptionType.PREMIUM
    }
  }
}

enum class ComscoreDeliveryComposition {
  CLEAN,
  EMBED;

  fun toComscore(): Int {
    return when (this) {
      CLEAN -> ContentDeliveryComposition.CLEAN
      EMBED -> ContentDeliveryComposition.EMBED
    }
  }
}

enum class ComscoreDeliveryAdvertisementCapability {
  NONE,
  DYNAMIC_LOAD,
  DYNAMIC_REPLACEMENT,
  LINEAR_1DAY,
  LINEAR_2DAY,
  LINEAR_3DAY,
  LINEAR_4DAY,
  LINEAR_5DAY,
  LINEAR_6DAY,
  LINEAR_7DAY;

  fun toComscore(): Int {
    return when (this) {
      NONE -> ContentDeliveryAdvertisementCapability.NONE
      DYNAMIC_LOAD -> ContentDeliveryAdvertisementCapability.DYNAMIC_LOAD
      DYNAMIC_REPLACEMENT -> ContentDeliveryAdvertisementCapability.DYNAMIC_REPLACEMENT
      LINEAR_1DAY -> ContentDeliveryAdvertisementCapability.LINEAR_1DAY
      LINEAR_2DAY -> ContentDeliveryAdvertisementCapability.LINEAR_2DAY
      LINEAR_3DAY -> ContentDeliveryAdvertisementCapability.LINEAR_3DAY
      LINEAR_4DAY -> ContentDeliveryAdvertisementCapability.LINEAR_4DAY
      LINEAR_5DAY -> ContentDeliveryAdvertisementCapability.LINEAR_5DAY
      LINEAR_6DAY -> ContentDeliveryAdvertisementCapability.LINEAR_6DAY
      LINEAR_7DAY -> ContentDeliveryAdvertisementCapability.LINEAR_7DAY
    }
  }
}

enum class ComscoreMediaFormat {
  FULL_CONTENT_EPISODE,
  FULL_CONTENT_MOVIE,
  FULL_CONTENT_PODCAST,
  FULL_CONTENT_GENERIC,
  PARTIAL_CONTENT_EPISODE,
  PARTIAL_CONTENT_MOVIE,
  PARTIAL_CONTENT_PODCAST,
  PARTIAL_CONTENT_GENERIC,
  PREVIEW_EPISODE,
  PREVIEW_MOVIE,
  PREVIEW_GENERIC,
  EXTRA_EPISODE,
  EXTRA_MOVIE,
  EXTRA_GENERIC;

  fun toComscore(): Int {
    when (this) {
      FULL_CONTENT_EPISODE -> return ContentMediaFormat.FULL_CONTENT_EPISODE
      FULL_CONTENT_MOVIE -> return ContentMediaFormat.FULL_CONTENT_MOVIE
      FULL_CONTENT_PODCAST -> return ContentMediaFormat.FULL_CONTENT_PODCAST
      FULL_CONTENT_GENERIC -> return ContentMediaFormat.FULL_CONTENT_GENERIC
      PARTIAL_CONTENT_EPISODE -> return ContentMediaFormat.PARTIAL_CONTENT_EPISODE
      PARTIAL_CONTENT_MOVIE -> return ContentMediaFormat.PARTIAL_CONTENT_MOVIE
      PARTIAL_CONTENT_PODCAST -> return ContentMediaFormat.PARTIAL_CONTENT_PODCAST
      PARTIAL_CONTENT_GENERIC -> return ContentMediaFormat.PARTIAL_CONTENT_GENERIC
      PREVIEW_EPISODE -> return ContentMediaFormat.PREVIEW_EPISODE
      PREVIEW_MOVIE -> return ContentMediaFormat.PREVIEW_MOVIE
      PREVIEW_GENERIC -> return ContentMediaFormat.PREVIEW_GENERIC
      EXTRA_EPISODE -> return ContentMediaFormat.EXTRA_EPISODE
      EXTRA_MOVIE -> return ContentMediaFormat.EXTRA_MOVIE
      EXTRA_GENERIC -> return ContentMediaFormat.EXTRA_GENERIC
    }
  }
}

enum class ComscoreDistributionModel {
  TV_AND_ONLINE,
  EXCLUSIVELY_ONLINE;

  fun toComscore(): Int {
    return when (this) {
      TV_AND_ONLINE -> ContentDistributionModel.TV_AND_ONLINE
      EXCLUSIVELY_ONLINE -> ContentDistributionModel.EXCLUSIVELY_ONLINE
    }
  }
}

data class ComscoreDimension(val width: Int, val height: Int)
data class ComscoreDate(val year: Int, val month: Int, val day: Int)
data class ComscoreTime(val hours: Int, val minutes: Int)



