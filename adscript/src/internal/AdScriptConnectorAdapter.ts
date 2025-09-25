import type { NativeHandleType, THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import { AdScriptMetadata } from '../api/AdScriptMetadata';
import { AdScriptI12n } from '../api/AdScriptI12n';

const TAG = 'AdScriptConnector';
const ERROR_MSG = 'AdScriptConnectorAdapter Error';

export class AdScriptConnectorAdapter {
  private readonly nativeHandle: NativeHandleType;

  constructor(player: THEOplayer, implementationId: string, contentMetadata: AdScriptMetadata, debug?: boolean) {
    try {
      this.nativeHandle = player.nativeHandle || -1;
      NativeModules.AdScriptModule.initialize(this.nativeHandle, implementationId, contentMetadata, debug ?? false);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  updateMetadata(metadata: AdScriptMetadata) {
    try {
      NativeModules.AdScriptModule.updateMetadata(this.nativeHandle, metadata);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  updateUser(user: AdScriptI12n) {
    try {
      NativeModules.AdScriptModule.updateUser(this.nativeHandle, user);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  destroy(): void {
    try {
      NativeModules.AdScriptModule.destroy(this.nativeHandle);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }
}
