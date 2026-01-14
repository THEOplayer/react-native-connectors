import type { NativeHandleType, THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import { BitmovinAnalyticsConfig } from '../api/BitmovinAnalyticsConfig';

const TAG = 'BitmovinConnector';
const ERROR_MSG = 'BitmovinConnectorAdapter Error';

export class BitmovinConnectorAdapter {
  private readonly nativeHandle: NativeHandleType;

  constructor(player: THEOplayer, config: BitmovinAnalyticsConfig) {
    try {
      this.nativeHandle = player.nativeHandle || -1;
      NativeModules.BitmovinModule.initialize(this.nativeHandle, config);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  updateMetadata(metadata: { [key: string]: string }): void {
    try {
      NativeModules.BitmovinModule.updateMetadata(this.nativeHandle, metadata);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  destroy(): void {
    try {
      NativeModules.BitmovinModule.destroy(this.nativeHandle);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }
}
