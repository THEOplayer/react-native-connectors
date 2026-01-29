import type { NativeHandleType, THEOplayer } from 'react-native-theoplayer';
import { NativeModules, Platform } from 'react-native';
import { AnalyticsConfig } from '../api/AnalyticsConfig';
import { SourceMetadata } from '../api/SourceMetadata';
import { CustomData } from '../api/CustomData';
import { DefaultMetadata } from '../api/DefaultMetadata';

const TAG = 'BitmovinConnector';
const ERROR_MSG = 'BitmovinConnectorAdapter Error';

export class BitmovinConnectorAdapter {
  private readonly nativeHandle: NativeHandleType;

  constructor(player: THEOplayer, config: AnalyticsConfig, defaultMetadata?: DefaultMetadata) {
    try {
      this.nativeHandle = player.nativeHandle || -1;
      NativeModules.BitmovinModule.initialize(this.nativeHandle, config, defaultMetadata);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  updateSourceMetadata(sourceMetadata: SourceMetadata): void {
    try {
      NativeModules.BitmovinModule.updateSourceMetadata(this.nativeHandle, sourceMetadata);
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

  programChange(sourceMetadata: SourceMetadata): void {
    try {
      NativeModules.BitmovinModule.programChange(this.nativeHandle, sourceMetadata);
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
