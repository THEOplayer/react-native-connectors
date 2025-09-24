import type { NativeHandleType, THEOplayer } from 'react-native-theoplayer';
import { NativeModules, Platform } from 'react-native';

export class YospaceConnectorAdapter {
  private readonly nativeHandle: NativeHandleType;

  constructor(player: THEOplayer, debugFlags: number = 0) {
    this.nativeHandle = player.nativeHandle || -1;
    if (Platform.OS !== 'android') {
      console.warn(`THEOplayer Yospace connector does not support ${Platform.OS} yet.`);
      return;
    }
    NativeModules.YospaceModule.initialize(this.nativeHandle, debugFlags);
  }

  destroy(): void {
    if (Platform.OS !== 'android') {
      return;
    }
    NativeModules.YospaceModule.destroy(this.nativeHandle);
  }
}
