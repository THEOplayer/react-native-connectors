import type { THEOplayer } from 'react-native-theoplayer';
import { YospaceConnectorAdapter } from '../internal/YospaceConnectorAdapter';

export class YospaceConnector {
  private connectorAdapter: YospaceConnectorAdapter;

  /**
   * Create a new Yospace connector instance.
   *
   * @param player THEOplayer instance.
   */
  constructor(player: THEOplayer, debugFlags?: number) {
    this.connectorAdapter = new YospaceConnectorAdapter(player, debugFlags);
  }

  /**
   * Stops video and ad analytics and closes all sessions.
   */
  destroy(): void {
    this.connectorAdapter.destroy();
  }
}
