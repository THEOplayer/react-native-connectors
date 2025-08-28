package com.theoplayer.reactnative.adobe

import android.content.Context
import com.facebook.react.bridge.ReadableMap
import com.theoplayer.android.api.THEOplayerView

class AdobeConnector(
  context: Context,
  private val playerView: THEOplayerView,
  uri: String,
  ecid: String,
  sid: String,
  trackingUrl: String,
  metadata: ReadableMap?,
  userAgent: String?,
  debug: Boolean?) {

  fun setDebug(boolean: Boolean) {

  }

  fun updateMetadata(metadata: AdobeMetadata) {

  }

  fun setError(metadata: AdobeMetadata) {

  }

  fun stopAndStartNewSession(metadata: AdobeMetadata?) {

  }

  fun destroy() {

  }
}
