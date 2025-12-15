import type { THEOplayer } from 'react-native-theoplayer';
import type { AdobeCustomMetadataDetails, AdobeErrorDetails } from '@theoplayer/react-native-analytics-adobe-edge';
import { AdobeConnectorAdapter } from './AdobeConnectorAdapter';
import { AdobeEdgeWebConfig } from '../api/AdobeEdgeWebConfig';
import { AdobeEdgeConnector } from './web/AdobeEdgeConnector';
import { ChromelessPlayer } from 'theoplayer';

export class AdobeConnectorAdapterWeb implements AdobeConnectorAdapter {
  private connector: AdobeEdgeConnector;

  constructor(player: THEOplayer, config: AdobeEdgeWebConfig) {
    this.connector = new AdobeEdgeConnector(player.nativeHandle as ChromelessPlayer, config);
  }

  setDebug(debug: boolean) {
    this.connector.setDebug(debug);
  }

  updateMetadata(metadata: AdobeCustomMetadataDetails[]): void {
    this.connector.updateMetadata(metadata);
  }

  setError(errorDetails: AdobeErrorDetails): void {
    void this.connector.setError(errorDetails);
  }

  async stopAndStartNewSession(metadata?: AdobeCustomMetadataDetails[]): Promise<void> {
    await this.connector.stopAndStartNewSession(metadata);
  }

  async destroy(): Promise<void> {
    return this.connector.destroy();
  }
}
