import type { THEOplayer } from 'react-native-theoplayer';
import type { AdobeMetaData } from './Types';
import { NativeModules } from 'react-native';

const TAG = 'AdobeConnector';
const ERROR_MSG = 'AdobeConnectorAdapter Error';

export class AdobeConnectorAdapter {
  constructor(
    private player: THEOplayer,
    uri: string,
    ecid: string,
    sid: string,
    trackingUrl: string,
    metadata?: AdobeMetaData,
    userAgent?: string,
    debug = false,
  ) {
    try {
      NativeModules.AdobeModule.initialize(this.player.nativeHandle || -1, uri, ecid, sid, trackingUrl, metadata, userAgent, debug);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  setDebug(debug: boolean) {
    try {
      NativeModules.AdobeModule.setDebug(this.player.nativeHandle || -1, debug);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  updateMetadata(metadata: AdobeMetaData): void {
    try {
      NativeModules.AdobeModule.updateMetadata(this.player.nativeHandle || -1, metadata);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  setError(metadata: AdobeMetaData): void {
    try {
      NativeModules.AdobeModule.setError(this.player.nativeHandle || -1, metadata);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  async stopAndStartNewSession(metadata?: AdobeMetaData): Promise<void> {
    try {
      NativeModules.AdobeModule.stopAndStartNewSession(this.player.nativeHandle || -1, metadata);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  async destroy(): Promise<void> {
    try {
      NativeModules.AdobeModule.destroy(this.player.nativeHandle || -1);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }
}
