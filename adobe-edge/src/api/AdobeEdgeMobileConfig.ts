export interface AdobeEdgeMobileConfig {
  /**
   * The unique environment ID that the SDK uses to retrieve your configuration.
   * This ID is generated when an app configuration is created and published to a given environment.
   * The app is first launched and then the SDK retrieves and uses this Adobe-hosted configuration.
   * {@link https://developer.adobe.com/client-sdks/previous-versions/documentation/mobile-core/configuration/}
   */
  appId?: string;

  /**
   * On Android, instead of providing an `appId` that is used to retrieve the Adobe-hosted configuration,
   * load the configuration from a JSON configuration file in the app's Assets folder.
   *
   * {@link https://developer.adobe.com/client-sdks/home/base/mobile-core/api-reference/#setloglevel}
   * @platform android
   */
  configAsset?: string;

  /**
   * The debugEnabled property allows you to enable or disable debugging using SDK code.
   *
   * @default `false`.
   */
  debugEnabled?: boolean;
}
