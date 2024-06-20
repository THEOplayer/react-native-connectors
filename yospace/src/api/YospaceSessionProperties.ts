/**
 * Provides a means for a client to specify custom properties at session initialisation.
 */
export interface YospaceSessionProperties {

  /**
   * Sets whether to prefetch nonlinear resources defined in the VAST for this advert.
   * Prefetching resources allows the application to use or display the resource as soon
   * as the advert starts without the application having to fetch it first.
   * If the fetch is successful then resource is available from the NonLinearCreative
   * associated with the Advert.
   *
   * The default value is `false`.
   */
  prefetchResources?: boolean;

  /**
   * Sets whether the SDK should fire timeline beacons for adverts that have finished
   * playing out. The SDK will only do this if it receives beacon data for the historical advert
   * while still playing back the ad break in which that advert was defined.
   * A client may choose to disable this feature to prevent analytic beacons being counted
   * as fraudulent by Viewability logic embedded with or used by the client.
   *
   * The default value is `true`.
   */
  fireHistoricalBeacons?: boolean;

  /**
   * Describes whether the SDK should modify all tracking beacons as necessary to use the HTTPS protocol.
   *
   * The default value is `false`.
   */
  applyEncryptedTracking?: boolean;

  /**
   * Sets the maximum distance, in milliseconds, between consecutive ad breaks for them to be considered "back to
   * back".  In this case, the SDK will adjust the start position of the subsequent ad break to match the end position
   * of the preceding ad break.
   *
   * The maximum value used is the segment length of the current stream's content.
   *
   * Default value is 0
   */
  consecutiveBreakTolerance?: number;

  /**
   * Sets the timeout to use when attempting to establish an HTTP connection for session initialisation and CSM
   * polling.  This setting represents the timeout value for the entire request.
   *
   * The default value is 5000ms.
   */
  requestTimeout?: number;

  /**
   * Sets the timeout to use when executing an HTTP request for firing analytics beacons and fetching resources.
   * This setting represents the timeout value for the entire request.
   *
   * The default value is 5000ms.
   */
  resourceTimeout?: number;

  /**
   * Sets the user agent to use when making tracking / analytic calls.
   *
   * The default value is an empty String.
   */
  userAgent?: string;

  /**
   * Sets the user agent to use when initialising a Session by proxy.
   *
   * The default value is an empty String.
   */
  proxyUserAgent?: string;

  /**
   * Set whether to keep the proxy component alive after the master manifest is read.
   * This property is valid only for Live and DVRLive streams.
   */
  keepProxyAlive?: boolean;

  /**
   * Sets the categories of tracking beacons to exclude from analytic suppression.<br/>
   * By default, no categories are set.
   * An OR'ed set of categories to exclude from suppression.
   */
  excludeFromSuppression?: number;

  /**
   * A unique UUID initialisation token used to identify a session
   */
  token?: string;

  /**
   * Sets the custom HTTP headers to be used when sending requests.
   */
  customHttpHeaders?: {[key: string]: string | number};
}
