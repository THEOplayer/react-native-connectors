import type { THEOplayer } from 'react-native-theoplayer';
import { ClientsideAdBeaconingConnectorAdapter } from '../internal/ClientsideAdBeaconingConnectorAdapter';

export class ClientsideAdBeaconingConnector {
  private connectorAdapter: ClientsideAdBeaconingConnectorAdapter;

  /**
   * Create ClientsideAdBeaconingConnector
   *
   * @param player          THEOplayer instance.
   */
  constructor(player: THEOplayer) {
    this.connectorAdapter = new ClientsideAdBeaconingConnectorAdapter(player);
  }

  /**
   * destroys the connector.
   */
  destroy(): void {
    this.connectorAdapter.destroy();
  }
}
