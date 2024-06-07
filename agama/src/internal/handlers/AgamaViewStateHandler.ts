import { AgamaStatusCode, AgamaStatusCodeCategory, AgamaViewState } from '../AgamaClient';
import { AbstractAgamaHandler, AgamaViewStateChangeEvent } from './AbstractAgamaHandler';
import { PlayerError, PlayerEventType } from 'react-native-theoplayer';

/**
 * AgamaViewStateHandler monitors the following ViewState-related attributes:
 * - Play-out errors (AgamaViewState.FAILED_);
 * - Stalls during play-out (AgamaViewState.STALLED_);
 * - Start of play-out (AgamaViewState.PLAYING_);
 * - Pausing (AgamaViewState.PAUSED_);
 * - Seeking (AgamaViewState.SEEK_).
 */
export class AgamaViewStateHandler extends AbstractAgamaHandler {
  private _seekingThroughAPI = false;
  private _initialBufferingIsComplete = false;
  private _isSeeking = false;

  startReporting_(): void {
    super.startReporting_();
    this.attachReportingListeners_();
  }

  unload_(): void {
    this.removeReportingListeners_();
    super.unload_();
  }

  private attachReportingListeners_(): void {
    this._player.addEventListener(PlayerEventType.WAITING, this.onWaiting_);
    this._player.addEventListener(PlayerEventType.PAUSE, this.onPaused_);
    this._player.addEventListener(PlayerEventType.PLAYING, this.onPlaying_);
    this._player.addEventListener(PlayerEventType.SEEKING, this.onSeeking_);
    this._player.addEventListener(PlayerEventType.SEEKED, this.onSeeked_);
  }

  private removeReportingListeners_(): void {
    this._player.removeEventListener(PlayerEventType.WAITING, this.onWaiting_);
    this._player.removeEventListener(PlayerEventType.PAUSE, this.onPaused_);
    this._player.removeEventListener(PlayerEventType.PLAYING, this.onPlaying_);
    this._player.removeEventListener(PlayerEventType.SEEKING, this.onSeeking_);
    this._player.removeEventListener(PlayerEventType.SEEKED, this.onSeeked_);
  }

  notifySeekThroughAPI_(): void {
    this._seekingThroughAPI = true;
  }

  notifyError_(error: PlayerError): void {
    const statusCode = new AgamaStatusCode(AgamaStatusCodeCategory.INTERNAL_ERROR_, String(error.errorCode));
    this.reportViewStateExtended_(AgamaViewState.FAILED_, statusCode, error.errorMessage);
  }

  private readonly onWaiting_ = (): void => {
    if (this._initialBufferingIsComplete && !this._isSeeking) {
      this.reportViewStateChanged_(AgamaViewState.STALLED_);
    }
  };

  private readonly onPlaying_ = (): void => {
    if (!this._player.paused) {
      if (!this._initialBufferingIsComplete) {
        this.reportEvent_(new AgamaStatusCode(AgamaStatusCodeCategory.CONTENT_, 'firstFrameDisplayed'), 'now');
      }
      this._initialBufferingIsComplete = true;
      this.reportViewStateChanged_(AgamaViewState.PLAYING_);
    }
  };

  private readonly onPaused_ = (): void => {
    if (this._player.paused) {
      this._initialBufferingIsComplete = true;
      this.reportViewStateChanged_(AgamaViewState.PAUSED_);
    }
  };

  private readonly onSeeking_ = (): void => {
    if (this._seekingThroughAPI) {
      this._isSeeking = true;
      this._seekingThroughAPI = false;
      this.reportViewStateChanged_(AgamaViewState.SEEK_);
    }
  };

  private readonly onSeeked_ = (): void => {
    this._isSeeking = false;
    if (this._player.paused) {
      this.reportViewStateChanged_(AgamaViewState.PAUSED_);
    }
  };

  private reportViewStateChanged_(state: AgamaViewState): void {
    if (this._isReporting) {
      this._agamaClient.viewStateChanged_(state);
      this.dispatchEvent(new AgamaViewStateChangeEvent());
    }
  }

  private reportViewStateExtended_(viewStateType: AgamaViewState, statusCode: AgamaStatusCode, statusMessage: string): void {
    this._agamaClient.viewStateExtended_(viewStateType, statusCode, statusMessage);
    this.dispatchEvent(new AgamaViewStateChangeEvent());
  }

  private reportEvent_(code: AgamaStatusCode, value: string): void {
    this._agamaClient.event_(code, value);
  }
}
