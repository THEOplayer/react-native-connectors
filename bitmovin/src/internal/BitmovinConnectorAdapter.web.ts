import type { THEOplayer } from 'react-native-theoplayer';
import { AnalyticsConfig } from '../api/AnalyticsConfig';
import { ChromelessPlayer } from 'theoplayer';
import { CustomData, SourceMetadata } from '@theoplayer/react-native-analytics-bitmovin';
import { DefaultMetadata } from '../api/DefaultMetadata';
import { CustomDataValues, THEOplayerAdapter } from 'bitmovin-analytics';
import { buildWebConfigFromDefaultMetadata, buildWebConfigFromSourceMetadata, buildWebSourceMetadata } from './web/BitmovinAdapterWeb';

export class BitmovinConnectorAdapter {
  private readonly integration: THEOplayerAdapter;

  constructor(player: THEOplayer, config: AnalyticsConfig, defaultMetadata?: DefaultMetadata) {
    const webConfig = buildWebConfigFromDefaultMetadata(config, defaultMetadata);
    this.integration = new THEOplayerAdapter(webConfig, player.nativeHandle as ChromelessPlayer);
  }

  updateSourceMetadata(sourceMetadata: SourceMetadata): void {
    this.integration.sourceChange(buildWebConfigFromSourceMetadata(sourceMetadata));
  }

  updateCustomData(customData: CustomData): void {
    this.integration.setCustomData(customData as CustomDataValues);
  }

  programChange(sourceMetadata: SourceMetadata): void {
    this.integration.programChange(buildWebSourceMetadata(sourceMetadata));
  }

  sendCustomDataEvent(customData: CustomData): void {
    // Not supported in web SDK
  }

  destroy() {
    console.log('Destroying Bitmovin Analytics Connector');
  }
}
