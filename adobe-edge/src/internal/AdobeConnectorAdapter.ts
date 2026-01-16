import { AdobeIdentityMap, AdobeMetadata } from '@theoplayer/react-native-analytics-adobe-edge';

export interface AdobeConnectorAdapter {
  setDebug(debug: boolean): void;

  updateMetadata(metadata: AdobeMetadata): void;

  setCustomIdentityMap(customIdentityMap: AdobeIdentityMap): void;

  setError(errorId: string): void;

  stopAndStartNewSession(metadata?: AdobeMetadata): Promise<void>;

  destroy(): Promise<void>;
}
