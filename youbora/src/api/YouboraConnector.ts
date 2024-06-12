import type { THEOplayer } from 'react-native-theoplayer';
import type youbora from 'youboralib';
import { YouboraConnectorAdapter } from '../internal/YouboraConnectorAdapter';

export class YouboraConnector {
  private connectorAdapter: YouboraConnectorAdapter;

  /**
   * Create YouboraConnector
   *
   * @public
   */
  constructor(player: THEOplayer, options: youbora.Options, debugLevel?: youbora.Log.Level) {
    this.connectorAdapter = new YouboraConnectorAdapter(player, options, debugLevel);
  }

  /**
   * Change log level.
   * @param level
   */
  setDebugLevel(level: youbora.Log.Level) {
    this.connectorAdapter.setDebugLevel(level);
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
