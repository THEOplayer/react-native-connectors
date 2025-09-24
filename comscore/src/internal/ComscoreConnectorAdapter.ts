import type { NativeHandleType, THEOplayer } from 'react-native-theoplayer';
import type { ComscoreConfiguration } from '../api/ComscoreConfiguration';
import type { ComscoreMetadata } from '../api/ComscoreMetadata';
import { NativeModules } from 'react-native';

export class ComscoreConnectorAdapter {
  private readonly nativeHandle: NativeHandleType;

  constructor(player: THEOplayer, comscoreMetadata: ComscoreMetadata, comscoreConfig: ComscoreConfiguration) {
    this.nativeHandle = player.nativeHandle || -1;
    NativeModules.ComscoreModule.initialize(this.nativeHandle, comscoreMetadata, comscoreConfig);
  }

  update(metadata: ComscoreMetadata): void {
    NativeModules.ComscoreModule.update(this.nativeHandle, metadata);
  }

  setPersistentLabel(label: string, value: string): void {
    NativeModules.ComscoreModule.setPersistentLabel(this.nativeHandle, label, value);
  }

  setPersistentLabels(labels: { [key: string]: string }): void {
    NativeModules.ComscoreModule.setPersistentLabels(this.nativeHandle, labels);
  }

  destroy(): void {
    NativeModules.ComscoreModule.destroy(this.nativeHandle);
  }
}
