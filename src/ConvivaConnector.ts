import type { THEOplayer } from 'react-native-theoplayer';
import { ConvivaConnectorAdapter } from './ConvivaConnectorAdapter';
import type { ConvivaConfiguration } from './ConvivaConfiguration';
import type { ConvivaMetadata } from './ConvivaMetadata';

export class ConvivaConnector {

  private connectorAdapter: ConvivaConnectorAdapter

  constructor(player: THEOplayer, convivaMetadata: ConvivaMetadata, convivaConfig: ConvivaConfiguration) {
    this.connectorAdapter = new ConvivaConnectorAdapter(player, convivaMetadata, convivaConfig);
  }

  /**
   * Stops video and ad analytics and closes all sessions.
   */
  destroy(): void {
    this.connectorAdapter.destroy();
  }
}
