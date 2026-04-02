import type { THEOplayer } from 'react-native-theoplayer';
import { BitmovinConnectorAdapter } from '../internal/BitmovinConnectorAdapter';
import { AnalyticsConfig } from './AnalyticsConfig';
import { SourceMetadata } from './SourceMetadata';
import { CustomData } from './CustomData';
import { DefaultMetadata } from './DefaultMetadata';
import { SsaiApi } from './SsaiApi';

export class BitmovinConnector {
  private connectorAdapter: BitmovinConnectorAdapter;

  /**
   * Create BitmovinConnector
   *
   * @param player          THEOplayer instance.
   * @param config          Configuration for Bitmovin Analytics.
   * @param defaultMetadata Initial source-independent data.
   */
  constructor(player: THEOplayer, config: AnalyticsConfig, defaultMetadata?: DefaultMetadata) {
    this.connectorAdapter = new BitmovinConnectorAdapter(player, config, defaultMetadata);
  }

  /**
   * Set or update metadata for the current source.
   *
   * **IMPORTANT:** Call this method before setting a new source on the player,
   * otherwise the metadata will not be associated with the correct source.
   *
   * @param sourceMetadata contains the key value pairs with data.
   */
  updateSourceMetadata(sourceMetadata: SourceMetadata): void {
    this.connectorAdapter.updateSourceMetadata(sourceMetadata);
  }

  /**
   * Set or update custom data for the current session.
   * This method allows you to change the value of a customData field during a session. The method can be called multiple times during a session and
   * will be merged with the existing customData.
   * @param customData
   */
  updateCustomData(customData: CustomData): void {
    this.connectorAdapter.updateCustomData(customData);
  }

  /**
   * Notifies the connector about a program change in a live stream.
   * @param sourceMetadata
   */
  programChange(sourceMetadata: SourceMetadata): void {
    this.connectorAdapter.programChange(sourceMetadata);
  }

  /**
   * Sends a custom data event with the provided custom data.
   * This method allows you to change the value of a customData field temporarily for one sample.
   * @param customData
   */
  sendCustomDataEvent(customData: CustomData): void {
    this.connectorAdapter.sendCustomDataEvent(customData);
  }

  /**
   * Provides access to the SSAI API for externally tracking ads in server-side ad insertion scenarios.
   */
  get ssai(): SsaiApi {
    return this.connectorAdapter.ssai;
  }

  /**
   * Stops video and ad analytics and closes all sessions.
   */
  destroy(): void {
    this.connectorAdapter.destroy();
  }
}
