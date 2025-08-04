import type { THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import { AdscriptMetadata } from '../api/AdscriptMetadata';

export class AdscriptConnectorAdapter {
  constructor(
    private player: THEOplayer,
    implementationId: string,
    contentMetadata: AdscriptMetadata,
    debug?: boolean,
  ) {
    NativeModules.AdscriptModule.initialize(this.player.nativeHandle, implementationId, contentMetadata, debug ?? false);
  }

  updateMetadata(metadata: AdscriptMetadata) {
    NativeModules.AdscriptModule.updateMetadata(this.player.nativeHandle, metadata);
  }

  destroy(): void {
    NativeModules.AdscriptModule.destroy(this.player.nativeHandle || -1);
  }
}
