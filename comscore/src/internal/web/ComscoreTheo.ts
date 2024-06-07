import { TheoBase } from './TheoBase';
import { ComscoreAPI } from './ComscoreAPI';
import type { ContentMetadata } from './ComscoreContentMetadata';
import { AdMetadata } from './ComscoreAdMetadata';
import { AD_TYPES } from './Utils';
import type { CustomSkeletonAPI } from './SkeletonApi';
import type { AdBreak, THEOplayer, Ad } from 'react-native-theoplayer';

/**
 * Comscore theo analytics integration
 */
export class ComscoreTheo extends TheoBase {
  /**
   * ComscoreAPI
   * @private
   * @type {ComscoreAPI}
   * @memberof ComscoreTheo
   */
  private comscore: ComscoreAPI;
  /**
   * ContentMetadata
   * @private
   * @type {ContentMetadata}
   * @memberof ComscoreTheo
   */
  private contentMetada: ContentMetadata;
  /**
   * AdMetadata
   * @private
   * @type {AdMetadata}
   * @memberof ComscoreTheo
   */
  private adMetadata: AdMetadata;

  /**
   * @param c2 Publisher ID value. The Publisher ID is often also referred to as the Client ID or c2 value, Comscore API: setPublisherId
   * @param player THEOplayer instance
   * @param contentMetada content metadata
   * @param adMetadata ad metadata
   * @param usagePropertiesAutoUpdateMode Indicates whether usage should be tracked when in foreground only, when back- and foreground or never, Comscore API: analytics.configuration.setUsagePropertiesAutoUpdateMode(0)
   * @param implementationId If Comscore provided you with an Implementation ID for your implementation, Comscore API: sa.setImplementationId( "1234567890" )
   * @param projectId If Comscore provided you with a Project ID for your implementation, Comscore API: sa.setProjectId( "1234567890" )
   * @param playerName If Comscore instructed you to identify your players by name and version, Comscore API: sa.setMediaPlayerName( "My Player" )
   * @param playerVersion If Comscore instructed you to identify your players by name and version, Comscore API: sa.setMediaPlayerVersion( "1.2.3-a5f72c" )
   * @param skeleton If supplied PlatformAPI is set to Skeleton and Comscore will fetch certain values from this skeleton object for reporting. If undefined PlatformApi is set To WebBrowser
   */
  constructor(
    c2: string,
    player: THEOplayer,
    contentMetada: ContentMetadata,
    adMetadata: AdMetadata,
    usagePropertiesAutoUpdateMode: string = null,
    implementationId: string = null,
    projectId: string = null,
    playerName: string = null,
    playerVersion: string = null,
    skeleton: CustomSkeletonAPI | undefined = undefined,
  ) {
    super(player);
    if (contentMetada) {
      this.contentMetada = contentMetada;
    } else {
      throw new Error('contentMetada parameter is mandatory!');
    }
    this.adMetadata = adMetadata || new AdMetadata();
    this.comscore = new ComscoreAPI(c2, implementationId, projectId, playerName, playerVersion, usagePropertiesAutoUpdateMode, skeleton);
    this.bindListeners();
  }

  /**
   * Sets content metadata
   * @param contentMetada
   */
  public setContentMetadata(contentMetada: ContentMetadata) {
    this.contentMetada = contentMetada;
  }

  /**
   * Sets ad metadata
   * @param adMetadata
   */
  public setAdMetadata(adMetadata: AdMetadata) {
    this.adMetadata = adMetadata;
  }

  /**
   * specifies which listeners are used
   */
  protected bindListeners() {
    this.onSourceChange();
    // TODO what's up met die ads adapter?
    this.onAdBegin();
    this.onAdEnds();
    this.onBuffering();
    this.onPause();
    this.onPlay();
    this.onPlaying();
    this.onSeeking();
    this.onEnded();
    this.onRateChange();
    this.onWaiting();
  }

  /**
   * Determines if the content is Linear TV
   */
  protected isLive(): boolean {
    // return this.player.duration == Infinity;
    return this.contentMetada.isLiveContentMediaType();
  }

  /**
   * hanldes `loadeddata` event
   */
  protected notifyDataLoaded() {
    if (!this.adsPlaying() && this.isLiveDVR()) {
      const start = this.player.seekable[0].start;
      const end = this.player.seekable[0].end;
      const dvrSize = end - start;
      this.comscore.setDvrWindowLength(dvrSize);
    }

    this.contentMetada.setLength(Math.round(this.playerDuration), this.isLive());
    this.comscore.setMediaType(this.isLiveDVR());
  }

  /**
   * handles `sourcechange` event
   */
  protected notifySourceChange() {
    this.comscore.createPlaybackSession();
    // the player has currently loaded the content
    //console.log('[SETTING ContentMetadata]');
    this.comscore.setMetadata(this.contentMetada.getContentMetadata());
    this.comscore.setMediaType(this.contentMetada.isLiveContentMediaType());
  }

  protected isFirstAdInBreak(adType: string) {
    if (adType === AD_TYPES.PREROLL) {
      return this.prerollCount == 1;
    }

    if (adType === AD_TYPES.MIDROLL) {
      return this.midrollCount == 1;
    }

    if (adType === AD_TYPES.POSTROLL) {
      return this.postrollCount == 1;
    }
    return false;
  }

  protected async isLastAdInBreak(adType: string) {
    const currentAdBreak: AdBreak = await this.player.ads.currentAdBreak();
    const adsInCurrentBreak = currentAdBreak.ads.length;
    if (adType === AD_TYPES.PREROLL) {
      return adsInCurrentBreak == this.prerollCount;
    }

    if (adType === AD_TYPES.MIDROLL) {
      return adsInCurrentBreak == this.midrollCount;
    }

    if (adType === AD_TYPES.POSTROLL) {
      return adsInCurrentBreak == this.postrollCount;
    }
    return false;
  }

  /**
   * set ad metadata once ad begin
   */
  protected notifyAdBegin(adId: string, adType: string, ad: Ad) {
    if (adType === AD_TYPES.PREROLL) {
      // console.log('[ADBEGIN] FIRST PREROLL:');
    }
    //if ad is the first midroll or first postroll send
    //and end revent for the main content stream.
    else if (this.isFirstAdInBreak(adType)) {
      this.comscore.notifyEnd();
    }

    if (adType === AD_TYPES.POSTROLL) {
      this.ignoreEndedAfterPostroll = true;
    }

    //must CREATE new admetada instance
    this.adMetadata = AdMetadata.clone(this.adMetadata);

    // the player has currently loaded the advertisement
    //for documentation on how the cUSV code is validated
    //refer to the docs in the libs folder
    const uniqueId = ad.id;
    this.adMetadata.setId(uniqueId);
    //this must be in ms
    this.adMetadata.setLength(this.player.duration);
    //This is a bug in live , we need to check whether the
    // contentMediaType is of type LIVE rather than verifying the player.duration
    // this.adMetadata.setMediaType(adType, this.isLive());
    this.adMetadata.setMediaType(adType, this.contentMetada.isLiveContentMediaType());
    this.adMetadata.setRelatedContentMetadata(this.contentMetada);
    //console.log('[SETTING ADMETADATA]');
    this.comscore.setMetadata(this.adMetadata.getAdContentMetadata());
    this.notifyPlay(this.player.currentTime);
  }

  protected notifyAdEnd(adType: string) {
    this.comscore.notifyEnd();

    //If the ended ad is the last ad of a preroll or midroll break
    //send the play event for the main content
    if (adType !== AD_TYPES.POSTROLL && this.isLastAdInBreak(adType)) {
      this.contentMetada.setContentLength(this.contentMetada.mainContentLength);
      this.comscore.setMetadata(this.contentMetada.getContentMetadata());
      this.contentMetada.setContentLength(this.contentMetada.mainContentLength);
      this.notifyPlay(this.playheadPosition);
    }
  }

  protected notifyEndOfStream() {
    if (!this.ignoreEndedAfterPostroll) {
      this.comscore.notifyEnd();
    }
  }

  protected notifyBufferStart(currentTimeInMs: number) {
    this.comscore.notifyBufferStart(currentTimeInMs);
  }

  protected notifyBufferStop(currentTimeInMs: number) {
    this.comscore.notifyBufferStop(currentTimeInMs);
  }

  protected notifyPlay(currentTimeInMs: number) {
    //console.log('[ComscoreTHEO] notifyPlay currentTime:', currentTimeInMs);
    this.comscore.notifyPlay(currentTimeInMs);
  }

  protected notifyPause() {
    this.comscore.notifyPause();
  }

  protected notifySeekStart() {
    this.comscore.notifySeekStart();
  }

  protected notifyRateChange(rateChange: any) {
    this.comscore.notifyChangePlaybackRate(rateChange);
  }

  protected notifyStopped() {
    this.comscore.notifyEnd();
  }
}
