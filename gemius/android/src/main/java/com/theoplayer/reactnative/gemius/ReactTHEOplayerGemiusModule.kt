package com.theoplayer.reactnative.gemius

import com.facebook.react.bridge.*
import com.gemius.sdk.stream.ProgramData
import com.theoplayer.ReactTHEOplayerView
import com.theoplayer.android.api.THEOplayerView
import com.theoplayer.android.connector.analytics.gemius.GemiusConfiguration
import com.theoplayer.android.connector.analytics.gemius.GemiusConnector
import com.theoplayer.util.ViewResolver

private const val TAG = "GemiusModule"

private const val PROP_APP_NAME = "applicationName"
private const val PROP_APP_VERSION = "applicationVersion"
private const val PROP_HIT_COLLECTOR_HOST = "hitCollectorHost"
private const val PROP_GEMIUS_ID = "gemiusId"
private const val PROP_DEBUG = "debug"

private const val PROP_NAME = "name"
private const val PROP_DURATION = "duration"
private const val PROP_TRANSMISSION = "transmission"
private const val PROP_QUALITY = "quality"
private const val PROP_RESOLUTION = "resolution"
private const val PROP_VOLUME = "volume"
private const val PROP_EXTERNAL_PREMIERE_DATE = "externalPremiereDate"
private const val PROP_PREMIERE_DATE = "premiereDate"
private const val PROP_SERIES = "series"
private const val PROP_PROGRAM_TYPE = "programType"
private const val PROP_TYPOLOGY = "typology"
private const val PROP_PROGRAM_GENRE = "programGenre"
private const val PROP_PROGRAM_PARTIAL_NAME = "programPartialName"
private const val PROP_PROGRAM_PRODUCER = "programProducer"
private const val PROP_PROGRAM_THEMATIC_CATEGORY = "programThematicCategory"
private const val PROP_PROGRAM_SEASON = "programSeason"
private const val PROP_TRANSMISSION_CHANNEL = "transmissionChannel"
private const val PROP_TRANSMISSION_START_TIME = "transmissionStartTime"
private const val PROP_TRANSMISSION_TYPE = "transmissionType"

class ReactTHEOplayerGemiusModule(context: ReactApplicationContext) :
  ReactContextBaseJavaModule(context) {

  private val viewResolver: ViewResolver = ViewResolver(context)

  private var gemiusConnectors: HashMap<Int, GemiusConnector> = HashMap()

  override fun getName(): String {
    return TAG
  }

  @ReactMethod
  fun initialize(tag: Int, configuration: ReadableMap) {
    viewResolver.resolveViewByTag(tag) { view: ReactTHEOplayerView? ->
      view?.playerContext?.playerView?.let { playerView ->
        gemiusConnectors[tag] =
          initializeGemius(playerView, configuration)
      }
    }
  }

  private fun initializeGemius(
    view: THEOplayerView,
    configuration: ReadableMap,
  ): GemiusConnector {
    return GemiusConnector(
      context = reactApplicationContext,
      playerView = view,
      configuration = buildConfiguration(configuration))
  }

  private fun buildConfiguration(contentMetadata: ReadableMap): GemiusConfiguration {
    return GemiusConfiguration(
      applicationName = contentMetadata.getString(PROP_APP_NAME) ?: "NA",
      applicationVersion = contentMetadata.getString(PROP_APP_VERSION) ?: "NA",
      hitCollectorHost = contentMetadata.getString(PROP_HIT_COLLECTOR_HOST) ?: "NA",
      gemiusId = contentMetadata.getString(PROP_GEMIUS_ID) ?: "NA",
      debug = if (contentMetadata.hasKey(PROP_DEBUG)) contentMetadata.getBoolean(PROP_DEBUG) else false,
      adProcessor = null
    )
  }

  private fun buildProgramData(data: ReadableMap): ProgramData {
    return ProgramData().apply {
      data.toHashMap().entries.forEach { entry ->
        when (entry.key) {
          PROP_NAME -> name = data.getString(entry.key)
          PROP_DURATION -> duration = data.takeIf { data.hasKey(entry.key) }?.getInt(entry.key)
          PROP_TRANSMISSION -> transmission = data.getString(entry.key)
          PROP_QUALITY -> quality = data.getString(entry.key)
          PROP_RESOLUTION -> resolution = data.getString(entry.key)
          PROP_VOLUME -> volume = data.takeIf { data.hasKey(entry.key) }?.getInt(entry.key)
          PROP_EXTERNAL_PREMIERE_DATE -> externalPremiereDate = data.getString(entry.key)
          PROP_PREMIERE_DATE -> premiereDate = data.getString(entry.key)
          PROP_SERIES -> series = data.getString(entry.key)
          PROP_PROGRAM_TYPE -> programType = data.takeIf { data.hasKey(entry.key) }?.getInt(entry.key)?.let {
            when (it) {
              0 -> ProgramData.ProgramType.AUDIO
              else -> ProgramData.ProgramType.VIDEO
            }
          }
          PROP_TYPOLOGY -> typology = data.getString(entry.key)
          PROP_PROGRAM_GENRE -> programGenre = data.takeIf { data.hasKey(entry.key) }?.getInt(entry.key)
          PROP_PROGRAM_PARTIAL_NAME -> programPartialName = data.getString(entry.key)
          PROP_PROGRAM_PRODUCER -> programProducer = data.getString(entry.key)
          PROP_PROGRAM_THEMATIC_CATEGORY -> programThematicCategory = data.getString(entry.key)
          PROP_PROGRAM_SEASON -> programSeason = data.getString(entry.key)
          PROP_TRANSMISSION_CHANNEL -> transmissionChannel = data.getString(entry.key)
          PROP_TRANSMISSION_START_TIME -> transmissionStartTime = data.getString(entry.key)
          PROP_TRANSMISSION_TYPE -> transmissionType = data.takeIf { data.hasKey(entry.key) }?.getInt(entry.key)

          // Custom parameter, just add
          else -> addCustomParameter(entry.key, entry.value as? String)
        }
      }
    }
  }

  @ReactMethod
  fun update(tag: Int, programId: String, programData: ReadableMap) {
    gemiusConnectors[tag]?.update(programId, buildProgramData(programData))
  }

  @ReactMethod
  fun destroy(tag: Int) {
//    gemiusConnectors[tag]?.destroy()
  }
}
