import type { THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import type { AdobeCustomMetadataDetails, AdobeErrorDetails } from '@theoplayer/react-native-analytics-adobe-edge';
import { AdobeConnectorAdapter } from './AdobeConnectorAdapter';

const TAG = 'AdobeEdgeConnector';
const ERROR_MSG = 'AdobeConnectorAdapter Error';

export class NativeAdobeConnectorAdapter implements AdobeConnectorAdapter {
  constructor(
    private player: THEOplayer,
    baseUrl: string,
    configId: string,
    userAgent?: string,
    debug = false,
    debugSessionId: string | undefined = undefined,
  ) {
    try {
      NativeModules.AdobeEdgeModule.initialize(this.player.nativeHandle || -1, baseUrl, configId, userAgent, debug, debugSessionId);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  setDebug(debug: boolean) {
    try {
      NativeModules.AdobeEdgeModule.setDebug(this.player.nativeHandle || -1, debug);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  updateMetadata(metadata: AdobeCustomMetadataDetails[]) {
    try {
      NativeModules.AdobeEdgeModule.updateMetadata(this.player.nativeHandle || -1, metadata);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  setError(errorDetails: AdobeErrorDetails) {
    try {
      NativeModules.AdobeEdgeModule.setError(this.player.nativeHandle || -1, errorDetails);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  setDebugSessionId(id: string | undefined) {
    try {
      NativeModules.AdobeEdgeModule.setDebugSessionId(this.player.nativeHandle || -1, id);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  async stopAndStartNewSession(metadata?: AdobeCustomMetadataDetails[]) {
    try {
      NativeModules.AdobeEdgeModule.stopAndStartNewSession(this.player.nativeHandle || -1, metadata ?? []);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  async destroy() {
    try {
      NativeModules.AdobeEdgeModule.destroy(this.player.nativeHandle || -1);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }
}
