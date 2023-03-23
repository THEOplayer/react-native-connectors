import { TheoBase } from './TheoBase';
import { ComscoreAPI } from '../comscore/ComscoreAPI';
import type { ContentMetadata } from '../comscore/ContentMetadata';
import { AdMetadata } from '../comscore/AdMetadata';
import { AD_TYPES } from '../enums';
import type { RaiSkeletonAPI } from '../comscore/SkeletonApi';

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
   * @param implementationId, If Comscore provided you with an Implementation ID for your implementation, Comscore API: sa.setImplementationId( "1234567890" )
   * @param projectId If Comscore provided you with an Project ID for your implementation, Comscore API: sa.setProjectId( "1234567890" )
   * @param playerName If Comscore instructed you to identify your players by name and version, Comscore API: sa.setMediaPlayerName( "My Player" )
   * @param playerVersion If Comscore instructed you to identify your players by name and version, Comscore API: sa.setMediaPlayerVersion( "1.2.3-a5f72c" )
   * @param skeleton If supplied PlatformAPI is set to Skeleton and Comscore will fetch certain values from this skeleton object for reporting. If undefined PlatformApi is set To WebBrowser
   */
  constructor(
    c2: string,
    player,
    contentMetada: ContentMetadata,
    adMetadata: AdMetadata,
    implementationId: string = null,
    projectId: string = null,
    playerName: string = null,
    playerVersion: string = null,
    skeleton: RaiSkeletonAPI | undefined = undefined
  ) {
    super(player);
    if (contentMetada) {
      this.contentMetada = contentMetada;
    } else {
      throw new Error('contentMetada parameter is mandatory!');
    }
    this.adMetadata = adMetadata || new AdMetadata();
    this.comscore = new ComscoreAPI(
      c2,
      implementationId,
      projectId,
      playerName,
      playerVersion,
      skeleton
    );
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
      const start = this.player.seekable.start(0);
      const end = this.player.seekable.end(0);
      const dvrSize = end - start;
      this.comscore.setDvrWindowLength(dvrSize);
    }

    this.contentMetada.setLength(
      Math.round(this.playerDuration * 1000),
      this.isLive()
    );
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

  private static INTEGRATION_THEO = 'theo';
  private static INTEGRATION_GOOGLE = 'google-ima';
  private static ADSYSTEM_GOOGLE = 'GDFP';
  private static DEFAULT_CUSV = '-1';
  private static ERROR_CUSV = '-2';
  private static CUSV_REGEX = /^[a-z]{6}\w{7}[a-z]$/i;
  private static MUST_ENFORCE_CUSV_FORMAT = false;

  // Format of the CUSV code
  // should be 14 long starting with 6 letters and ending with 1 letter
  // The rule for extracting the CUSV code is the following:
  // if Adsystem is GDPF  return the creativeId, no validation needed
  // else return the univeralAdID
  // UniversalAdID MUST ALLWAYS adhere to the CUSV_REGEX
  // in case of multiple UniversalAdID return the first that matches CUSV_REGEX
  // if NO universalAdID return -1, if NO MATCHES return - 2

  /**
   * finds the id code related to the CUSV
   * guidelines according to auditel.
   * @param ad the ad object
   */
  protected findCUSVCode(ad) {
    //CHECK FOR THEO Ad integration and version
    //AFTER V.2.89.0 creativeId only exists after 2.89.0
    if (ad.integration === ComscoreTheo.INTEGRATION_THEO && ad.creativeId) {
      //IF integration is theo ads and adsystem == 'GDPF' return creative id
      if (ad.adSystem === ComscoreTheo.ADSYSTEM_GOOGLE) {
        return ad.creativeId ?? ComscoreTheo.DEFAULT_CUSV;
      }

      //else adsystem is not GDPF return the universalAdId which matches the regex
      else {
        const uids = ad.universalAdIds;
        const matches = uids.filter((u) =>
          ComscoreTheo.CUSV_REGEX.test(u.adIdValue)
        );
        return matches.length > 0
          ? matches[0].adIdValue
          : ComscoreTheo.ERROR_CUSV;
      }
    }

    //CHECK FOR GOOGLE IMA AFTER THEO V.2.89.0
    //IF ima intagration after 2.89.0 retrurn creativeId
    else if (
      ad.integration === ComscoreTheo.INTEGRATION_GOOGLE &&
      ad.adSystem &&
      !ad.imaAd
    ) {
      if (ad.adSystem == ComscoreTheo.ADSYSTEM_GOOGLE) {
        return ad.creativeId ? ad.creativeId : ComscoreTheo.DEFAULT_CUSV;
      } else {
        const uids = ad.universalAdIds;
        const matches = uids.filter((u) => {
          console.log(u.adIdValue);
          return ComscoreTheo.CUSV_REGEX.test(u.adIdValue);
        });
        return matches.length > 0
          ? matches[0].adIdValue
          : ComscoreTheo.ERROR_CUSV;
      }
    }

    //FALL BACK TO Earlier RAI IMA IMPLEMENTATION
    //PRIOR TO V.2.89.0  NEEDS ad.imaAd object
    else if (ad && ad.imaAd) {
      if (ad.adSystem === ComscoreTheo.ADSYSTEM_GOOGLE) {
        return ad.imaAd.getCreativeId();
      } else {
        const uids = ad.imaAd.getUniversalAdIds();
        const matches = uids.filter((u) =>
          ComscoreTheo.CUSV_REGEX.test(u.getAdIdValue())
        );
        return matches.length > 0
          ? matches[0].getAdIdValue()
          : ComscoreTheo.ERROR_CUSV;
      }
    }

    //If everything else fails return the default CUSV
    return ComscoreTheo.DEFAULT_CUSV;
  }

  protected isFirstAdInBreak(adType) {
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

  protected isLastAdInBreak(adType) {
    const adsInCurrentBreak = this.player.ads.currentAdBreak.ads.length;
    if (adType === AD_TYPES.PREROLL) {
      return adsInCurrentBreak == this.prerollCount;
    }

    if (adType === AD_TYPES.MIDROLL) {
      return adsInCurrentBreak == this.midrollCount;
    }

    // AD_TYPES.POSTROLL
    return adsInCurrentBreak == this.postrollCount;
  }

  /**
   * set ad metadata once ad begin
   */
  protected notifyAdBegin(adId, adType, ad) {
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
    const uniqueId = this.findCUSVCode(ad);
    console.log('cusv', uniqueId);
    this.adMetadata.setId(uniqueId);
    //this must be in ms
    this.adMetadata.setLength(this.player.duration * 1000);
    //This is a bug in live , we need to check whether the
    // contentMediaType is of type LIVE rather than verifying the player.duration
    // this.adMetadata.setMediaType(adType, this.isLive());
    this.adMetadata.setMediaType(
      adType,
      this.contentMetada.isLiveContentMediaType()
    );
    this.adMetadata.setRelatedContentMetadata(this.contentMetada);
    //console.log('[SETTING ADMETADATA]');
    this.comscore.setMetadata(this.adMetadata.getAdContentMetadata());
    this.notifyPlay(this.player.currentTime);
  }

  protected notifyAdEnd(adType) {
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

  protected notifyBufferStart(currentTime) {
    const currentTimeInMs = this.changeCurrentTimeToMs(currentTime);
    this.comscore.notifyBufferStart(currentTimeInMs);
  }

  protected notifyBufferStop(currentTime) {
    const currentTimeInMs = this.changeCurrentTimeToMs(currentTime);
    this.comscore.notifyBufferStop(currentTimeInMs);
  }

  protected notifyPlay(currentTime) {
    //console.log('[ComscoreTHEO] notifyPlay currentTime:', currentTime);
    const currentTimeInMs = this.changeCurrentTimeToMs(currentTime);
    //console.log('[ComscoreTHEO] comscore.notifyPlay currentTime:',currentTimeInMs);
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

  protected logDebug(message) {
    if (globalThis.__DEBUG__) {
      console.debug(message);
    }
  }

  /**
   * converts current time to rounded ms
   * @param {Float} currentTime current time in sec
   */
  private changeCurrentTimeToMs(currentTime) {
    return Math.floor(currentTime * 1000);
  }
}
