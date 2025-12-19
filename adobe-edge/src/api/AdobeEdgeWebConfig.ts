export type AutoCollect = 'always' | 'never' | 'decoratedElementsOnly';

export type Context = 'web' | 'device' | 'placeContext' | 'timestamp' | 'highEntropyUserAgentHints';

export type Consent = 'in' | 'out' | 'pending';

export interface AdobeEdgeWebConfig {
  /**
   * The datastreamId property is a string that determines which datastream in Adobe Experience Platform you want
   * to send data to.
   * {@link https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/configure/datastreamid}
   */
  datastreamId: string;

  /**
   * The orgId property is a string that tells Adobe which organization that data is sent to. This property is
   * required for all data sent using the SDK.
   * {@link https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/configure/orgid}
   */
  orgId: string;

  /**
   * The edgeBasePath property alters the destination path when you interact with Adobe services.
   * {@link https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/configure/edgebasepath}
   */
  edgeBasePath: string;

  /**
   * The autoCollectPropositionInteractions property is an optional setting that determines if the SDK automatically
   * collects proposition interactions.
   * {@link https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/configure/autocollectpropositioninteractions}
   */
  autoCollectPropositionInteractions?: {
    /**
     * Adobe Journey Optimizer.
     */
    AJO?: AutoCollect;
    /**
     * Adobe Target.
     */
    TGT?: AutoCollect;
  };

  /**
   * The clickCollection object contains several variables that help you control automatically collected link data.
   * {@link https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/configure/clickcollection}
   */
  clickCollection?: {
    /**
     * Determines if links within the current domain are automatically tracked.
     */
    internalLinkEnabled?: boolean;

    /**
     * Determines if the library tracks links that qualify as downloads based on the downloadLinkQualifier property.
     */
    downloadLinkEnabled?: boolean;

    /**
     * Determines if links to external domains are automatically tracked.
     */
    externalLinkEnabled?: boolean;

    /**
     * Determines if the library waits until the next “page view” event to send link tracking data.
     */
    eventGroupingEnabled?: boolean;

    /**
     * Determines if link tracking data is stored in session storage instead of local variables.
     */
    sessionStorageEnabled?: boolean;

    /**
     * A callback function that provides full controls over link tracking data that you collect.
     */
    filterClickDetails?: (content: object) => void;
  };

  /**
   * The clickCollectionEnabled property is a boolean that determines if the SDK automatically collects link data.
   * {@link https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/configure/clickcollectionenabled}
   *
   * @default `true`.
   */
  clickCollectionEnabled?: boolean;

  /**
   * The context property is an array of strings that determines what the SDK can automatically collect.
   */
  context?: Context[];

  /**
   * The debugEnabled property allows you to enable or disable debugging using SDK code.
   * {@link https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/configure/debugenabled}
   *
   * @default `false`.
   */
  debugEnabled?: boolean;

  /**
   * The defaultConsent property determines how you handle data collection consent before you call the setConsent
   * command.
   * {@link https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/configure/defaultconsent}
   *
   * @default `in`.
   */
  defaultConsent?: Consent;

  /**
   * If you enable automatic link tracking using {@link clickCollectionEnabled}, the downloadLinkQualifier property
   * helps determine the criteria for a URL to be considered a download link.
   * {@link https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/configure/downloadlinkqualifier}
   *
   * @default `'\.(exe|zip|wav|mp3|mov|mpg|avi|wmv|pdf|doc|docx|xls|xlsx|ppt|pptx)$'`.
   */
  downloadLinkQualifier?: string;

  /**
   * The edgeConfigOverrides object allows you to override configuration settings for commands run on the current page.
   * {@link https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/configure/edgeconfigoverrides}
   */
  edgeConfigOverrides?: object;

  /**
   * The edgeDomain property allows you to change the domain where the SDK sends data.
   * {@link https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/configure/edgedomain}
   *
   * @default `'edge.adobedc.net'`.
   */
  edgeDomain?: string;

  /**
   * The idMigrationEnabled property allows the SDK to read AMCV cookies set by previous Adobe Experience Cloud
   * implementations.
   * {@link https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/configure/idmigrationenabled}
   *
   * @default `true`.
   */
  idMigrationEnabled?: boolean;

  /**
   * The onBeforeEventSend callback allows you to register a JavaScript function that can alter the data you send just
   * before that data is sent to Adobe.
   * {@link https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/configure/onbeforeeventsend}
   */
  onBeforeEventSend?: (content: object) => void;

  /**
   * The prehidingStyle property allows you to define a CSS selector to hide personalized content until it loads.
   * {@link https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/configure/prehidingstyle}
   */
  prehidingStyle?: string;

  /**
   * The pushNotifications property lets you configure push notifications for web applications.
   * {@link https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/configure/pushnotifications}
   */
  pushNotifications?: {
    /**
     * The VAPID public key used for push subscriptions. Must be a Base64-encoded string.
     */
    vapidPublicKey: string;

    /**
     * The application ID associated with the VAPID public key.
     */
    applicationId: string;

    /**
     * The system dataset ID used for push notification tracking.
     */
    trackingDatasetId: string;
  };

  /**
   * The streamingMedia component helps you collect data related to media sessions on your website.
   *{@link https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/configure/streamingmedia}
   */
  streamingMedia?: {
    /**
     * The name of the channel where streaming media collection occurs.
     */
    channel?: string;

    /**
     * The name of the media player.
     */
    playerName?: string;

    /**
     * The version of the media player application.
     */
    appVersion?: string;

    /**
     * Frequency of pings for main content, in seconds.
     *
     * @default `10`.
     */
    mainPingInterval?: number;

    /**
     * Frequency of pings for ad content, in seconds.
     *
     * @default `10`.
     */
    adPingInterval?: number;
  };

  /**
   * The targetMigrationEnabled property is a boolean that allows the SDK to read and write the mbox and
   * mboxEdgeCluster cookies that the Adobe Target 1.x and 2.x libraries use.
   * {@link https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/configure/targetmigrationenabled}
   *
   * @default `false`.
   */
  targetMigrationEnabled?: boolean;

  /**
   * The thirdPartyCookiesEnabled property is a boolean that determines if the SDK sets cookies in a third-party
   * context.
   * {@link https://experienceleague.adobe.com/en/docs/experience-platform/collection/js/commands/configure/thirdpartycookiesenabled}
   *
   * @default `true`.
   */
  thirdPartyCookiesEnabled?: boolean;
}
