import type { Double } from 'react-native/Libraries/Types/CodegenTypes';
import { AD_TYPES, THEO_EVENTS, READY_STATES } from './Utils';
import type { THEOplayer } from 'react-native-theoplayer';

const MINIMUM_DVR_DURATION = 60;
const LIVE_MARGIN = 10;

/**
 * This abstract class is responsible for filtering appropriate events from THEO
 */
export abstract class TheoBase {
  /**
   * sotres THEOplayer
   * @protected
   * @type {*}
   * @memberof TheoBase
   */
  protected player: any;
  /**
   * array of subscribed listeners
   * @private
   * @type {any[]}
   * @memberof TheoBase
   */
  private listeners: any[] = [];
  /**
   * stores the ad playhead position
   * @private
   * @type {number}
   * @memberof TheoBase
   */
  private adPlayheadPosition?: number;

  /**
   * stores the number of prerolls started
   * @private
   * @type {number}
   * @memberof TheoBase
   */
  protected prerollCount = 0;

  /**
   * stores the number of midRolls started
   * @private
   * @type {number}
   * @memberof TheoBase
   */
  protected midrollCount = 0;

  /**
   * stores the number of postrolls started
   * @private
   * @type {number}
   * @memberof TheoBase
   */
  protected postrollCount = 0;

  /**
   * stores the stream playhead position
   * @private
   * @type {number}
   * @memberof TheoBase
   */
  protected playheadPosition?: number;
  /**
   * stores the actual   duration (no ad duration)
   * @protected
   * @type {number}
   * @memberof TheoBase
   */
  protected playerDuration?: number;
  /**
   * the flag for buffering
   * @private
   * @type {boolean}
   * @memberof TheoBase
   */
  private isBuffering = false;

  /**
   * flag to switch the plugin to report low level buffer state changes,
   * or only report the waiting event.
   * @private
   * @type {boolean}
   * @memberof TheoBase
   */
  private simpleBufferNotifications = true;

  /**
   * the flag for waiting state
   * @private
   * @type {boolean}
   * @memberof TheoBase
   */
  private isWaiting = false;

  /**
   * the flag used to inform to ignore ended after postroll
   * @private
   * @type {boolean}
   * @memberof TheoBase
   */
  protected ignoreEndedAfterPostroll = false;

  /**
   * the flag used to inform to ignore ended after postroll
   * @private
   * @type {boolean}
   * @memberof TheoBase
   */
  private _adsPlaying = false;

  /**
   * the flag used to verify whether the player has fired its first play event
   * @private
   * @type {boolean}
   * @memberof TheoBase
   */
  private _isFirstPlay = true;

  /**
   * the flag used to inform not to call notifyPlay with ContentMetadata
   * After a postroll has ended or after main stream has ended
   * @private
   * @type {boolean}
   * @memberof TheoBase
   */
  protected sendContentPlayOnEnded = false;

  /**
   * Instanciate object and bind internal listeners
   * @param player THEOPlayer instance
   */
  protected constructor(player: THEOplayer) {
    this.player = player;
    this.bindListenersInternal();
    //CVA: this is certainly not something to be done in the integration
    //if needed this needs to be handled at the apliction level
    //this.handleVisibilityChange();
  }

  /**
   * handles changing tab visibility on mobile
   * when the tab is clicked than media by default is paused
   * tough it is not handled by theo properly at the moment
   * this solves the issue
   */
  private handleVisibilityChange() {
    //window.addEventListener('blur', this.player.pause, false);
  }

  /**
   *  Reinitialises some of the boolean values that
   * determine the behavior of this pluging
   */
  private reset() {
    this._isFirstPlay = true;
    this._adsPlaying = false;
    this.sendContentPlayOnEnded = true;
    this.ignoreEndedAfterPostroll = false;
    this.playheadPosition = 0;
    this.adPlayheadPosition = 0;
    this.prerollCount = 0;
    this.midrollCount = 0;
    this.postrollCount = 0;
    this.isBuffering = false;
  }

  /**
   * binds listeners used only internally
   */
  private bindListenersInternal() {
    this.onLoadedData();
    this.onLoadedMetaData();
    this.onTimeUpdate();
  }

  /**
   * Binds all listeners
   * override this method to specify which listeners should be used
   */
  protected abstract bindListeners(): void;

  /**
   * This method should be used to handle source change
   */
  protected abstract notifySourceChange(): void;

  /**
   * This method should be used to notify once the ad starts
   * @param {String} adId ID of ad if exists, otherwise null
   * @param {AD_TYPES} adType type of add: preroll, midroll, postroll
   */
  protected abstract notifyAdBegin(adId: string, adType: string, adObject: any): void;

  /**
   * Tis method should be used to notify once the stream playout ends
   */
  protected abstract notifyEndOfStream(): void;

  /**
   * Tis method should be used to notify once ad ends
   */
  protected abstract notifyAdEnd(adType: string): void;

  /**
   * notifies that buffer starts
   * @param {*} currentTime in sec
   */
  protected abstract notifyBufferStart(currentTime: number): void;

  /**
   * notifies that buffer stops
   * @param {*} currentTime in sec
   */
  protected abstract notifyBufferStop(currentTime: number): void;

  /**
   * notifies play starts
   * @param {*} currentTime in sec
   */
  protected abstract notifyPlay(currentTime: number): void;

  /**
   * notifies pause
   * @param {*} currentTime in sec
   */
  protected abstract notifyPause(currentTime: number): void;

  /**
   * notifies seeking starts
   * @param {*} currentTime in sec
   */
  protected abstract notifySeekStart(currentTime: number): void;

  /**
   * notifies data loaded
   */
  protected abstract notifyDataLoaded(): void;

  /**
   * notifies about rate change
   */
  protected abstract notifyRateChange(rateChange: Double): void;

  protected adsPlaying(): boolean {
    // this sometimes falsely returns true in stead of false upon initial playback
    // return this.player.ads.playing
    // return this.player && this.player.ads.currentAdBreak;
    return this._adsPlaying;
  }

  /**
   * Determines if the content is Linear TV
   */
  protected abstract isLive(): boolean;

  /**
   * used to set actual stream duration
   */
  private onLoadedData() {
    this.addListener(this.player, THEO_EVENTS.LOADED_DATA, (event: any) => {
      const { currentTime, readyState } = event;
      if (!this.adsPlaying() && this.player.duration) {
        this.playerDuration = this.player.duration;
      }
      const notfiredOncePlayoutEnds = currentTime !== this.player.duration;
      // not works for LIVE+DVR
      //const haveEnoughData = readyState === 4;
      //if (haveEnoughData && notfiredOncePlayoutEnds) {
      if (notfiredOncePlayoutEnds) {
        this.notifyDataLoaded();
      }
    });
  }

  /**
   * used to set DVR window
   */
  private onLoadedMetaData() {
    this.addListener(this.player, THEO_EVENTS.LOADED_METADATA, (event: any) => {
      // Do nothing
      // console.log('on loaded metadata')
    });
  }

  /**
   * keeps playhead position separate for ads and stream
   */
  private onTimeUpdate() {
    this.addListener(this.player, THEO_EVENTS.TIME_UPDATE, (event: any) => {
      const { currentTime } = event;
      if (!this.adsPlaying()) {
        this.playheadPosition = currentTime;
        if (currentTime == 0) {
          //console.log('SETTIMG PLAYHEAD to 0');
        }
      } else if (this.adsPlaying() && this.player.currentTime > 0) {
        this.adPlayheadPosition = currentTime;
      }
    });
  }

  /**
   * fired once source change
   */
  protected onSourceChange() {
    this.addListener(this.player, THEO_EVENTS.SOURCE_CHANGE, () => {
      this.reset();
      this.notifySourceChange();
    });
  }

  /**
   * set ad metadata once ad begin
   */
  protected onAdBegin() {
    this.addListener(this.player._player.ads, THEO_EVENTS.AD_BEGIN, (event: any) => {
      // console.log('[THEO AD EVENT] AD BEGIN')
      this.adPlayheadPosition = 0;
      this._adsPlaying = true;

      const adId = (event && event.ad && event.ad.id) || null;
      const adType = this.getAdType();
      const ad = event.ad;

      if (adType === AD_TYPES.PREROLL) {
        this.prerollCount++;
      } else if (adType === AD_TYPES.MIDROLL) {
        this.midrollCount++;
      } else {
        this.postrollCount++;
      }
      this.isBuffering = false;
      this.notifyAdBegin(adId, adType, ad);
    });
  }

  /**
   * notify end of ad
   */
  protected onAdEnds() {
    this.addListener(this.player._player.ads, THEO_EVENTS.AD_END, () => {
      // console.log('[THEO AD EVENT] AD END')
      this._adsPlaying = false;
      const adType = this.getAdType();

      if (adType === AD_TYPES.POSTROLL) {
        this.ignoreEndedAfterPostroll = true;
      }
      this.notifyAdEnd(adType);
      this.adPlayheadPosition = 0;
    });
  }

  /**
   * informs about buffering start and stop
   */
  protected onBuffering() {
    this.addListener(this.player, THEO_EVENTS.READY_STATE_CHANGE, (event: any) => {
      //omit notifying in case playout ends
      //   if (this.player.ended) { // why does this property not exist on the THEOplayer interface?
      //     return;
      //   }
      //buffering starts
      const { readyState, currentTime } = event;
      const { HAVE_NOTHING, HAVE_METADATA, HAVE_CURRENT_DATA, HAVE_FUTURE_DATA, HAVE_ENOUGH_DATA } = READY_STATES;

      if (!this.simpleBufferNotifications) {
        switch (readyState) {
          case HAVE_NOTHING:
          case HAVE_CURRENT_DATA:
          case HAVE_FUTURE_DATA:
            break;
          case HAVE_METADATA:
            this.isBuffering = true;
            if (!this.simpleBufferNotifications) this.notifyBufferStart(currentTime);
            break;
          case HAVE_ENOUGH_DATA:
            this.isBuffering = false;
            if (!this.simpleBufferNotifications) this.notifyBufferStop(currentTime);
            break;

          default:
            break;
        }
      }
    });
  }

  /**
   * handles player waiting event. This event is fired when playback stalls due to
   * an low/empty buffer state.
   * However this event is thrown in various occasions for technical reasons
   * where you may not want to notify the analytics service
   *
   * waiting is thrown on startup, then initialising the source player.paused is then true
   * waiting is thrown when seeking because the buffer is then empty. player.seeking is then true
   * waiting is thrown then the buffer is empty during normal playback player.paused and player seeking are false
   */
  protected onWaiting() {
    this.addListener(this.player, THEO_EVENTS.WAITING, () => {
      this.isWaiting = true;
      //Only notify then buffer is empty during normal playback.
      if (this.simpleBufferNotifications) {
        if (!this.player.seeking && !this.player.paused) {
          //auditel expects
          //this.notifyPause(this.getCurrentTime());
          this.notifyBufferStart(this.getCurrentTime());
        }
      }
    });
  }

  /**
   * handles play events once ad playouts (sinde THEO not fires PLAYING events for ads)
   */
  protected onPlay() {
    this.addListener(this.player, THEO_EVENTS.PLAY, (event: any) => {
      //console.log('Comscore ignoring playevent');
      // handled only once ad plays
      //console.log('[THEOBASE] onPlay');
      if (!this.adsPlaying()) {
        //console.log('[THEOBASE] onPlay return WITHOUT notifyPlay');
        return;
      }
      //console.log('[THEOBASE] onPlay call notifyPlay');
      this.notifyPlay(this.getCurrentTime());
    });
  }

  /**
   * handles playing event
   */
  protected onPlaying() {
    this.addListener(this.player, THEO_EVENTS.PLAYING, (event: any) => {
      //console.log('[THEOBASE] onPlaying');
      if (this.isWaiting) {
        this.isWaiting = false;
        if (this.simpleBufferNotifications) {
          this.notifyBufferStop(this.getCurrentTime());
        }
      }

      if (this.adsPlaying()) {
        //console.log('[THEOBASE] onPlaying return WITHOUT notifyPlay');
        return;
      }
      //console.log('[THEOBASE] onPlayingnpm run call notifyPlay');
      //console.log('NOTIFY PLAY get CURRENT TIME', this.getCurrentTime)
      this.notifyPlay(this.getCurrentTime());
    });
  }

  /**
   * notifies about Pause
   * ignored in case buffering is happening
   */
  protected onPause() {
    this.addListener(this.player, THEO_EVENTS.PAUSE, (event: any) => {
      // THEO fires `pause` also when seeking and on the end of playout
      const firedOncePlayoutEnds = event.currentTime >= this.player.duration;
      if (this.isBuffering || firedOncePlayoutEnds) {
        //console.debug('ignoring pause!');
        return;
      }
      this.notifyPause(this.getCurrentTime());
    });
  }

  /**
   * notifies about Seeking action
   */
  protected onSeeking() {
    this.addListener(this.player, THEO_EVENTS.SEEKING, (event: any) => {
      const { currentTime } = event;
      // omit notifying for the `seeking` event which theo is firing on preroll ends
      if (currentTime === 0) {
        return;
      }
      this.notifySeekStart(this.getCurrentTime());
    });
  }

  /**
   * notifies end of stream
   */
  protected onEnded() {
    this.addListener(this.player, THEO_EVENTS.ENDED, () => {
      this.notifyEndOfStream();
      this.reset();
    });
  }

  /**
   * notities rate change
   */
  protected onRateChange() {
    this.addListener(this.player, THEO_EVENTS.RATE_CHANGE, (event: any) => {
      const { playbackRate } = event;
      this.notifyRateChange(playbackRate);
    });
  }

  /**
   * destroy the object
   */
  public destroy() {
    this.removeListeners();
  }

  /**
   * removes all listeners
   */
  private removeListeners() {
    this.listeners.forEach((listener) => {
      listener.caller.removeEventListener(listener.type, listener.f);
    });
    this.listeners = [];
  }

  /**
   * adds listener to the array
   */
  private addListener(caller: any, type: any, f: any) {
    this.listeners.push({ caller: caller, type: type, f: f });
    caller.addEventListener(type, f);
  }

  /**

     * formats playhead position
     */
  protected getFlooredPlayerPosition() {
    return Math.floor(this.player.currentTime);
  }

  /**

     * determines ad type: preroll, midroll, postroll
     */
  public getAdType() {
    let adType = AD_TYPES.PREROLL;
    if (!this.playheadPosition || !this.playerDuration) return adType;
    if (this.playheadPosition < 0.5) {
      adType = AD_TYPES.PREROLL;
    } else if (this.playheadPosition > this.playerDuration - 1.5) {
      adType = AD_TYPES.POSTROLL;
    } else {
      adType = AD_TYPES.MIDROLL;
    }
    return adType;
  }

  private getSeekable() {
    const seekable = this.player.seekable;
    if (seekable && seekable.length) {
      return seekable;
    }
  }

  /**
   * Check whether the player is playing a DVR live stream.
   * @returns {boolean}
   */
  protected isDVR(): boolean {
    return this.isLive() && this.getDuration() >= MINIMUM_DVR_DURATION;
  }

  /**
   * Check whether the given timestamp is at the live point.
   *
   * @returns {boolean}
   */
  protected isAtLive(): boolean {
    if (this.isLive()) {
      const seekable = this.getSeekable();
      const seekableEnd = seekable[seekable.length - 1].end;
      return seekableEnd - this.player.currentTime < LIVE_MARGIN;
    }
    return false;
  }

  /**
   * The reference time ('zero'), used as base for all time displays.
   * - For VOD: the start of the video (i.e. start of seekable range)
   * - For live: the current live time (i.e. end of seekable range)
   *
   * @returns {number}
   */
  protected getReferenceTime(): number {
    const seekable = this.getSeekable();
    return this.isLive() ? seekable[seekable.length - 1].end : seekable[0].start;
  }

  /**
   * The playable duration.
   * - For VOD: always duration
   * - For live: the size of the DVR window (i.e. difference between start and end of seekable range)
   *
   * @returns {number}
   */
  private getDuration(): number {
    const seekable = this.getSeekable();
    try {
      return seekable[seekable.length - 1].end - seekable[0].start;
    } catch (e) {
      return 0;
    }
  }

  /**
   * determines if stream is Live+DVR
   */
  protected isLiveDVR(): boolean {
    return this.isLive() && this.isDVR();
  }

  /**
   * @returns for Live+DVR -> DVR Window Offset, for non-Live+DVR -> current position
   */
  protected getCurrentTime(): number {
    if (this.adsPlaying()) {
      return this.player.currentTime;
    }

    if (this.isLiveDVR()) {
      if (this.isAtLive()) {
        return 0;
      } else {
        return Math.abs(this.player.currentTime - this.getReferenceTime());
      }
    } else {
      return this.player.currentTime;
    }
  }
}
