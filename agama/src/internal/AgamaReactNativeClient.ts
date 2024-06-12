import {
  AgamaClient,
  AgamaMeasurement,
  AgamaPlayerDescription,
  AgamaSessionMetadata,
  AgamaShutdownType,
  AgamaStatusCode,
  AgamaViewState,
} from './AgamaClient';
import type { AgamaConfiguration } from '../api/AgamaConfiguration';
import type { Agama } from './Agama';
import { AgamaDeviceMetadataHandler } from './handlers/AgamaDeviceMetadataHandler';
import { generateAgamaAbrConfiguration, mapAgamaLogLevel } from './AgamaUtils';
import type { TypedSource } from 'react-native-theoplayer';
import type { AgamaSourceConfiguration } from '../api/AgamaSourceConfiguration';

export class AgamaReactNativeClient extends AgamaClient {
  private readonly _agama: typeof Agama | undefined;
  private _agamaClient: Agama.EMPClient | undefined;
  private readonly agamaPlayerDescription: AgamaPlayerDescription;
  private _initialised = false;
  private _inSession = false;
  private _agamaPlayerConfiguration: AgamaConfiguration | undefined;
  private _agamaDeviceMetadataHandler: AgamaDeviceMetadataHandler | undefined;

  constructor(playerDescription: AgamaPlayerDescription) {
    super();
    // @ts-ignore
    this.agamaPlayerDescription = playerDescription;
    this._agama = window.Agama;
  }

  initialise_(agamaPlayerConfiguration: AgamaConfiguration): void {
    this._agamaPlayerConfiguration = agamaPlayerConfiguration;
    if (this._agama) {
      this._agamaClient = initialiseEmpClient(agamaPlayerConfiguration, this._agama);
      if (this._agamaClient) {
        this._agamaDeviceMetadataHandler = new AgamaDeviceMetadataHandler(this._agamaClient, this._agama);
        this._initialised = true;
      }
    }
  }

  isAgamaAvailable_(): boolean {
    if (!this._agama) {
      console.warn('Please load the Agama Library (empclient.min.js) in order to use the integration');
    }
    return !!this._agama;
  }

  isInitialised_(): boolean {
    return this._initialised;
  }

  setMeasurement_(measurement: AgamaMeasurement, metadata: number): void {
    if (this._agamaClient && this._agama) {
      switch (measurement) {
        case AgamaMeasurement.BUFFER_LENGTH_:
          this._agamaClient.setMeasurement(this._agama.Measurement.BUFFER_LENGTH, metadata);
          break;
        case AgamaMeasurement.BYTES_RECEIVED_:
          this._agamaClient.setMeasurement(this._agama.Measurement.BYTES_RECEIVED, metadata);
          break;
        case AgamaMeasurement.SEGMENT_PROFILE_BITRATE_:
          this._agamaClient.setMeasurement(this._agama.Measurement.SEGMENT_PROFILE_BITRATE, metadata);
          break;
        case AgamaMeasurement.VIDEO_PROFILE_BITRATE_:
          this._agamaClient.setMeasurement(this._agama.Measurement.VIDEO_PROFILE_BITRATE, metadata);
          break;
        case AgamaMeasurement.SEGMENT_READ_BITRATE_:
          this._agamaClient.setMeasurement(this._agama.Measurement.SEGMENT_READ_BITRATE, metadata);
          break;
        case AgamaMeasurement.HTTP_REQUEST_STATUS_CODE_1XX_:
          this._agamaClient.setMeasurement(this._agama.Measurement.HTTP_REQUEST_STATUS_CODE_1XX, metadata);
          break;
        case AgamaMeasurement.HTTP_REQUEST_STATUS_CODE_2XX_:
          this._agamaClient.setMeasurement(this._agama.Measurement.HTTP_REQUEST_STATUS_CODE_2XX, metadata);
          break;
        case AgamaMeasurement.HTTP_REQUEST_STATUS_CODE_3XX_:
          this._agamaClient.setMeasurement(this._agama.Measurement.HTTP_REQUEST_STATUS_CODE_3XX, metadata);
          break;
        case AgamaMeasurement.HTTP_REQUEST_STATUS_CODE_4XX_:
          this._agamaClient.setMeasurement(this._agama.Measurement.HTTP_REQUEST_STATUS_CODE_4XX, metadata);
          break;
        case AgamaMeasurement.HTTP_REQUEST_STATUS_CODE_5XX_:
          this._agamaClient.setMeasurement(this._agama.Measurement.HTTP_REQUEST_STATUS_CODE_5XX, metadata);
          break;
        case AgamaMeasurement.PLAYBACK_POSITION_:
          this._agamaClient.setMeasurement(this._agama.Measurement.PLAYBACK_POSITION, metadata);
          break;
        case AgamaMeasurement.NUMBER_OF_FRAMES_DECODED_:
          this._agamaClient.setMeasurement(this._agama.Measurement.NUMBER_OF_FRAMES_DECODED, metadata);
          break;
        case AgamaMeasurement.NUMBER_OF_FRAMES_DROPPED_:
          this._agamaClient.setMeasurement(this._agama.Measurement.NUMBER_OF_FRAMES_DROPPED, metadata);
          break;
      }
    }
  }

  setSessionMetadata_(state: AgamaSessionMetadata, metadata: string | number): void {
    if (this._agamaClient && this._agama) {
      switch (state) {
        case AgamaSessionMetadata.ASSET_DURATION_:
          this._agamaClient.setSessionMetadata(this._agama.SessionMetadata.ASSET_DURATION, metadata);
          break;
        case AgamaSessionMetadata.MANIFEST_URI_:
          this._agamaClient.setSessionMetadata(this._agama.SessionMetadata.MANIFEST_URI, metadata);
          break;
        case AgamaSessionMetadata.NUMBER_OF_CONTENT_PROFILES_:
          this._agamaClient.setSessionMetadata(this._agama.SessionMetadata.NUMBER_OF_CONTENT_PROFILES, metadata);
          break;
        case AgamaSessionMetadata.SERVICE_NAME_:
          this._agamaClient.setSessionMetadata(this._agama.SessionMetadata.SERVICE_NAME, metadata);
          break;
        case AgamaSessionMetadata.CDN_:
          this._agamaClient.setSessionMetadata(this._agama.SessionMetadata.CDN, metadata);
          break;
        case AgamaSessionMetadata.CONTENT_TITLE_:
          this._agamaClient.setSessionMetadata(this._agama.SessionMetadata.CONTENT_TITLE, metadata);
          break;
        case AgamaSessionMetadata.CONTENT_TYPE_:
          this._agamaClient.setSessionMetadata(this._agama.SessionMetadata.CONTENT_TYPE, metadata);
          break;
        case AgamaSessionMetadata.CONTENT_DESCRIPTION_:
          this._agamaClient.setSessionMetadata(this._agama.SessionMetadata.CONTENT_DESCRIPTION, metadata);
          break;
      }
    }
  }

  signalDeviceMetadata_(): void {
    if (this._agamaDeviceMetadataHandler && this._agamaPlayerConfiguration) {
      void this._agamaDeviceMetadataHandler.signalDeviceMetadata_(this._agamaPlayerConfiguration, this.agamaPlayerDescription);
    }
  }

  abrSession_(agamaSource: TypedSource, agamaSourceConfiguration: AgamaSourceConfiguration): void {
    if (this._agama && this._agamaClient) {
      this.exitSession_();
      startAgamaAbrSession(this._agama, this._agamaClient, agamaSource, agamaSourceConfiguration);
      this._inSession = true;
    }
  }

  unload_(): void {
    if (this._agamaDeviceMetadataHandler) {
      this._agamaDeviceMetadataHandler.unload_();
    }
    this.shutdown_(AgamaShutdownType.NORMAL_SHUTDOWN_);
    this._agamaClient = undefined;
  }

  viewStateChanged_(viewStateType: AgamaViewState): void {
    this.reportViewState_(viewStateType);
  }

  event_(statusCode: AgamaStatusCode, statusMessage: string): void {
    if (this._agamaClient) {
      this._agamaClient.event(statusCode.code, statusMessage);
    }
  }

  exitSession_(): void {
    if (this._agamaClient && this._inSession) {
      this._agamaClient.exitSession();
      this._inSession = false;
    }
  }

  shutdown_(shutdownType: AgamaShutdownType): void {
    if (this._agamaClient && this._agama) {
      this.exitSession_();
      switch (shutdownType) {
        case AgamaShutdownType.NORMAL_SHUTDOWN_:
          this._agamaClient.shutdown(this._agama.ShutdownType.NORMAL_SHUTDOWN);
      }
    }
  }

  viewStateExtended_(viewStateType: AgamaViewState, statusCode: AgamaStatusCode, statusMessage: string): void {
    this.reportViewState_(viewStateType, statusCode, statusMessage);
  }

  private reportViewState_(viewStateType: AgamaViewState, statusCode?: AgamaStatusCode, statusMessage?: string): void {
    if (this._agamaClient && this._agama) {
      switch (viewStateType) {
        case AgamaViewState.PLAYING_:
          this.doReportViewState_(this._agama.ViewState.PLAYING, statusCode, statusMessage);
          break;
        case AgamaViewState.FAILED_:
          this.doReportViewState_(this._agama.ViewState.FAILED, statusCode, statusMessage);
          break;
        case AgamaViewState.INITIAL_BUFFERING_:
          this.doReportViewState_(this._agama.ViewState.INITIAL_BUFFERING, statusCode, statusMessage);
          break;
        case AgamaViewState.PAUSED_:
          this.doReportViewState_(this._agama.ViewState.PAUSED, statusCode, statusMessage);
          break;
        case AgamaViewState.SEEK_:
          this.doReportViewState_(this._agama.ViewState.SEEK, statusCode, statusMessage);
          break;
        case AgamaViewState.STALLED_:
          this.doReportViewState_(this._agama.ViewState.STALLED, statusCode, statusMessage);
          break;
        case AgamaViewState.NO_ACCESS_:
          this.doReportViewState_(this._agama.ViewState.NO_ACCESS, statusCode, statusMessage);
      }
    }
  }

  private doReportViewState_(viewStateType: Agama.ViewState, statusCode?: AgamaStatusCode, statusMessage?: string): void {
    if (this._agamaClient) {
      if (statusCode) {
        const message = sanitiseStatusMessage(statusMessage);
        this._agamaClient.viewStateExtended(viewStateType, statusCode.code, message);
      } else {
        this._agamaClient.viewStateChanged(viewStateType);
      }
    }
  }
}

function sanitiseStatusMessage(statusMessage: string | undefined): string {
  return statusMessage ? statusMessage : '';
}

export function startAgamaAbrSession(
  agama: typeof Agama,
  agamaClient: Agama.EMPClient,
  agamaSource: TypedSource,
  agamaSourceConfiguration: AgamaSourceConfiguration,
): void {
  const agamaAbrSourceConfiguration = generateAgamaAbrConfiguration(agama, agamaSource, agamaSourceConfiguration);

  agamaClient.abrSession(agamaAbrSourceConfiguration, agama.ViewState.INITIAL_BUFFERING);
}

export function initialiseEmpClient(configuration: AgamaConfiguration, agama: typeof Agama): Agama.EMPClient | undefined {
  const agamaLogLevel = mapAgamaLogLevel(agama, configuration.logLevel);
  agama.setLogLevel(agamaLogLevel);

  const empClient = new agama.EMPClient(configuration.config);
  return configureEmpClient(empClient, configuration);
}

export function configureEmpClient(empClient: Agama.EMPClient, agamaConfig: AgamaConfiguration): Agama.EMPClient {
  empClient.setExternalConfig(agamaConfig.config);
  return empClient;
}
