import type { THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import type youbora from "youboralib";

export class YouboraConnectorAdapter {

  constructor (private player: THEOplayer, options: youbora.Options, logLevel?: youbora.Log.Level) {
    NativeModules.YouboraModule.initialize(this.player.nativeHandle, options, logLevel);
  }

  setDebugLevel(level: youbora.Log.Level) {
    NativeModules.YouboraModule.setLogLevel(this.player.nativeHandle, level);
  }

  destroy(): void {
    NativeModules.YouboraModule.destroy(this.player.nativeHandle || -1);
  }
}
