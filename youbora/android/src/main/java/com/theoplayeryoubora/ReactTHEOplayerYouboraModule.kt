package com.theoplayeryoubora

import android.app.Activity
import com.facebook.react.bridge.*
import com.npaw.NpawPlugin
import com.npaw.analytics.video.VideoAdapter
import com.npaw.balancer.BalancerOptions
import com.npaw.core.options.AnalyticsOptions
import com.npaw.core.util.extensions.Log
import com.npaw.diagnostics.DiagnosticOptions
import com.npaw.theo.TheoAdapter
import com.npaw.theo.TheoAdsAdapter
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.android.api.THEOplayerView
import com.theoplayer.util.ViewResolver
import com.theoplayeryoubora.adapter.*

private const val TAG = "YouboraModule"

class ReactTHEOplayerYouboraModule(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver = ViewResolver(context)
  private var youboraPlugin: HashMap<Int, VideoAdapter> = HashMap()

  override fun getName() = TAG

  @ReactMethod
  fun initialize(
    tag: Int,
    accountCode: String,
    analyticsOptions: ReadableMap,
    balancerOptions: ReadableMap,
    userAgent: String,
    debugLevel: Int?
  ) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.playerContext?.playerView?.let { playerView ->
        initializeYoubora(
          view = playerView,
          accountCode = accountCode,
          analyticsOptions = AnalyticsOptionsAdapter.fromMap(analyticsOptions),
          balancerOptions = BalancerOptionsAdapter.fromMap(balancerOptions),
          diagnosticOptions = DiagnosticOptionsAdapter.fromMap(balancerOptions),
          userAgent = userAgent,
          logLevel = parseLogLevel(debugLevel)
        )?.let {
          youboraPlugin[tag] = it
        }
      }
    }
  }

  private fun parseLogLevel(logLevel: Int?): Log.Level {
    return when (logLevel) {
      1 -> Log.Level.VERBOSE
      2 -> Log.Level.DEBUG
      3 -> Log.Level.WARNING
      4 -> Log.Level.ERROR
      else -> Log.Level.SILENT
    }
  }

  private fun initializeYoubora(
    view: THEOplayerView,
    accountCode: String,
    analyticsOptions: AnalyticsOptions,
    balancerOptions: BalancerOptions,
    diagnosticOptions: DiagnosticOptions,
    userAgent: String,
    logLevel: Log.Level
  ): VideoAdapter? {
    return reactApplicationContext.currentActivity?.let { activity: Activity ->
      val videoAdapter = NpawPlugin.Builder(activity = activity, accountCode = accountCode)
        .setAnalyticsOptions(analyticsOptions)
        .setAnalyticsUserAgent(userAgent)
        .setBalancerOptions(balancerOptions)
        .setDiagnosticOptions(diagnosticOptions)
        .setLogLevel(logLevel)
        .build()
      videoAdapter
        .videoBuilder()
        .setPlayerAdapter(TheoAdapter(view))
        .setAdAdapter(TheoAdsAdapter(view))
        .build()
    }
  }

  @ReactMethod
  fun destroy(tag: Int) {
    youboraPlugin[tag]?.destroy()
    youboraPlugin.remove(tag)
  }
}
