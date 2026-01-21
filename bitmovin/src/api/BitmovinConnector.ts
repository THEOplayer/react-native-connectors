import type { THEOplayer } from 'react-native-theoplayer';
import { BitmovinConnectorAdapter } from '../internal/BitmovinConnectorAdapter';
import { AnalyticsConfig } from './AnalyticsConfig';
import { SourceMetadata } from './SourceMetadata';
import { CustomData } from './CustomData';

export class BitmovinConnector {
  private connectorAdapter: BitmovinConnectorAdapter;

  /**
   * Create BitmovinConnector
   *
   * @param player          THEOplayer instance.
   * @param config          Configuration for Bitmovin Analytics.
   * @param sourceMetadata  Optional initial source metadata.
   */
  constructor(player: THEOplayer, config: AnalyticsConfig, sourceMetadata?: SourceMetadata) {
    this.connectorAdapter = new BitmovinConnectorAdapter(player, config, sourceMetadata);
  }

  /**
   * Set or update metadata for the current source.
   * @param metadata contains the key value pairs with data.
   */
  updateSourceMetadata(metadata: SourceMetadata): void {
    this.connectorAdapter.updateSourceMetadata(metadata);
  }

  /**
   * Set or update custom data for the current session.
   * @param customData
   */
  updateCustomData(customData: CustomData): void {
    this.connectorAdapter.updateCustomData(customData);
  }

  /**
   * Sends a custom data event with the provided custom data.
   * @param customData
   */
  sendCustomDataEvent(customData: CustomData): void {
    this.connectorAdapter.sendCustomDataEvent(customData);
  }

  /**
   * Stops video and ad analytics and closes all sessions.
   */
  destroy(): void {
    this.connectorAdapter.destroy();
  }
}
