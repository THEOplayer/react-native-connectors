import type { ConvivaEventDetail, ConvivaMetadata } from '@theoplayer/react-native-analytics-conviva';

export interface ConvivaConnectorAdapter {
  stopAndStartNewSession(metadata: ConvivaMetadata): void;
  reportPlaybackFailed(errorMessage: string): void;
  reportPlaybackEvent(eventName: string, eventDetail: ConvivaEventDetail): void;
  setContentInfo(metadata: ConvivaMetadata): void;
  setAdInfo(metadata: ConvivaMetadata): void;
  destroy(): void;
}
