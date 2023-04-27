package com.theoplayercomscore.integration

class ComscoreConfiguration(
  val publisherId: String,
  val applicationName: String,
  userConsent: String,
  secureTransmission: Boolean,
  childDirected: Boolean,
  debug: Boolean
) {
  var userConsent = userConsent
    private set
  var isSecureTransmission = secureTransmission
    private set
  var isChildDirected = childDirected
    private set
  var isDebug = debug
    private set
}
