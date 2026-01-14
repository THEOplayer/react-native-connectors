import type { THEOplayer } from 'react-native-theoplayer';
import { TheoCollector } from '@qualabs/bitmovin-analytics-collector-theoplayer';
import { BitmovinAnalyticsConfig } from '../api/BitmovinAnalyticsConfig';
import { ChromelessPlayer } from 'theoplayer';

export class BitmovinConnectorAdapter {
  private integration: TheoCollector;

  constructor(player: THEOplayer, config: BitmovinAnalyticsConfig) {
    this.integration = new TheoCollector(config, player.nativeHandle as ChromelessPlayer);
  }

  updateMetadata(metadata: { [key: string]: string }): void {
    // this.integration.sourceMetadata(metadata);
  }

  destroy() {
    // this.integration.destroy();
  }
}
