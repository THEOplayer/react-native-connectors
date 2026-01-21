import type { THEOplayer } from 'react-native-theoplayer';
import { TheoCollector } from '@qualabs/bitmovin-analytics-collector-theoplayer';
import { AnalyticsConfig } from '../api/AnalyticsConfig';
import { ChromelessPlayer } from 'theoplayer';
import { CustomData, SourceMetadata } from '@theoplayer/react-native-analytics-bitmovin';

export class BitmovinConnectorAdapter {
  private integration: TheoCollector;

  constructor(player: THEOplayer, config: AnalyticsConfig, metadata?: SourceMetadata) {
    this.integration = new TheoCollector(config, player.nativeHandle as ChromelessPlayer);
    if (metadata) {
      this.integration.sourceMetadata = metadata;
    }
  }

  updateSourceMetadata(metadata: SourceMetadata): void {
    this.integration.sourceMetadata = metadata;
  }

  updateCustomData(customData: CustomData): void {
    // Not supported in web SDK
  }

  sendCustomDataEvent(customData: CustomData): void {
    // Not supported in web SDK
  }

  destroy() {
    // Nothing to do.
  }
}
