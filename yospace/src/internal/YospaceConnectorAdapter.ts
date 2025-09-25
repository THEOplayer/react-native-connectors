import type { NativeHandleType, THEOplayer } from 'react-native-theoplayer';
import { NativeModules, Platform } from 'react-native';

const TAG = 'YospaceConnector';
const ERROR_MSG = 'YospaceConnectorAdapter Error';

export class YospaceConnectorAdapter {
  private readonly nativeHandle: NativeHandleType;

  constructor(player: THEOplayer, debugFlags: number = 0) {
    this.nativeHandle = player.nativeHandle || -1;
    if (Platform.OS !== 'android') {
      console.warn(`THEOplayer Yospace connector does not support ${Platform.OS} yet.`);
      return;
    }
    try {
      NativeModules.YospaceModule.initialize(this.nativeHandle, debugFlags);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  destroy(): void {
    if (Platform.OS !== 'android') {
      return;
    }
    try {
      NativeModules.YospaceModule.destroy(this.nativeHandle);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }
}
