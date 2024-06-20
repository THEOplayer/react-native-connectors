import type { THEOplayer } from 'react-native-theoplayer';
import { NativeModules, Platform } from 'react-native';

export class YospaceConnectorAdapter {
  constructor(private player: THEOplayer, debugFlags: number = 0) {
    if (Platform.OS !== 'android') {
      console.warn(`THEOplayer Yospace connector does not support ${Platform.OS} yet.`);
      return;
    }
    NativeModules.YospaceModule.initialize(this.player.nativeHandle, debugFlags);
  }

  destroy(): void {
    if (Platform.OS !== 'android') {
      return;
    }
    NativeModules.YospaceModule.destroy(this.player.nativeHandle || -1);
  }
}
