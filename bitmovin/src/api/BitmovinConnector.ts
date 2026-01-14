import type { THEOplayer } from 'react-native-theoplayer';
import { BitmovinConnectorAdapter } from '../internal/BitmovinConnectorAdapter';
import { BitmovinAnalyticsConfig } from './BitmovinAnalyticsConfig';

export class BitmovinConnector {
  private connectorAdapter: BitmovinConnectorAdapter;

  /**
   * Create BitmovinConnector
   *
   * @param player        THEOplayer instance.
   * @param config        Configuration for Bitmovin Analytics.
   */
  constructor(player: THEOplayer, config: BitmovinAnalyticsConfig) {
    this.connectorAdapter = new BitmovinConnectorAdapter(player, config);
  }

  /**
   * Adds metadata which will be sent on Bitmovin requests.
   * @param metadata contains the key value pairs with data.
   */
  updateMetadata(metadata: { [key: string]: string }): void {
    this.connectorAdapter.updateMetadata(metadata);
  }

  /**
   * Stops video and ad analytics and closes all sessions.
   */
  destroy(): void {
    this.connectorAdapter.destroy();
  }
}
