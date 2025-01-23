import type { THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import { NielsenOptions } from '@theoplayer/react-native-analytics-nielsen';

export class NielsenConnectorAdapter {
  constructor(
    private player: THEOplayer,
    appId: string,
    instanceName: string,
    nielsenOptions: NielsenOptions,
  ) {
    NativeModules.NielsenModule.initialize(this.player.nativeHandle, appId, instanceName, nielsenOptions);
  }

  updateMetadata(metadata: { [key: string]: string }): void {
    NativeModules.NielsenModule.updateMetadata(this.player.nativeHandle, metadata);
  }

  destroy(): void {
    NativeModules.NielsenModule.destroy(this.player.nativeHandle || -1);
  }
}
