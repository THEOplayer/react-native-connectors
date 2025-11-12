import type { NativeHandleType, THEOplayer } from 'react-native-theoplayer';
import type { ConvivaConfiguration } from '../api/ConvivaConfiguration';
import type { ConvivaMetadata } from '../api/ConvivaMetadata';
import { NativeModules } from 'react-native';
import type { ConvivaEventDetail } from '../api/ConvivaEventDetail';
import { ConvivaConnectorAdapter } from './ConvivaConnectorAdapter';

const TAG = 'ConvivaConnector';
const ERROR_MSG = 'ConvivaConnectorAdapter Error';

export class ConvivaConnectorAdapterNative implements ConvivaConnectorAdapter {
  private readonly nativeHandle: NativeHandleType;

  constructor(player: THEOplayer, convivaMetadata: ConvivaMetadata, convivaConfig: ConvivaConfiguration) {
    try {
      this.nativeHandle = player.nativeHandle || -1;
      NativeModules.ConvivaModule.initialize(this.nativeHandle, convivaMetadata, convivaConfig);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  stopAndStartNewSession(metadata: ConvivaMetadata): void {
    try {
      NativeModules.ConvivaModule.stopAndStartNewSession(this.nativeHandle, metadata);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  reportPlaybackFailed(errorMessage: string): void {
    try {
      NativeModules.ConvivaModule.reportPlaybackFailed(this.nativeHandle, errorMessage);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  reportPlaybackEvent(eventName: string, eventDetail: ConvivaEventDetail): void {
    try {
      NativeModules.ConvivaModule.reportPlaybackEvent(this.nativeHandle, eventName, eventDetail);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  setContentInfo(metadata: ConvivaMetadata): void {
    try {
      NativeModules.ConvivaModule.setContentInfo(this.nativeHandle, metadata);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  setAdInfo(metadata: ConvivaMetadata): void {
    try {
      NativeModules.ConvivaModule.setAdInfo(this.nativeHandle, metadata);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  destroy(): void {
    try {
      NativeModules.ConvivaModule.destroy(this.nativeHandle);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }
}
