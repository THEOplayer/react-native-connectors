import type { NativeHandleType, THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import { NielsenOptions } from '@theoplayer/react-native-analytics-nielsen';

export class NielsenConnectorAdapter {
  private readonly nativeHandle: NativeHandleType;

  constructor(player: THEOplayer, appId: string, instanceName: string, nielsenOptions: NielsenOptions) {
    this.nativeHandle = player.nativeHandle || -1;
    NativeModules.NielsenModule.initialize(this.nativeHandle, appId, instanceName, nielsenOptions);
  }

  updateMetadata(metadata: { [key: string]: string }): void {
    NativeModules.NielsenModule.updateMetadata(this.nativeHandle, metadata);
  }

  destroy(): void {
    NativeModules.NielsenModule.destroy(this.nativeHandle);
  }
}
