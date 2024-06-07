import { AgamaViewStateHandler } from './AgamaViewStateHandler';
import { AgamaSessionMetadataHandler } from './AgamaSessionMetadataHandler';
import { AgamaMeasurementHandler } from './AgamaMeasurementHandler';
import type { AgamaClient } from '../AgamaClient';
import { getAgamaPlayerConfiguration, getAgamaSourceConfiguration } from '../AgamaUtils';
import type { CastEvent, ErrorEvent, THEOplayer } from 'react-native-theoplayer';
import { CastEventType, CastState, PlayerError, PlayerEventType } from 'react-native-theoplayer';
import type { AgamaConfiguration } from '../../api/AgamaConfiguration';
import { AgamaHandlerEventType } from './AbstractAgamaHandler';
import { currentSource } from '../utils/SourceDescriptionUtils';
import type { AgamaSourceConfiguration } from '../../api/AgamaSourceConfiguration';
import { PlatformAgamaMetrics } from '../metrics/PlatformAgamaMetrics';

const TAG = 'AgamaExtensionHandler';

export class AgamaExtensionHandler {
  private _agamaViewStateHandler: AgamaViewStateHandler | undefined;
  private _agamaSessionMetadataHandler: AgamaSessionMetadataHandler | undefined;
  private _agamaMeasurementHandler: AgamaMeasurementHandler | undefined;
  private _agamaSourceConfiguration: AgamaSourceConfiguration | undefined;
  private readonly _agamaMetrics: PlatformAgamaMetrics | undefined;

  constructor(
    private _player: THEOplayer,
    private _agamaClient: AgamaClient,
    configuration: AgamaConfiguration,
  ) {
    const agamaPlayerConfiguration = getAgamaPlayerConfiguration(configuration);
    if (!agamaPlayerConfiguration || !this._agamaClient.isAgamaAvailable_()) {
      return;
    }
    wrapCurrentTimeSetter(_player, () => {
      this.notifySeekThroughAPI_();
    });
    this._agamaMetrics = new PlatformAgamaMetrics(_player);

    this._agamaClient.initialise_(agamaPlayerConfiguration);
    if (this._agamaClient.isInitialised_()) {
      this._agamaClient.signalDeviceMetadata_();
      this._player.addEventListener(PlayerEventType.SOURCE_CHANGE, this.onSourceChange_);
      this._player.addEventListener(PlayerEventType.ENDED, this.prepareAgamaToStartOnPlay_);
    } else {
      console.warn('An error occurred while initializing an Agama EMP client. ' + 'Please check your configuration');
    }
  }

  private onSourceChange_ = (): void => {
    this.retrieveAgamaSourceConfiguration_();
    this.prepareAgamaToStartOnPlay_();
  };

  private retrieveAgamaSourceConfiguration_ = (): void => {
    const sanitisedSourceDescription = this._player.source;
    // @ts-ignore
    const analyticsConfiguration = sanitisedSourceDescription && sanitisedSourceDescription.analytics;
    this._agamaSourceConfiguration = getAgamaSourceConfiguration(analyticsConfiguration);
  };

  private prepareAgamaToStartOnPlay_ = (): void => {
    this.stopCurrentAgamaSession_();

    this._player.removeEventListener(PlayerEventType.PLAY, this.doAgamaStart_);

    if (this.isChromecasting_() || !this._agamaClient.isInitialised_() || !currentSource(this._player.source) || !this._agamaSourceConfiguration) {
      return;
    }

    this.prepareHandlers_();

    const ended = false; // = this._player.ended_
    if (this._player.paused || ended) {
      this._player.addEventListener(PlayerEventType.PLAY, this.doAgamaStart_);
    } else {
      this.doAgamaStart_();
    }
  };

  private doAgamaStart_ = (): void => {
    const currentSrc = currentSource(this._player.source);
    if (!currentSrc || !this._agamaSourceConfiguration) {
      if (__DEBUG__) {
        console.error('Could not start Agama session, either currentSource or ' + 'agamaSourceConfiguration are undefined');
      }
      return;
    }

    // Start Agama session
    this._agamaClient.abrSession_(currentSrc, this._agamaSourceConfiguration);

    this.startReporting_();
    this.reportInitialSessionMetadata_(this._agamaSourceConfiguration);

    this.addChromecastListener_();
    this._player.addEventListener(PlayerEventType.ERROR, this.agamaHandleError_);

    this._player.removeEventListener(PlayerEventType.PLAY, this.doAgamaStart_);
  };

  private stopCurrentAgamaSession_(): void {
    this._player.removeEventListener(PlayerEventType.ERROR, this.agamaHandleError_);
    this.unloadHandlers_();
    this.removeChromecastListener_();
    this._agamaClient.exitSession_();
  }

  private addChromecastListener_(): void {
    this._player.addEventListener(PlayerEventType.CAST_EVENT, this.handleChromecastStateChange_);
  }

  private removeChromecastListener_(): void {
    this._player.removeEventListener(PlayerEventType.CAST_EVENT, this.handleChromecastStateChange_);
  }

  private handleChromecastStateChange_ = (event: CastEvent): void => {
    if (event.subType === CastEventType.CHROMECAST_STATE_CHANGE) {
      if (this.isChromecasting_()) {
        this.stopCurrentAgamaSession_();
      }
    }
  };

  private agamaHandleError_ = (event: ErrorEvent): void => {
    this.notifyViewStateError_(event.error);
    this.stopCurrentAgamaSession_();
  };

  private isChromecasting_(): boolean {
    // For now, we've only implemented Agama for chromecast
    return this._player.cast.chromecast !== undefined && this._player.cast.chromecast.state === CastState.connected;
  }

  unload_(): void {
    this._player.removeEventListener(PlayerEventType.SOURCE_CHANGE, this.onSourceChange_);
    this._player.removeEventListener(PlayerEventType.PLAY, this.doAgamaStart_);
    this._player.removeEventListener(PlayerEventType.ENDED, this.prepareAgamaToStartOnPlay_);

    this.stopCurrentAgamaSession_(); // also unloads handlers
    unwrapCurrentTimeSetter(this._player);
    this._agamaClient.unload_();
  }

  private prepareHandlers_(): void {
    if (!this._agamaViewStateHandler) {
      this._agamaViewStateHandler = new AgamaViewStateHandler(this._player, this._agamaClient);
    }

    if (!this._agamaMeasurementHandler && this._agamaMetrics) {
      this._agamaMeasurementHandler = new AgamaMeasurementHandler(this._player, this._agamaClient, this._agamaMetrics);
    }

    if (!this._agamaSessionMetadataHandler && this._agamaMetrics) {
      this._agamaSessionMetadataHandler = new AgamaSessionMetadataHandler(this._player, this._agamaClient, this._agamaMetrics);
    }
  }

  private startReporting_(): void {
    if (this._agamaViewStateHandler) {
      this._agamaViewStateHandler.startReporting_();
      this._agamaViewStateHandler.addEventListener(AgamaHandlerEventType.VIEWSTATE_CHANGE, this.notifyViewStateChangeToMeasurementHandler_);
    }

    if (this._agamaMeasurementHandler) {
      void this._agamaMeasurementHandler.startReporting_();
    }

    if (this._agamaSessionMetadataHandler) {
      this._agamaSessionMetadataHandler.startReporting_();
    }
  }

  private unloadHandlers_(): void {
    if (this._agamaViewStateHandler) {
      this._agamaViewStateHandler.removeEventListener(AgamaHandlerEventType.VIEWSTATE_CHANGE, this.notifyViewStateChangeToMeasurementHandler_);
      this._agamaViewStateHandler.unload_();
      this._agamaViewStateHandler = undefined;
    }
    if (this._agamaMeasurementHandler) {
      this._agamaMeasurementHandler.unload_();
      this._agamaMeasurementHandler = undefined;
    }
    if (this._agamaSessionMetadataHandler) {
      this._agamaSessionMetadataHandler.unload_();
      this._agamaSessionMetadataHandler = undefined;
    }
  }

  private notifyViewStateChangeToMeasurementHandler_ = () => {
    if (this._agamaMeasurementHandler) {
      this._agamaMeasurementHandler.onViewStateChange_();
    }
  };

  private reportInitialSessionMetadata_(agamaSourceConfig: AgamaSourceConfiguration): void {
    if (this._agamaSessionMetadataHandler) {
      this._agamaSessionMetadataHandler.reportInitialSessionMetadata_(agamaSourceConfig);
    }
  }

  private notifyViewStateError_(error: PlayerError): void {
    if (this._agamaViewStateHandler) {
      this._agamaViewStateHandler.notifyError_(error);
    }
  }

  notifySeekThroughAPI_(): void {
    if (this._agamaViewStateHandler) {
      this._agamaViewStateHandler.notifySeekThroughAPI_();
    }
  }
}

/**
 * Execute a custom method when currentTime is called from the API.
 */
function wrapCurrentTimeSetter(player: THEOplayer, customAction: () => void) {
  // @ts-ignore
  if (!player.customCurrentTime) {
    const originalDescriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(player), 'currentTime');
    if (originalDescriptor) {
      Object.defineProperty(player, 'currentTime', {
        set(value: number) {
          // @ts-ignore
          player.customCurrentTime();
          originalDescriptor.set?.call(player, value);
        },
        get: originalDescriptor.get,
      });
      if (__DEBUG__) {
        console.log(TAG, 'Wrapped player.currentTime');
      }
    }
  }
  // @ts-ignore
  player.customCurrentTime = customAction;
}

/**
 * Remove custom method when currentTime is called from the API.
 */
function unwrapCurrentTimeSetter(player: THEOplayer) {
  // @ts-ignore
  player.customCurrentTime = () => {
    /*NoOp*/
  };
  if (__DEBUG__) {
    console.log(TAG, 'Unwrapped player.currentTime');
  }
}
