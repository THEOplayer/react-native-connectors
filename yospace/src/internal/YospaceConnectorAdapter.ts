import type { THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';

export class YospaceConnectorAdapter {
  constructor(private player: THEOplayer) {
    NativeModules.YospaceModule.initialize(this.player.nativeHandle);
  }

  destroy(): void {
    NativeModules.YospaceModule.destroy(this.player.nativeHandle || -1);
  }
}
