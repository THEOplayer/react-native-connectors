import type { NativeHandleType, THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import youbora from 'youboralib';

export class YouboraConnectorAdapter {
  private readonly nativeHandle: NativeHandleType;

  constructor(player: THEOplayer, options: youbora.Options, logLevel?: youbora.Log.Level) {
    this.nativeHandle = player.nativeHandle || -1;
    NativeModules.YouboraModule.initialize(this.nativeHandle, options, logLevel || youbora.Log.Level.SILENT);
  }

  setDebugLevel(level: youbora.Log.Level) {
    NativeModules.YouboraModule.setDebugLevel(level);
  }

  destroy(): void {
    NativeModules.YouboraModule.destroy(this.nativeHandle);
  }
}
