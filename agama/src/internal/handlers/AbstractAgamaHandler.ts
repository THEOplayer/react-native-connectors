import type { AgamaClient } from '../AgamaClient';
import { AgamaClientEventType } from '../AgamaClientEvent';
import type { THEOplayer } from 'react-native-theoplayer';
import { DefaultEventDispatcher } from '../event/DefaultEventDispatcher';
import { BaseEvent } from '../event/BaseEvent';

export enum AgamaHandlerEventType {
  VIEWSTATE_CHANGE = 'agamaviewstatechange_',
}

export interface AgamaHandlerEventMap {
  [AgamaHandlerEventType.VIEWSTATE_CHANGE]: AgamaViewStateChangeEvent;
}

export class AgamaViewStateChangeEvent extends BaseEvent<AgamaHandlerEventType.VIEWSTATE_CHANGE> {
  constructor() {
    super(AgamaHandlerEventType.VIEWSTATE_CHANGE);
  }
}

export abstract class AbstractAgamaHandler extends DefaultEventDispatcher<AgamaHandlerEventMap> {
  protected _isReporting = false;

  constructor(
    protected _player: THEOplayer,
    protected _agamaClient: AgamaClient,
  ) {
    super();
    this._agamaClient.addEventListener(AgamaClientEventType.PAUSE, this.pauseReporting_);
    this._agamaClient.addEventListener(AgamaClientEventType.RESUME, this.resumeReporting_);
  }

  protected startReporting_(): void {
    this._isReporting = true;
  }

  protected beforePauseReporting_(): void {
    return;
  }

  private readonly pauseReporting_ = (): void => {
    this.beforePauseReporting_();
    this._isReporting = false;
  };

  private readonly resumeReporting_ = (): void => {
    this._isReporting = true;
  };

  unload_(): void {
    this._isReporting = false;
    this._agamaClient.removeEventListener(AgamaClientEventType.PAUSE, this.pauseReporting_);
    this._agamaClient.removeEventListener(AgamaClientEventType.RESUME, this.resumeReporting_);
  }

  protected isVod_(): boolean {
    return isFinite(this._player.duration);
  }
}
