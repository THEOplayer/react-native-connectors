import type { NativeHandleType, THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import { AdobeIdentityMap, AdobeMetadata } from '@theoplayer/react-native-analytics-adobe-edge';
import { AdobeConnectorAdapter } from './AdobeConnectorAdapter';
import { AdobeEdgeMobileConfig } from '../api/AdobeEdgeMobileConfig';

const TAG = 'AdobeEdgeConnector';
const ERROR_MSG = 'AdobeConnectorAdapter Error';

export class AdobeConnectorAdapterNative implements AdobeConnectorAdapter {
  private readonly nativeHandle: NativeHandleType;

  constructor(player: THEOplayer, config: AdobeEdgeMobileConfig, customIdentityMap?: AdobeIdentityMap) {
    this.nativeHandle = player.nativeHandle || -1;
    try {
      NativeModules.AdobeEdgeModule.initialize(this.nativeHandle, config, customIdentityMap);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  setDebug(debug: boolean) {
    try {
      NativeModules.AdobeEdgeModule.setDebug(this.nativeHandle || -1, debug);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  updateMetadata(metadata: AdobeMetadata) {
    try {
      NativeModules.AdobeEdgeModule.updateMetadata(this.nativeHandle || -1, metadata);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  setCustomIdentityMap(customIdentityMap: AdobeIdentityMap): void {
    try {
      NativeModules.AdobeEdgeModule.setCustomIdentityMap(this.nativeHandle || -1, customIdentityMap);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  setError(errorId: string) {
    try {
      NativeModules.AdobeEdgeModule.setError(this.nativeHandle || -1, errorId);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  async stopAndStartNewSession(metadata?: AdobeMetadata) {
    try {
      NativeModules.AdobeEdgeModule.stopAndStartNewSession(this.nativeHandle || -1, metadata ?? []);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  async destroy() {
    try {
      NativeModules.AdobeEdgeModule.destroy(this.nativeHandle || -1);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }
}
