package com.reactnativetheoplayer.engage

import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

open class MainActivity : ReactActivity() {
  public override fun onCreate(bundle: Bundle?) {
    super.onCreate(bundle)
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String {
    return "ReactNativeTHEOplayerEngage"
  }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  public override fun onUserLeaveHint() {
    this.sendBroadcast(Intent("onUserLeaveHint"))
    super.onUserLeaveHint()
  }
}
