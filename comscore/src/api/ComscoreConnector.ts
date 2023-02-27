import type { THEOplayer } from 'react-native-theoplayer';
import { ComscoreConnectorAdapter } from '../internal/ComscoreConnectorAdapter';
import type { ComscoreConfiguration } from './ComscoreConfiguration';
import type { ComscoreMetadata } from './ComscoreMetadata';

export class ComscoreConnector {

  private connectorAdapter: ComscoreConnectorAdapter

  constructor(player: THEOplayer, ComscoreMetadata: ComscoreMetadata, ComscoreConfig: ComscoreConfiguration) {
    this.connectorAdapter = new ComscoreConnectorAdapter(player, ComscoreMetadata, ComscoreConfig);
  }


  /**
   * Sets Comscore metadata on the Comscore video analytics.
   * @param metadata object of key value pairs
   */
  setContentInfo(metadata: ComscoreMetadata): void {
    this.connectorAdapter.setContentInfo(metadata);
  }

  /**
   * Sets Comscore metadata on the Comscore ad analytics.
   * @param metadata object of key value pairs
   */
  setAdInfo(metadata: ComscoreMetadata): void {
    this.connectorAdapter.setAdInfo(metadata);
  }

  /**
   * Stops video and ad analytics and closes all sessions.
   */
  destroy(): void {
    this.connectorAdapter.destroy();
  }
}
