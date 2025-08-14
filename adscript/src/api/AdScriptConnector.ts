import type { THEOplayer } from 'react-native-theoplayer';
import { AdScriptConnectorAdapter } from '../internal/AdScriptConnectorAdapter';
import { AdScriptMetadata } from './AdScriptMetadata';
import { AdScriptI12n } from './AdScriptI12n';

export class AdScriptConnector {
  private connectorAdapter: AdScriptConnectorAdapter;

  /**
   * Create AdScriptConnector
   *
   * @param player A React Native THEOplayer instance.
   * @param implementationId The implementation ID you will receive from your Nielsen Admosphere representative.
   * @param contentMetadata Content metadata.
   * @param debug Whether to show debug logging.
   * @public
   */
  constructor(player: THEOplayer, implementationId: string, contentMetadata: AdScriptMetadata, debug?: boolean) {
    this.connectorAdapter = new AdScriptConnectorAdapter(player, implementationId, contentMetadata, debug);
  }

  /**
   * Update metadata.
   */
  updateMetadata(metadata: AdScriptMetadata) {
    this.connectorAdapter.updateMetadata(metadata);
  }

  /**
   * Update logged-in user info.
   */
  updateUser(user: AdScriptI12n) {
    this.connectorAdapter.updateUser(user);
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
