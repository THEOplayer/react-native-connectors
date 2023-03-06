import type { THEOplayer } from 'react-native-theoplayer';
import type { ComscoreConfiguration } from '../api/ComscoreConfiguration';
import type { ComscoreMetadata } from '../api/ComscoreMetadata';
import { NativeModules } from 'react-native';

export class ComscoreConnectorAdapter {

  constructor (private player: THEOplayer, comscoreMetadata: ComscoreMetadata, comscoreConfig: ComscoreConfiguration) {
    // @ts-ignore
    NativeModules.ComscoreModule.initialize(this.player.nativeHandle, comscoreMetadata, comscoreConfig);
  }

  destroy(): void {
    // @ts-ignore
    NativeModules.ComscoreModule.destroy(this.player.nativeHandle);
  }
}
