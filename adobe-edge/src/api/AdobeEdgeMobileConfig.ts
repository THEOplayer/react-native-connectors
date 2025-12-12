export interface AdobeEdgeMobileConfig {
  /**
   * The unique environment ID that the SDK uses to retrieve your configuration.
   * This ID is generated when an app configuration is created and published to a given environment.
   * The app is first launched and then the SDK retrieves and uses this Adobe-hosted configuration.
   * {@link https://developer.adobe.com/client-sdks/edge/media-for-edge-network/#initialize-adobe-experience-platform-sdk-with-media-for-edge-network-extension}
   */
  environmentId?: string;

  /**
   * The debugEnabled property allows you to enable or disable debugging using SDK code.
   *
   * @default `false`.
   */
  debugEnabled?: boolean;
}
