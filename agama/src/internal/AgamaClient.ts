import type { AgamaConfiguration } from '../api/AgamaConfiguration';
import type { AgamaClientEventMap } from './AgamaClientEvent';
import type { TypedSource } from 'react-native-theoplayer';
import { DefaultEventDispatcher } from './event/DefaultEventDispatcher';
import type { AgamaSourceConfiguration } from '../api/AgamaSourceConfiguration';

/*
 * The enums in this file are the internal equivalent of the enums defined in
 * web\src\integrations\agama\Agama.ts (under namespace Agama)
 * If the enums in the Agama namespace change, the corresponding changes should be made here.
 */

/**
 * Reporting the view state changes to the EMP client
 */
export enum AgamaViewState {
  PLAYING_ = 'PLAYING',
  PAUSED_ = 'PAUSED',
  SEEK_ = 'SEEK',
  STALLED_ = 'STALLED',
  FAILED_ = 'FAILED',
  INITIAL_BUFFERING_ = 'INITIAL_BUFFERING',
  NO_ACCESS_ = 'NO_ACCESS',
}

export enum AgamaMeasurement {
  HTTP_REQUEST_STATUS_CODE_1XX_ = 'HTTP_REQUEST_STATUS_CODE_1XX',
  HTTP_REQUEST_STATUS_CODE_2XX_ = 'HTTP_REQUEST_STATUS_CODE_2XX',
  HTTP_REQUEST_STATUS_CODE_3XX_ = 'HTTP_REQUEST_STATUS_CODE_3XX',
  HTTP_REQUEST_STATUS_CODE_4XX_ = 'HTTP_REQUEST_STATUS_CODE_4XX',
  HTTP_REQUEST_STATUS_CODE_5XX_ = 'HTTP_REQUEST_STATUS_CODE_5XX',
  BUFFER_LENGTH_ = 'BUFFER_LENGTH',
  BYTES_RECEIVED_ = 'BYTES_RECEIVED',
  SEGMENT_READ_BITRATE_ = 'SEGMENT_READ_BITRATE',
  SEGMENT_PROFILE_BITRATE_ = 'SEGMENT_PROFILE_BITRATE',
  VIDEO_PROFILE_BITRATE_ = 'VIDEO_PROFILE_BITRATE',
  NUMBER_OF_FRAMES_DROPPED_ = 'NUMBER_OF_FRAMES_DROPPED',
  PLAYBACK_POSITION_ = 'PLAYBACK_POSITION',
  NUMBER_OF_FRAMES_DECODED_ = 'NUMBER_OF_FRAMES_DECODED',
  PLAYBACK_DELTA_TO_ORIGIN_ = 'PLAYBACK_DELTA_TO_ORIGIN',
  STREAM_DELTA_TO_ORIGIN_ = 'STREAM_DELTA_TO_ORIGIN',
  ORIGIN_TIMESTAMP_ = 'ORIGIN_TIMESTAMP',
}

export enum AgamaSessionMetadata {
  MANIFEST_URI_ = 'MANIFEST_URI',
  ASSET_DURATION_ = 'ASSET_DURATION',
  NUMBER_OF_CONTENT_PROFILES_ = 'NUMBER_OF_CONTENT_PROFILES',
  CDN_ = 'CDN',
  CONTENT_TITLE_ = 'CONTENT_TITLE',
  SERVICE_NAME_ = 'SERVICE_NAME',
  CONTENT_TYPE_ = 'CONTENT_TYPE',
  CONTENT_DESCRIPTION_ = 'CONTENT_DESCRIPTION',
}

export enum AgamaShutdownType {
  NORMAL_SHUTDOWN_ = 'shutdown_normal_shutdown',
}

export enum AgamaStatusCodeCategory {
  SESSION_ = 'session/',
  CONTENT_ = 'content/',
  INTERNAL_ERROR_ = 'internalError/',
  DRM_ERROR_ = 'drmError/',
  CA_ERROR_ = 'caError/',
  NETWORK_ERROR_ = 'networkError/',
}

export class AgamaStatusCode {
  constructor(
    private category: AgamaStatusCodeCategory,
    private statusCode: string,
  ) {}

  get code(): string {
    return this.category + this.statusCode;
  }
}

export enum AgamaSessionStatusCodes {
  USER_ACTION_ = 'userAction',
  END_OF_STREAM_ = 'endOfStreamReached',
}

export interface AgamaPlayerDescription {
  name: string;
  version: string;
}

export abstract class AgamaClient extends DefaultEventDispatcher<AgamaClientEventMap> {
  abstract abrSession_(agamaSource: TypedSource, agamaSourceConfiguration: AgamaSourceConfiguration): void;

  abstract event_(statusCode: AgamaStatusCode, statusMessage: string): void;

  abstract exitSession_(): void;

  abstract initialise_(agamaPlayerConfiguration: AgamaConfiguration): void;

  abstract isAgamaAvailable_(): boolean;

  abstract isInitialised_(): boolean;

  abstract setMeasurement_(measurement: AgamaMeasurement, metadata: number): void;

  abstract setSessionMetadata_(state: AgamaSessionMetadata, metadata: string | number): void;

  abstract shutdown_(shutdownType: AgamaShutdownType): void;

  abstract signalDeviceMetadata_(): void;

  abstract viewStateChanged_(viewStateType: AgamaViewState): void;

  abstract viewStateExtended_(viewStateType: AgamaViewState, statusCode: AgamaStatusCode, statusMessage: string): void;

  abstract unload_(): void;
}
