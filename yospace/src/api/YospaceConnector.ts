import type { THEOplayer } from 'react-native-theoplayer';
import { YospaceConnectorAdapter } from '../internal/YospaceConnectorAdapter';

export class YospaceConnector {
  private connectorAdapter: YospaceConnectorAdapter;

  /**
   * Create a new Yospace connector instance.
   *
   * @param player THEOplayer instance.
   */
  constructor(player: THEOplayer) {
    this.connectorAdapter = new YospaceConnectorAdapter(player);
  }

  /**
   * Stops video and ad analytics and closes all sessions.
   */
  destroy(): void {
    this.connectorAdapter.destroy();
  }
}
