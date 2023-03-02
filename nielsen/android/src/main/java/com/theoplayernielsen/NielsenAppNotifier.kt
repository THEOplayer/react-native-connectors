package com.theoplayernielsen

import com.nielsen.app.sdk.IAppNotifier

class NielsenAppNotifier : IAppNotifier {
  override fun onAppSdkEvent(timestamp: Long, code: Int, description: String) {
    println("$description Timestamp: $timestamp code: $code")
  }
}
