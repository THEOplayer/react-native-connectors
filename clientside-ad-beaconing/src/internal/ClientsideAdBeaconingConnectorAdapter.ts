import type { NativeHandleType, THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import { AdBreakInit, AdInit } from 'theoplayer';

const TAG = 'ClientsideAdBeaconingConnector';
const ERROR_MSG = 'ClientsideAdBeaconingConnectorAdapter Error';

export class ClientsideAdBeaconingConnectorAdapter {
  private readonly nativeHandle: NativeHandleType;

  constructor(player: THEOplayer) {
    try {
      this.nativeHandle = player.nativeHandle || -1;
      NativeModules.ClientsideAdBeaconingModule.initialize(this.nativeHandle);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  createAdBreak(adBreakId: string, adBreakInit: AdBreakInit): void {
    try {
      NativeModules.ClientsideAdBeaconingModule.createAdBreak(this.nativeHandle, adBreakId, adBreakInit);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  createAd(adId: string, adInit: AdInit): void {
    try {
      NativeModules.ClientsideAdBeaconingModule.createAdBreak(this.nativeHandle, adId, adInit);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  beginAd(adId: string): void {
    try {
      NativeModules.ClientsideAdBeaconingModule.beginAd(this.nativeHandle, adId);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  endAd(adId: string): void {
    try {
      NativeModules.ClientsideAdBeaconingModule.endAd(this.nativeHandle, adId);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  removeAd(adId: string): void {
    try {
      NativeModules.ClientsideAdBeaconingModule.removeAd(this.nativeHandle, adId);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  removeAdBreak(adBreakId: string): void {
    try {
      NativeModules.ClientsideAdBeaconingModule.removeAdBreak(this.nativeHandle, adBreakId);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  destroy(): void {
    try {
      NativeModules.ClientsideAdBeaconingModule.destroy(this.nativeHandle);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }
}
