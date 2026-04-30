package com.reactnativetheoplayer

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.theoplayer.reactnative.adobe.edge.ReactTHEOplayerAdobeEdgePackage
import com.theoplayer.reactnative.adobe.ReactTHEOplayerAdobePackage
import com.theoplayer.reactnative.bitmovin.ReactTHEOplayerBitmovinPackage
import com.theoplayercomscore.ReactTHEOplayerComscorePackage
import com.theoplayerconviva.ReactTHEOplayerConvivaPackage
import com.theoplayernielsen.ReactTHEOplayerNielsenPackage
//import com.theoplayeryospace.ReactTHEOplayerYospacePackage

class MainApplication : Application(), ReactApplication {
  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
        packageList =
          PackageList(this).packages.apply {
            // Packages that cannot be autolinked yet can be added manually here, for example:
            add(ReactTHEOplayerBitmovinPackage())
            add(ReactTHEOplayerComscorePackage())
            add(ReactTHEOplayerConvivaPackage())
            add(ReactTHEOplayerNielsenPackage())
            add(ReactTHEOplayerAdobePackage())
            add(ReactTHEOplayerAdobeEdgePackage())
            // add(ReactTHEOplayerYospacePackage())
          },
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }
}
