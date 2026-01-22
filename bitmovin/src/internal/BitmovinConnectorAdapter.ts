import type { NativeHandleType, THEOplayer } from 'react-native-theoplayer';
import { NativeModules, Platform } from 'react-native';
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
      if (Platform.OS === 'android') {
        NativeModules.BitmovinModule.initialize(this.nativeHandle, config, sourceMetadata);
      }
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  updateSourceMetadata(metadata: SourceMetadata): void {
    try {
      if (Platform.OS === 'android') {
        NativeModules.BitmovinModule.updateSourceMetadata(this.nativeHandle, metadata);
      }
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  updateCustomData(customData: CustomData): void {
    try {
      if (Platform.OS === 'android') {
        NativeModules.BitmovinModule.updateCustomData(this.nativeHandle, customData);
      }
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  sendCustomDataEvent(customData: CustomData): void {
    try {
      if (Platform.OS === 'android') {
        NativeModules.BitmovinModule.sendCustomDataEvent(this.nativeHandle, customData);
      }
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  destroy(): void {
    try {
      if (Platform.OS === 'android') {
        NativeModules.BitmovinModule.destroy(this.nativeHandle);
      }
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }
}
