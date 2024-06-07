/**
 * The type of log level for the Agama integration, represented by a value from the following list:
 * <br/> - `'info'`
 * <br/> - `'debug'`
 * <br/> - `'warning'`
 * <br/> - `'error'`
 * <br/> - `'fatal'`
 *
 * @public
 */
export type AgamaLogLevelType = 'info' | 'debug' | 'warning' | 'error' | 'fatal';

/**
 * Describes the configuration of Agama.
 *
 * @public
 */
export interface AgamaConfiguration {
  /**
   * The initial base configuration.
   *
   * @remarks
   * <br/> - For more information, consult the Agama documentation.
   *
   * @example
   * <br/> - 'emp_service=http://127.0.0.1:8191/report;report_interval=60;id_report_interval=240;operator_id=fooSoo'
   */
  config: string;

  /**
   * The type of log level.
   *
   * @defaultValue `'fatal'`
   */
  logLevel?: AgamaLogLevelType;

  /**
   * The name of your application.
   *
   * @remarks
   * <br/> - Will not be reported to Agama if not present
   */
  application?: string;

  /**
   * The version of your application
   *
   * @remarks
   * <br/> - Will not be reported to Agama if not present
   */
  applicationVersion?: string;

  /**
   * The identifier of the user account.
   *
   * @remarks
   * <br/> - Will not be reported to Agama if not present
   */
  userAccountID?: string;

  /**
   * The identifier of the device.
   *
   * @remarks
   * <br/> - Make sure to pass a valid string as indicated by the Agama SDK documentation. No specific value format validation is performed on this
   * as that is deemed the responsibility of the one setting this value externally via this configuration property.
   * <br/> - Will be generated internally for each session if not present
   */
  deviceID?: string;

  /**
   * The manufacturer of the device
   *
   * @remarks
   * <br/> Available since v5.3.0
   */
  deviceManufacturer?: string;

  /**
   * The model name of the Device, including the "submodel". Use the spelling set by the manufacturer.
   */
  deviceModel?: string;

  /**
   * A string describing the physical Device type
   *
   * @remarks
   * <br/> - These pre-defined Device type values must be used if the Device matches one of following: `'tablet'`, `'mobile'`, `'pc'`, `'media-streamer'` (used for Chromecast, Apple TV), `'game-console'`, `'tv'`.
   * <br/> - If no value is passed, the player will determine this based on the user agent.
   */
  deviceType?: string;
}
