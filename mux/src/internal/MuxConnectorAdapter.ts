import type { THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import type { MuxOptions } from "../api/MuxOptions";
import type { MuxData } from "../api/MuxData";

export class MuxConnectorAdapter {

  constructor (private player: THEOplayer, options: MuxOptions) {
    NativeModules.MuxModule.initialize(this.player.nativeHandle, options);
  }

  changeProgram(data: MuxData) {
    NativeModules.MuxModule.changeProgram(this.player.nativeHandle, data);
  }

  destroy(): void {
    NativeModules.MuxModule.destroy(this.player.nativeHandle || -1);
  }
}
