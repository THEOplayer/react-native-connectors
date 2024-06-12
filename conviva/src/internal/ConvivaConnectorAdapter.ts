import type { THEOplayer } from 'react-native-theoplayer';
import type { ConvivaConfiguration } from '../api/ConvivaConfiguration';
import type { ConvivaMetadata } from '../api/ConvivaMetadata';
import { NativeModules } from 'react-native';
import type { ConvivaEventDetail } from '../api/ConvivaEventDetail';

export class ConvivaConnectorAdapter {
  constructor(
    private player: THEOplayer,
    convivaMetadata: ConvivaMetadata,
    convivaConfig: ConvivaConfiguration,
  ) {
    NativeModules.ConvivaModule.initialize(this.player.nativeHandle, convivaMetadata, convivaConfig);
  }

  stopAndStartNewSession(metadata: ConvivaMetadata): void {
    NativeModules.ConvivaModule.stopAndStartNewSession(this.player.nativeHandle, metadata);
  }

  reportPlaybackFailed(errorMessage: string): void {
    NativeModules.ConvivaModule.reportPlaybackFailed(this.player.nativeHandle, errorMessage);
  }

  reportPlaybackEvent(eventName: string, eventDetail: ConvivaEventDetail): void {
    NativeModules.ConvivaModule.reportPlaybackEvent(this.player.nativeHandle, eventName, eventDetail);
  }

  setContentInfo(metadata: ConvivaMetadata): void {
    NativeModules.ConvivaModule.setContentInfo(this.player.nativeHandle, metadata);
  }

  setAdInfo(metadata: ConvivaMetadata): void {
    NativeModules.ConvivaModule.setAdInfo(this.player.nativeHandle, metadata);
  }

  destroy(): void {
    NativeModules.ConvivaModule.destroy(this.player.nativeHandle || -1);
  }
}
