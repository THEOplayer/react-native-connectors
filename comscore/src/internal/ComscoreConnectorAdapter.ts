import type { NativeHandleType, THEOplayer } from 'react-native-theoplayer';
import type { ComscoreConfiguration } from '../api/ComscoreConfiguration';
import type { ComscoreMetadata } from '../api/ComscoreMetadata';
import { NativeModules } from 'react-native';

const TAG = 'ComscoreConnector';
const ERROR_MSG = 'ComscoreConnectorAdapter Error';

export class ComscoreConnectorAdapter {
  private readonly nativeHandle: NativeHandleType;

  constructor(player: THEOplayer, comscoreMetadata: ComscoreMetadata, comscoreConfig: ComscoreConfiguration) {
    try {
      this.nativeHandle = player.nativeHandle || -1;
      NativeModules.ComscoreModule.initialize(this.nativeHandle, comscoreMetadata, comscoreConfig);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  update(metadata: ComscoreMetadata): void {
    try {
      NativeModules.ComscoreModule.update(this.nativeHandle, metadata);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  setPersistentLabel(label: string, value: string): void {
    try {
      NativeModules.ComscoreModule.setPersistentLabel(this.nativeHandle, label, value);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  setPersistentLabels(labels: { [key: string]: string }): void {
    try {
      NativeModules.ComscoreModule.setPersistentLabels(this.nativeHandle, labels);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  destroy(): void {
    try {
      NativeModules.ComscoreModule.destroy(this.nativeHandle);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }
}
