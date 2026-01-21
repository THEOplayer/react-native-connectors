import type { NativeHandleType, THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import { AnalyticsConfig } from '../api/AnalyticsConfig';
import { SourceMetadata } from '../api/SourceMetadata';
import { CustomData } from '../api/CustomData';

const TAG = 'BitmovinConnector';
const ERROR_MSG = 'BitmovinConnectorAdapter Error';

export class BitmovinConnectorAdapter {
  private readonly nativeHandle: NativeHandleType;

  constructor(player: THEOplayer, config: AnalyticsConfig, sourceMetadata?: SourceMetadata) {
    try {
      this.nativeHandle = player.nativeHandle || -1;
      NativeModules.BitmovinModule.initialize(this.nativeHandle, config, sourceMetadata);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  updateSourceMetadata(metadata: SourceMetadata): void {
    try {
      NativeModules.BitmovinModule.updateSourceMetadata(this.nativeHandle, metadata);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  updateCustomData(customData: CustomData): void {
    try {
      NativeModules.BitmovinModule.updateCustomData(this.nativeHandle, customData);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  sendCustomDataEvent(customData: CustomData): void {
    try {
      NativeModules.BitmovinModule.sendCustomDataEvent(this.nativeHandle, customData);
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
