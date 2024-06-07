import * as analytics from './sdk/comscore';
import type { CustomSkeletonAPI } from './SkeletonApi';
import { logDebug } from './Utils';

/**
 * Bridge to ComscoreAPI
 */
export class ComscoreAPI {
  /**
   * stores Analytics
   * @private
   * @type {*}
   * @memberof ComscoreAPI
   */
  private analytics: any;
  /**
   * stores StreamingAnalytics
   * @private
   * @type {*}
   * @memberof ComscoreAPI
   */
  private streamingAnalytics: any;
  /**
   * specifies if content is LIVE+DVR
   * @private
   * @type {boolean}
   * @memberof ComscoreAPI
   */
  private isDvr?: boolean;

  /**
   * specifies if skeleton library needs to be used
   * @private
   * @type {boolean}
   * @memberof ComscoreAPI
   */
  private useSkeletonApi?: boolean;

  /**
   * specifies the skeleton implementation
   * @private
   * @type {boolean}
   * @memberof ComscoreAPI
   */
  private skeletonInterface?: CustomSkeletonAPI;

  /**
   * @param publisherId Publisher ID value. The Publisher ID is often also referred to as the Client ID or c2 value, Comscore API: setPublisherId
   * @param implementationId If Comscore provided you with an Implementation ID for your implementation, Comscore API: sa.setImplementationId( "1234567890" )
   * @param projectId If Comscore provided you with an Project ID for your implementation, Comscore API: sa.setProjectId( "1234567890" )
   * @param playerName If Comscore instructed you to identify your players by name and version, Comscore API: sa.setMediaPlayerName( "My Player" )
   * @param playerVersion If Comscore instructed you to identify your players by name and version, Comscore API: sa.setMediaPlayerVersion( "1.2.3-a5f72c" )
   * @param usagePropertiesAutoUpdateMode Indicates whether usage should be tracked when in foreground only, when back- and foreground or never, Comscore API: analytics.configuration.setUsagePropertiesAutoUpdateMode(0)
   */
  constructor(
    publisherId: string,
    implementationId: string,
    projectId: string,
    playerName: string,
    playerVersion: string,
    usagePropertiesAutoUpdateMode: string | undefined,
    skeleton: CustomSkeletonAPI | undefined,
  ) {
    if (!publisherId) {
      throw new Error('publisherId is mandatory parameter!');
    }
    // analytics = (window as any).ns_.analytics;

    this.setupLibrary(publisherId, usagePropertiesAutoUpdateMode);
    this.setStreamingAnalytics(implementationId, projectId, playerName, playerVersion);
  }

  /**
   * setups library
   * see Comscore_Library-JavaScript-Implementation_Guide-International.pdf
   * @param {String} publisherId  Publisher ID value. The Publisher ID is often also referred to as the Client ID or c2 value.
   * @param {String} usagePropertiesAutoUpdateMode Indicates whether usage should be tracked when in foreground only, when back- and foreground or never.
   */
  setupLibrary(publisherId: string, usagePropertiesAutoUpdateMode: string) {
    this.setPlatformAPI();
    this.configurePublisher(publisherId);
    this.configureUsagePropertiesAutoUpdateMode(usagePropertiesAutoUpdateMode);
    this.startsLibrary();
  }

  /**
   * Sets the correct PlatformAPI
   * PC and Mobile web browsers (this is the default) analytics.PlatformApi.PlatformApis.WebBrowse, Comscore API: setPlatformAPI
   */
  setPlatformAPI() {
    if (this.skeletonInterface) {
      analytics.PlatformApi.setPlatformAPI(analytics.PlatformAPIs.Skeleton, this.skeletonInterface);
      logDebug('API - setPlatformAPI Skeleton');
    } else {
      analytics.PlatformApi.setPlatformAPI(analytics.PlatformAPIs.WebBrowser);
      logDebug('API - setPlatformAPI WebBrowser');
    }
  }

  /**
   * applies Publisher Configuration Settings
   * @param {String} publisherId
   */
  configurePublisher(publisherId: string) {
    const config = new analytics.configuration.PublisherConfiguration({
      publisherId,
    });
    analytics.configuration.addClient(config);
    logDebug('API - configurePublisher ', config);
  }

  /**
   * Configures the application tracking to send usage data when the app is in foreground only, in back- and foreground or never.
   *
   * @param mode
   */
  configureUsagePropertiesAutoUpdateMode(mode: string) {
    logDebug('API - setUsagePropertiesAutoUpdateMode to', mode);
    switch (mode) {
      case 'foregroundOnly':
        analytics.configuration.setUsagePropertiesAutoUpdateMode(analytics.configuration.UsagePropertiesAutoUpdateMode.FOREGROUND_ONLY);
        break;
      case 'foregroundAndBackground':
        analytics.configuration.setUsagePropertiesAutoUpdateMode(analytics.configuration.UsagePropertiesAutoUpdateMode.FOREGROUND_AND_BACKGROUND);
        break;
      case 'disabled':
        analytics.configuration.setUsagePropertiesAutoUpdateMode(analytics.configuration.UsagePropertiesAutoUpdateMode.DISABLED);
        break;
      default:
        analytics.configuration.setUsagePropertiesAutoUpdateMode(analytics.configuration.UsagePropertiesAutoUpdateMode.FOREGROUND_ONLY);
    }
  }

  /**
   * starts the library
   */
  startsLibrary() {
    analytics.start();
    logDebug('API - startsLibrary');
  }

  /**
   * creates an instance of the analytics.StreamingAnalytics class from the comScore library
   * @param implementationId If Comscore provided you with an Implementation ID for your implementation, Comscore API: sa.setImplementationId( "1234567890" )
   * @param projectId If Comscore provided you with an Project ID for your implementation, Comscore API: sa.setProjectId( "1234567890" )
   * @param playerName If Comscore instructed you to identify your players by name and version, Comscore API: sa.setMediaPlayerName( "My Player" )
   * @param playerVersion If Comscore instructed you to identify your players by name and version, Comscore API: sa.setMediaPlayerVersion( "1.2.3-a5f72c" )
   */
  setStreamingAnalytics(implementationId: string, projectId: string, playerName: string, playerVersion: string) {
    this.streamingAnalytics = new analytics.StreamingAnalytics();
    if (implementationId) {
      this.setImplementationId(implementationId);
    }
    if (playerName && playerVersion) {
      this.setMediaPlayerName(playerName, playerVersion);
    }
    if (projectId) {
      this.setProjectId(projectId);
    }
  }

  /**
   * If Comscore provided you with an Implementation ID for your implementation, then please specify this ID as a String value:
   * @param implementationId String
   */
  setImplementationId(implementationId: string) {
    this.streamingAnalytics.setImplementationId(implementationId);
  }

  /**
   * If Comscore provided you with an Project ID for your implementation, then please specify this ID as a String value:
   * @param projectId String
   */
  setProjectId(projectId: string) {
    this.streamingAnalytics.setProjectId(projectId);
  }

  /**
   * If Comscore instructed you to identify your players by name and version, then please specify these as String values:
   * @param playerName
   * @param playerVersion
   */
  setMediaPlayerName(playerName: string, playerVersion: string) {
    this.streamingAnalytics.setMediaPlayerName(playerName);
    this.streamingAnalytics.setMediaPlayerVersion(playerVersion);
  }

  /**
   * creates playback session
   * fired when your player loads content for playback — or the first time your player loads an advertisement related to that content
   */
  createPlaybackSession() {
    this.streamingAnalytics.createPlaybackSession();
    logDebug('API - createPlaybackSession');
  }

  /**
   * determines if the content is Live+DVR or not
   * @param isDvr determines if the content is Live+DVR or not
   */
  setMediaType(isDvr: boolean) {
    this.isDvr = isDvr;
    logDebug('API - internal setMediaType: ' + isDvr);
  }

  /**
   * sets content metadata
   * @param {analytics.StreamingAnalytics.ContentMetadata} cm
   */
  setMetadata(cm: any) {
    this.streamingAnalytics.setMetadata(cm);
    logDebug('API - setMetadata ', cm);
  }

  /**
   * Indicates the player has started buffering streaming data and the player is currently not playing.
   * You can call this method when buffering occurs prior to the start of playback as well as when buffering occurs during playback.
   * @param {Number} position a positive integer Number value representing the Playback Position in milliseconds
   */
  notifyBufferStart(position: number) {
    this.markPosition(position);
    this.streamingAnalytics.notifyBufferStart();
    logDebug('API - notifyBufferStart ', position);
  }

  /**
   * Indicates the player has finished buffering streaming data.
   * You can call this method whenever you have previously called notifyBufferStart() to indicate buffering has finished.
   * @param {Number} position a positive integer Number value representing the Playback Position in milliseconds
   */
  notifyBufferStop(position: number) {
    this.markPosition(position);
    this.streamingAnalytics.notifyBufferStop();
    logDebug('API - notifyBufferStop ', position);
  }

  /**
   * Indicates playback has
   * - started
   * - resumed after pausing
   * - continued after seeking
   * @param {Number} position a positive integer Number value representing the Playback Position in milliseconds
   */
  notifyPlay(position: number) {
    this.markPosition(position);
    this.streamingAnalytics.notifyPlay();
    logDebug('API - notifyPlay ', position);
  }

  /**
   * Indicates playback is paused and the player is currently not playing.
   */
  notifyPause() {
    this.streamingAnalytics.notifyPause();
    logDebug('API - notifyPause');
  }

  /**
   * Indicates playback has ended
   * You typically call this method in the following cases:
   * - Playback naturally reaches the end of the content or advertisement
   * - The user interacts with the player, causing the player to go to an idle state
   * - Playback of the current asset ends because the player needs to change media,
   * for example to load an advertisement for a mid-roll ad break or go back to the content after a mid-roll ad break.
   * - The player encountered a fatal error during playback, pausing, seeking or buffering and playback cannot continue
   */
  notifyEnd() {
    this.streamingAnalytics.notifyEnd();
    logDebug('API - notifyEnd');
  }

  /**
   * Indicates the player has started seeking
   */
  notifySeekStart() {
    this.streamingAnalytics.notifySeekStart();
    logDebug('API - notifySeekStart');
  }

  /**
   * Indicates the current DVR Window Length is known or has changed.
   * @param {Int16Array} length  positive integer Number value representing the length in milliseconds
   */
  setDvrWindowLength(length: number) {
    this.streamingAnalytics.setDvrWindowLength(length);
    logDebug('API - setDvrWindowLength ', length);
  }

  /**
   * depending if the content is Live+DVR or not uses proper method for marking position
   * @param position
   */
  markPosition(position: number) {
    const positionFloor = Math.floor(position);
    if (this.isDvr) {
      this.startFromDvrWindowOffset(positionFloor);
    } else {
      this.startFromPosition(positionFloor);
    }
  }

  /**
   * Any non-Live+DVR position change
   * Indicates the Playback Position where playback will start or resume next
   * @param {Int16Array} position a positive integer Number value representing the Playback Position in milliseconds
   */
  startFromPosition(position: number) {
    this.streamingAnalytics.startFromPosition(position);
    logDebug('API - startFromPosition ', position);
  }

  /**
   * DVR Window Offset change
   * Indicates the current DVR Window Offset is known or has changed.
   * @param {Int16Array} position a positive integer Number value representing the DVR Window Offset in milliseconds
   */
  startFromDvrWindowOffset(position: number) {
    this.streamingAnalytics.startFromDvrWindowOffset(position);
    logDebug('API - startFromDvrWindowOffset ', position);
  }

  /**
   * Playback rate changes
   * @param {Float32Array} rate The playback rate is expressed as a float Number value
   * If your player resets its playback rate when media changes, then please make sure to include a notification method call to indicate the reset.
   */
  notifyChangePlaybackRate(rate: Float32Array) {
    this.streamingAnalytics.notifyChangePlaybackRate(rate);
    logDebug('API - notifyChangePlaybackRate ', rate);
  }
}
