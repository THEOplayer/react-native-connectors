import type { THEOplayer } from 'react-native-theoplayer';
import type { NielsenConfiguration } from '../api/NielsenConfiguration';
import type { NielsenMetadata } from '../api/NielsenMetadata';
import { NativeModules } from 'react-native';

export class NielsenConnectorAdapter {

  constructor (private player: THEOplayer, nielsenMetadata: NielsenMetadata, nielsenConfig: NielsenConfiguration) {
    // @ts-ignore
    NativeModules.NielsenModule.initialize(this.player.nativeHandle, nielsenMetadata, nielsenConfig);
  }

  setContentInfo(metadata: NielsenMetadata): void {
    NativeModules.NielsenModule.setContentInfo(this.player.nativeHandle, metadata);
  }

  setAdInfo(metadata: NielsenMetadata): void {
    NativeModules.NielsenModule.setAdInfo(this.player.nativeHandle, metadata);
  }

  destroy(): void {
    // @ts-ignore
    NativeModules.NielsenModule.destroy(this.player.nativeHandle);
  }
}
