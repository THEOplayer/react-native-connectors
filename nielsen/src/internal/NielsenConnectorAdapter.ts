import type { THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import type { NielsenOptions } from "@theoplayer/nielsen-connector-web";

export class NielsenConnectorAdapter {

  constructor (private player: THEOplayer, appId: string, instanceName: string, nielsenOptions: NielsenOptions) {
    // @ts-ignore
    NativeModules.NielsenModule.initialize(this.player.nativeHandle, appId, instanceName, nielsenOptions);
  }

  updateMetadata(metadata: {[key: string]: string}): void {
    NativeModules.NielsenModule.updateMetadata(metadata);
  }

  destroy(): void {
    // @ts-ignore
    NativeModules.NielsenModule.destroy(this.player.nativeHandle);
  }
}
