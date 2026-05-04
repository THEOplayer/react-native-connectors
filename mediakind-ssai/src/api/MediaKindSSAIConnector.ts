import type { THEOplayer } from 'react-native-theoplayer';
import { MediaKindSSAIConnectorAdapter } from '../internal/MediaKindSSAIConnectorAdapter';

export class MediaKindSSAIConnector {
  private connectorAdapter: MediaKindSSAIConnectorAdapter;

  /**
   * Create MediaKindSSAIConnector
   *
   * @param player          THEOplayer instance.
   */
  constructor(player: THEOplayer) {
    this.connectorAdapter = new MediaKindSSAIConnectorAdapter(player);
  }

  /**
   * destroys the connector.
   */
  destroy(): void {
    this.connectorAdapter.destroy();
  }
}
