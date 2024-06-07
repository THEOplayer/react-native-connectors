export interface AgamaAbrSessionSourceConfiguration {
  /**
   * Name identification of the asset being played
   */
  asset: string;

  /**
   * Type of the stream (live, vod, event)
   */
  playlistType: Agama.DsPlaylistType;

  /**
   * Specific dynamic streaming protocol used
   */
  protocol: Agama.DsProtocol;

  /**
   * Valid player src URI
   */
  uri: string;
}

declare global {
  interface Window {
    Agama?: typeof Agama;
  }
}

declare namespace Agama {
  /**
   * Setting the playlist type
   */
  export enum DsPlaylistType {
    EVENT = 'EVENT',
    LIVE = 'LIVE',
    VOD = 'VOD',
  }

  /**
   * Setting the streaming protocol type
   */
  export enum DsProtocol {
    APPLE_HLS = 'APPLE_HLS',
    // MS_SMOOTH = 'MS_SMOOTH',
    // ADOBE_HDS = 'ADOBE_HDS',
    MPEG_DASH = 'MPEG_DASH',
  }

  /**
   * Setting the verbose level
   */
  export enum LogLevel {
    FATAL = 'FATAL',
    ERROR = 'ERROR',
    WARNING = 'WARNING',
    INFO = 'INFO',
    DEBUG = 'DEBUG',
  }

  /**
   * Client's device and browser metadata
   */
  export enum DeviceMetadata {
    PLAYER = 'PLAYER',
    PLAYER_VERSION = 'PLAYER_VERSION',
    DEVICE_BROWSER = 'DEVICE_BROWSER',
    DEVICE_BROWSER_VERSION = 'DEVICE_BROWSER_VERSION',
    DEVICE_OS = 'DEVICE_OS',
    DEVICE_OS_VERSION = 'DEVICE_OS_VERSION',
    DEVICE_ID = 'DEVICE_ID',
    DEVICE_TYPE = 'DEVICE_TYPE',
    DEVICE_MANUFACTURER = 'DEVICE_MANUFACTURER',
    DEVICE_MODEL = 'DEVICE_MODEL',
    DEVICE_IP = 'DEVICE_IP',
    DEVICE_LATITUDE = 'DEVICE_LATITUDE',
    DEVICE_LONGITUDE = 'DEVICE_LONGITUDE',
    EMPCLIENT_INTEGRATION_VERSION = 'EMPCLIENT_INTEGRATION_VERSION',
    EMPCLIENT_INTEGRATION_BUILDDATE = 'EMPCLIENT_INTEGRATION_BUILDDATE',
    DATA_CONNECTION_TYPE = 'DATA_CONNECTION_TYPE',
    APPLICATION = 'APPLICATION',
    APPLICATION_VERSION = 'APPLICATION_VERSION',
    USER_ACCOUNT_ID = 'USER_ACCOUNT_ID',
  }

  /**
   * Reporting the view state changes to the EMP client
   */
  export enum ViewState {
    PLAYING = 'PLAYING',
    PAUSED = 'PAUSED',
    SEEK = 'SEEK',
    STALLED = 'STALLED',
    FAILED = 'FAILED',
    INITIAL_BUFFERING = 'INITIAL_BUFFERING',
    NO_ACCESS = 'NO_ACCESS',
  }

  export enum Measurement {
    HTTP_REQUEST_STATUS_CODE_1XX = 'HTTP_REQUEST_STATUS_CODE_1XX',
    HTTP_REQUEST_STATUS_CODE_2XX = 'HTTP_REQUEST_STATUS_CODE_2XX',
    HTTP_REQUEST_STATUS_CODE_3XX = 'HTTP_REQUEST_STATUS_CODE_3XX',
    HTTP_REQUEST_STATUS_CODE_4XX = 'HTTP_REQUEST_STATUS_CODE_4XX',
    HTTP_REQUEST_STATUS_CODE_5XX = 'HTTP_REQUEST_STATUS_CODE_5XX',
    BUFFER_LENGTH = 'BUFFER_LENGTH',
    BYTES_RECEIVED = 'BYTES_RECEIVED',
    SEGMENT_READ_BITRATE = 'SEGMENT_READ_BITRATE',
    SEGMENT_PROFILE_BITRATE = 'SEGMENT_PROFILE_BITRATE',
    VIDEO_PROFILE_BITRATE = 'VIDEO_PROFILE_BITRATE',
    NUMBER_OF_FRAMES_DROPPED = 'NUMBER_OF_FRAMES_DROPPED',
    PLAYBACK_POSITION = 'PLAYBACK_POSITION',
    NUMBER_OF_FRAMES_DECODED = 'NUMBER_OF_FRAMES_DECODED',
    PLAYBACK_DELTA_TO_ORIGIN = 'PLAYBACK_DELTA_TO_ORIGIN',
    STREAM_DELTA_TO_ORIGIN = 'STREAM_DELTA_TO_ORIGIN',
    ORIGIN_TIMESTAMP = 'ORIGIN_TIMESTAMP',
  }

  export enum SessionMetadata {
    MANIFEST_URI = 'MANIFEST_URI',
    ASSET_DURATION = 'ASSET_DURATION',
    NUMBER_OF_CONTENT_PROFILES = 'NUMBER_OF_CONTENT_PROFILES',
    CDN = 'CDN',
    CONTENT_TITLE = 'CONTENT_TITLE',
    SERVICE_NAME = 'SERVICE_NAME',
    CONTENT_TYPE = 'CONTENT_TYPE',
    CONTENT_DESCRIPTION = 'CONTENT_DESCRIPTION',
  }

  export enum ShutdownType {
    NORMAL_SHUTDOWN = 'shutdown_normal_shutdown',
  }

  /**
   * The Agama client used by the player.
   *
   * For more information, consult the Agama SDK documentation.
   */
  export class EMPClient {
    constructor(config: string);

    /**
     * Create a new session on the EMP client
     */
    abrSession(abrIdentification: AgamaAbrSessionSourceConfiguration, viewStateType: ViewState.INITIAL_BUFFERING): void;

    /**
     * Notify custom events to the EMP client
     */
    event(statusCode: string, statusMessage: string): void;

    /**
     * End the current ABR session on the EMP client
     */
    exitSession(): void;

    /**
     * Report client's device and browser metadata information to the EMP client
     */
    setDeviceMetadata(deviceMetadataType: DeviceMetadata, metadata: string | number): void;

    /**
     * Configure the EMP client
     */
    setExternalConfig(configuration: string): void;

    /**
     * Track measurements to EMP client
     */
    setMeasurement(measurement: Measurement, metadata: number): void;

    /**
     * Set state to EMP client
     */
    setSessionMetadata(state: SessionMetadata, metadata: string | number): void;

    /**
     * Shutdown the EMP client
     */
    shutdown(shutdownType: ShutdownType): void;

    /**
     * Report player state changes to the EMP client
     */
    viewStateChanged(viewStateType: ViewState): void;

    /**
     * Report view state with accompanying status code and status message to the EMP client
     */
    viewStateExtended(viewStateType: ViewState, statusCode: string, statusMessage: string): void;
  }

  /**
   * The verbose level set in the EMP client
   */
  export function setLogLevel(logLevel: LogLevel): void;
}

// Only export the *type* of our namespace declaration. The actual *implementation* must be loaded separately from the Agama library.
export type { Agama };
