import type { THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import { AdScriptMetadata } from '../api/AdScriptMetadata';
import { AdScriptI12n } from '../api/AdScriptI12n';

const TAG = 'AdScriptConnector';
const ERROR_MSG = 'AdScriptConnectorAdapter Error';

export class AdScriptConnectorAdapter {
  constructor(
    private player: THEOplayer,
    implementationId: string,
    contentMetadata: AdScriptMetadata,
    debug?: boolean,
  ) {
    try {
      NativeModules.AdScriptModule.initialize(this.player.nativeHandle || -1, implementationId, contentMetadata, debug ?? false);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  updateMetadata(metadata: AdScriptMetadata) {
    try {
      NativeModules.AdScriptModule.updateMetadata(this.player.nativeHandle || -1, metadata);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  updateUser(user: AdScriptI12n) {
    try {
      NativeModules.AdScriptModule.updateUser(this.player.nativeHandle || -1, user);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  destroy(): void {
    try {
      NativeModules.AdScriptModule.destroy(this.player.nativeHandle || -1);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }
}
