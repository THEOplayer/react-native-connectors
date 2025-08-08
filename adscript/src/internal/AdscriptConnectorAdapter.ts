import type { THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import { AdscriptMetadata } from '../api/AdscriptMetadata';
import { AdScriptI12n } from '../api/AdScriptI12n';

const TAG = 'AdscriptConnector';
const ERROR_MSG = 'AdscriptConnectorAdapter Error';

export class AdscriptConnectorAdapter {
  constructor(
    private player: THEOplayer,
    implementationId: string,
    contentMetadata: AdscriptMetadata,
    debug?: boolean,
  ) {
    try {
      NativeModules.AdscriptModule.initialize(this.player.nativeHandle || -1, implementationId, contentMetadata, debug ?? false);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  updateMetadata(metadata: AdscriptMetadata) {
    try {
      NativeModules.AdscriptModule.updateMetadata(this.player.nativeHandle || -1, metadata);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  updateUser(user: AdScriptI12n) {
    try {
      NativeModules.AdscriptModule.updateUser(this.player.nativeHandle || -1, user);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  destroy(): void {
    try {
      NativeModules.AdscriptModule.destroy(this.player.nativeHandle || -1);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }
}
