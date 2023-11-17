package com.theoplayercomscore.integration

data class ComscoreConfiguration(
  val publisherId: String,
  val applicationName: String,
  val usagePropertiesAutoUpdateMode: Int,
  val userConsent: String,
  val secureTransmission: Boolean,
  val childDirected: Boolean,
  val debug: Boolean
)
