import { AdobeCustomMetadataDetails, AdobeErrorDetails, AdobeIdentityMap } from '@theoplayer/react-native-analytics-adobe-edge';

export interface AdobeConnectorAdapter {
  setDebug(debug: boolean): void;

  updateMetadata(metadata: AdobeCustomMetadataDetails[]): void;

  setCustomIdentityMap(customIdentityMap: AdobeIdentityMap): void;

  setError(metadata: AdobeErrorDetails): void;

  stopAndStartNewSession(metadata?: AdobeCustomMetadataDetails[]): Promise<void>;

  destroy(): Promise<void>;
}
