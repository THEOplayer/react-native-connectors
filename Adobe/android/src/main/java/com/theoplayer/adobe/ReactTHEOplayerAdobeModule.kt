package com.theoplayer.adobe

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.theoplayer.util.ViewResolver

private const val TAG = "AdobeModule"

class ReactTHEOplayerAdobeModule(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver

  init {
    viewResolver = ViewResolver(context)
  }

  override fun getName(): String {
    return TAG
  }
}
