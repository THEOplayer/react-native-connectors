import type { THEOplayer } from 'react-native-theoplayer';
import type { ComscoreConfiguration } from '../api/ComscoreConfiguration';
import type { ComscoreMetadata } from '../api/ComscoreMetadata';
import { NativeModules } from 'react-native';

export class ComscoreConnectorAdapter {
  constructor(
    private player: THEOplayer,
    comscoreMetadata: ComscoreMetadata,
    comscoreConfig: ComscoreConfiguration,
  ) {
    NativeModules.ComscoreModule.initialize(this.player.nativeHandle, comscoreMetadata, comscoreConfig);
  }

  update(metadata: ComscoreMetadata): void {
    NativeModules.ComscoreModule.update(this.player.nativeHandle, metadata);
  }

  setPersistentLabel(label: string, value: string): void {
    NativeModules.ComscoreModule.setPersistentLabel(this.player.nativeHandle, label, value);
  }

  setPersistentLabels(labels: { [key: string]: string }): void {
    NativeModules.ComscoreModule.setPersistentLabels(this.player.nativeHandle, labels);
  }

  destroy(): void {
    NativeModules.ComscoreModule.destroy(this.player.nativeHandle || -1);
  }
}
