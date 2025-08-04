import type { THEOplayer } from 'react-native-theoplayer';
import { AdscriptConnectorAdapter } from '../internal/AdscriptConnectorAdapter';
import { AdscriptMetadata } from './AdscriptMetadata';

export class AdscriptConnector {
  private connectorAdapter: AdscriptConnectorAdapter;

  /**
   * Create AdscriptConnector
   *
   * @param player A React Native THEOplayer instance.
   * @param implementationId The implementation ID you will receive from your Nielsen Admosphere representative.
   * @param contentMetadata Content metadata.
   * @param debug Whether to show debug logging.
   * @public
   */
  constructor(player: THEOplayer, implementationId: string, contentMetadata: AdscriptMetadata, debug?: boolean) {
    this.connectorAdapter = new AdscriptConnectorAdapter(player, implementationId, contentMetadata, debug);
  }

  /**
   * Update metadata.
   */
  updateMetadata(metadata: AdscriptMetadata) {
    this.connectorAdapter.updateMetadata(metadata);
  }

  /**
   * Stops video and ad analytics and closes all sessions.
   *
   * @public
   */
  destroy(): void {
    this.connectorAdapter.destroy();
  }
}
