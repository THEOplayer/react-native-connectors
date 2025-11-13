package com.theoplayer.reactnative.adobe.edge

import android.util.Log

object Logger {
  var debug: Boolean = false
  const val TAG = "AdobeEdgeConnector"

  fun debug(message: String) {
    if (debug) {
      Log.d(TAG, message)
    }
  }

  fun warn(message: String) {
    Log.w(TAG, message)
  }

  fun error(message: String) {
    Log.e(TAG, message)
  }
}
