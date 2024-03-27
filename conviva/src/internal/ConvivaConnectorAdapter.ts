import type { THEOplayer } from 'react-native-theoplayer';
import type { ConvivaConfiguration } from '../api/ConvivaConfiguration';
import type { ConvivaMetadata } from '../api/ConvivaMetadata';
import { NativeModules } from 'react-native';
import type {ConvivaEventAttributes} from "../api/ConvivaEventAttributes";

export class ConvivaConnectorAdapter {

  constructor (private player: THEOplayer, convivaMetadata: ConvivaMetadata, convivaConfig: ConvivaConfiguration) {
    NativeModules.ConvivaModule.initialize(this.player.nativeHandle, convivaMetadata, convivaConfig);
  }

  stopAndStartNewSession(metadata: ConvivaMetadata): void {
    NativeModules.ConvivaModule.stopAndStartNewSession(this.player.nativeHandle, metadata);
  }

  reportPlaybackFailed(errorMessage: string): void {
    NativeModules.ConvivaModule.reportPlaybackFailed(this.player.nativeHandle, errorMessage);
  }

  reportCustomPlaybackEvent(eventName: string, attributes: ConvivaEventAttributes): void {
    NativeModules.ConvivaModule.reportPlaybackFailed(this.player.nativeHandle, eventName, attributes);
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
