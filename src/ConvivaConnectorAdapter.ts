import type { THEOplayer } from 'react-native-theoplayer';
import type { ConvivaConfiguration } from './ConvivaConfiguration';
import type { ConvivaMetadata } from './ConvivaMetadata';
import { NativeModules } from 'react-native';

export class ConvivaConnectorAdapter {

  constructor (private player: THEOplayer, convivaMetadata: ConvivaMetadata, convivaConfig: ConvivaConfiguration) {
    // @ts-ignore
    NativeModules.ConvivaModule.initialize(this.player.nativeHandle, convivaMetadata, convivaConfig);
  }

  setContentInfo(metadata: ConvivaMetadata): void {
    NativeModules.ConvivaModule.setContentInfo(this.player.nativeHandle, metadata);
  }

  setAdInfo(metadata: ConvivaMetadata): void {
    NativeModules.ConvivaModule.setAdInfo(this.player.nativeHandle, metadata);
  }

  destroy(): void {
    // @ts-ignore
    NativeModules.ConvivaModule.destroy(this.player.nativeHandle);
  }
}
