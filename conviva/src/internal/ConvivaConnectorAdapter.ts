import type { NativeHandleType, THEOplayer } from 'react-native-theoplayer';
import type { ConvivaConfiguration } from '../api/ConvivaConfiguration';
import type { ConvivaMetadata } from '../api/ConvivaMetadata';
import { NativeModules } from 'react-native';
import type { ConvivaEventDetail } from '../api/ConvivaEventDetail';

export class ConvivaConnectorAdapter {
  private readonly nativeHandle: NativeHandleType;

  constructor(player: THEOplayer, convivaMetadata: ConvivaMetadata, convivaConfig: ConvivaConfiguration) {
    this.nativeHandle = player.nativeHandle || -1;
    NativeModules.ConvivaModule.initialize(this.nativeHandle, convivaMetadata, convivaConfig);
  }

  stopAndStartNewSession(metadata: ConvivaMetadata): void {
    NativeModules.ConvivaModule.stopAndStartNewSession(this.nativeHandle, metadata);
  }

  reportPlaybackFailed(errorMessage: string): void {
    NativeModules.ConvivaModule.reportPlaybackFailed(this.nativeHandle, errorMessage);
  }

  reportPlaybackEvent(eventName: string, eventDetail: ConvivaEventDetail): void {
    NativeModules.ConvivaModule.reportPlaybackEvent(this.nativeHandle, eventName, eventDetail);
  }

  setContentInfo(metadata: ConvivaMetadata): void {
    NativeModules.ConvivaModule.setContentInfo(this.nativeHandle, metadata);
  }

  setAdInfo(metadata: ConvivaMetadata): void {
    NativeModules.ConvivaModule.setAdInfo(this.nativeHandle, metadata);
  }

  destroy(): void {
    NativeModules.ConvivaModule.destroy(this.nativeHandle);
  }
}
