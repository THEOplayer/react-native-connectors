import type { THEOplayer } from 'react-native-theoplayer';
import type { ConvivaConfiguration } from '../api/ConvivaConfiguration';
import type { ConvivaMetadata } from '../api/ConvivaMetadata';
import { NativeModules } from 'react-native';

export class ConvivaConnectorAdapter {

  constructor (private player: THEOplayer, convivaMetadata: ConvivaMetadata, convivaConfig: ConvivaConfiguration) {
    // @ts-ignore
    NativeModules.ConvivaModule.initialize(this.player.nativeHandle, convivaMetadata, convivaConfig);
  }

  stopAndStartNewSession(metadata: ConvivaMetadata): void {
    NativeModules.ConvivaModule.stopAndStartNewSession(metadata);
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
