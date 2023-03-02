import type { THEOplayer } from 'react-native-theoplayer';
import { NielsenConnectorAdapter } from '../internal/NielsenConnectorAdapter';
import type { NielsenConfiguration } from './NielsenConfiguration';
import type { NielsenMetadata } from './NielsenMetadata';

export class NielsenConnector {

  private connectorAdapter: NielsenConnectorAdapter

  constructor(player: THEOplayer, NielsenMetadata: NielsenMetadata, NielsenConfig: NielsenConfiguration) {
    this.connectorAdapter = new NielsenConnectorAdapter(player, NielsenMetadata, NielsenConfig);
  }

  /**
   * Sets Nielsen metadata on the Nielsen video analytics.
   * @param metadata object of key value pairs
   */
  setContentInfo(metadata: NielsenMetadata): void {
    this.connectorAdapter.setContentInfo(metadata);
  }

  /**
   * Sets Nielsen metadata on the Nielsen ad analytics.
   * @param metadata object of key value pairs
   */
  setAdInfo(metadata: NielsenMetadata): void {
    this.connectorAdapter.setAdInfo(metadata);
  }

  /**
   * Stops video and ad analytics and closes all sessions.
   */
  destroy(): void {
    this.connectorAdapter.destroy();
  }
}
