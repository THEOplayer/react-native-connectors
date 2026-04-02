import type { NativeHandleType, THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import { AnalyticsConfig } from '../api/AnalyticsConfig';
import { SourceMetadata } from '../api/SourceMetadata';
import { CustomData } from '../api/CustomData';
import { DefaultMetadata } from '../api/DefaultMetadata';
import { SsaiApi } from '../api/SsaiApi';
import { BitmovinSsaiAdapter } from './native/BitmovinSsaiAdapterNative';

const TAG = 'BitmovinConnector';
const ERROR_MSG = 'BitmovinConnectorAdapter Error';

export class BitmovinConnectorAdapter {
  private readonly _nativeHandle: NativeHandleType;
  private readonly _ssai: BitmovinSsaiAdapter;

  constructor(player: THEOplayer, config: AnalyticsConfig, defaultMetadata?: DefaultMetadata) {
    try {
      this._nativeHandle = player.nativeHandle || -1;
      this._ssai = new BitmovinSsaiAdapter(this._nativeHandle);
      NativeModules.BitmovinModule.initialize(this._nativeHandle, config, defaultMetadata);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  updateSourceMetadata(sourceMetadata: SourceMetadata): void {
    try {
      NativeModules.BitmovinModule.updateSourceMetadata(this._nativeHandle, sourceMetadata);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  updateCustomData(customData: CustomData): void {
    try {
      NativeModules.BitmovinModule.updateCustomData(this._nativeHandle, customData);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  programChange(sourceMetadata: SourceMetadata): void {
    try {
      NativeModules.BitmovinModule.programChange(this._nativeHandle, sourceMetadata);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  sendCustomDataEvent(customData: CustomData): void {
    try {
      NativeModules.BitmovinModule.sendCustomDataEvent(this._nativeHandle, customData);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  get ssai(): SsaiApi {
    return this._ssai;
  }

  destroy(): void {
    try {
      NativeModules.BitmovinModule.destroy(this._nativeHandle);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }
}
