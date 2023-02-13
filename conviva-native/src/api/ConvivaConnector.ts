import type { THEOplayer } from 'react-native-theoplayer';
import { ConvivaConnectorAdapter } from '../internal/ConvivaConnectorAdapter';
import type { ConvivaConfiguration } from './ConvivaConfiguration';
import type { ConvivaMetadata } from './ConvivaMetadata';

export class ConvivaConnector {

  private connectorAdapter: ConvivaConnectorAdapter

  constructor(player: THEOplayer, convivaMetadata: ConvivaMetadata, convivaConfig: ConvivaConfiguration) {
    this.connectorAdapter = new ConvivaConnectorAdapter(player, convivaMetadata, convivaConfig);
  }


  /**
   * Sets Conviva metadata on the Conviva video analytics.
   * @param metadata object of key value pairs
   */
  setContentInfo(metadata: ConvivaMetadata): void {
    this.connectorAdapter.setContentInfo(metadata);
  }

  /**
   * Sets Conviva metadata on the Conviva ad analytics.
   * @param metadata object of key value pairs
   */
  setAdInfo(metadata: ConvivaMetadata): void {
    this.connectorAdapter.setAdInfo(metadata);
  }

  /**
   * Stops video and ad analytics and closes all sessions.
   */
  destroy(): void {
    this.connectorAdapter.destroy();
  }
}
