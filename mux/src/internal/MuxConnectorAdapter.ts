import type { THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';

export class MuxConnectorAdapter {

  constructor (private player: THEOplayer, options: any) {
    NativeModules.MuxModule.initialize(this.player.nativeHandle, options);
  }

  destroy(): void {
    NativeModules.MuxModule.destroy(this.player.nativeHandle || -1);
  }
}
