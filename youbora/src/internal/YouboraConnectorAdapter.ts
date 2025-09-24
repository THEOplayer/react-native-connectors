import type { NativeHandleType, THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import youbora from 'youboralib';

const TAG = 'YouboraConnector';
const ERROR_MSG = 'YouboraConnectorAdapter Error';

export class YouboraConnectorAdapter {
  private readonly nativeHandle: NativeHandleType;

  constructor(player: THEOplayer, options: youbora.Options, logLevel?: youbora.Log.Level) {
    try {
      this.nativeHandle = player.nativeHandle || -1;
      NativeModules.YouboraModule.initialize(this.nativeHandle, options, logLevel || youbora.Log.Level.SILENT);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  setDebugLevel(level: youbora.Log.Level) {
    try {
      NativeModules.YouboraModule.setDebugLevel(level);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  destroy(): void {
    try {
      NativeModules.YouboraModule.destroy(this.nativeHandle);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }
}
