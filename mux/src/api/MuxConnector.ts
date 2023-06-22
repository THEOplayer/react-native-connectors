import type { THEOplayer } from 'react-native-theoplayer';
import { MuxConnectorAdapter } from '../internal/MuxConnectorAdapter';

export class MuxConnector {

  private connectorAdapter: MuxConnectorAdapter;

  /**
   * Create a new Mux connector instance.
   */
  constructor(player: THEOplayer, options: any) {
    this.connectorAdapter = new MuxConnectorAdapter(player, options);
  }

  /**
   * Stops video and ad analytics and closes all sessions.
   */
  destroy(): void {
    this.connectorAdapter.destroy();
  }
}
