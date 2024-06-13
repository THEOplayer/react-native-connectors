import type { THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';

export class YospaceConnectorAdapter {
  constructor(private player: THEOplayer, debugFlags?: number) {
    NativeModules.YospaceModule.initialize(this.player.nativeHandle, debugFlags);
  }

  destroy(): void {
    NativeModules.YospaceModule.destroy(this.player.nativeHandle || -1);
  }
}
