import type { THEOplayer } from 'react-native-theoplayer';
import { AdobeIdentityMap, AdobeMetadata } from '@theoplayer/react-native-analytics-adobe-edge';
import { AdobeConnectorAdapter } from './AdobeConnectorAdapter';
import { AdobeEdgeWebConfig } from '../api/AdobeEdgeWebConfig';
import { AdobeEdgeConnector } from './web/AdobeEdgeConnector';
import { ChromelessPlayer } from 'theoplayer';

export class AdobeConnectorAdapterWeb implements AdobeConnectorAdapter {
  private connector: AdobeEdgeConnector;

  constructor(player: THEOplayer, config: AdobeEdgeWebConfig, customIdentityMap?: AdobeIdentityMap) {
    this.connector = new AdobeEdgeConnector(player.nativeHandle as ChromelessPlayer, config, customIdentityMap);
  }

  setDebug(debug: boolean) {
    this.connector.setDebug(debug);
  }

  updateMetadata(metadata: AdobeMetadata): void {
    this.connector.updateMetadata(metadata);
  }

  setCustomIdentityMap(customIdentityMap: AdobeIdentityMap): void {
    this.connector?.setCustomIdentityMap(customIdentityMap);
  }

  setError(errorId: string): void {
    void this.connector.setError(errorId);
  }

  async stopAndStartNewSession(metadata?: AdobeMetadata): Promise<void> {
    this.connector.stopAndStartNewSession(metadata);
  }

  async destroy(): Promise<void> {
    return this.connector.destroy();
  }
}
