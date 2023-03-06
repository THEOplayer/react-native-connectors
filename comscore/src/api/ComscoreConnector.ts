import type { THEOplayer } from 'react-native-theoplayer';
import { ComscoreConnectorAdapter } from '../internal/ComscoreConnectorAdapter';
import type { ComscoreConfiguration } from './ComscoreConfiguration';
import type { ComscoreMetadata } from './ComscoreMetadata';

export class ComscoreConnector {

  private connectorAdapter: ComscoreConnectorAdapter

  constructor(player: THEOplayer, comscoreMetadata: ComscoreMetadata, comscoreConfig: ComscoreConfiguration) {
    this.connectorAdapter = new ComscoreConnectorAdapter(player, comscoreMetadata, comscoreConfig);
  }

  /**
   * Stops video and ad analytics and closes all sessions.
   */
  destroy(): void {
    this.connectorAdapter.destroy();
  }
}
