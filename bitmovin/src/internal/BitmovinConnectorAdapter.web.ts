import type { THEOplayer } from 'react-native-theoplayer';
import { AnalyticsConfig } from '../api/AnalyticsConfig';
import { ChromelessPlayer } from 'theoplayer';
import { CustomData, SourceMetadata } from '@theoplayer/react-native-analytics-bitmovin';
import { DefaultMetadata } from '../api/DefaultMetadata';

export class BitmovinConnectorAdapter {
  // private integration: TheoCollector;

  constructor(player: THEOplayer, config: AnalyticsConfig, defaultMetadata?: DefaultMetadata) {
    // this.integration = new TheoCollector(config, player.nativeHandle as ChromelessPlayer);
    // if (defaultMetadata) {
    //   this.integration.defaultMetadata = defaultMetadata;
    // }
  }

  updateSourceMetadata(sourceMetadata: SourceMetadata): void {
    // this.integration.sourceMetadata = sourceMetadata;
  }

  updateCustomData(customData: CustomData): void {
    // Not supported in web SDK
  }

  programChange(sourceMetadata: SourceMetadata): void {
    // NYI
  }

  sendCustomDataEvent(customData: CustomData): void {
    // Not supported in web SDK
  }

  destroy() {
    // Nothing to do.
  }
}
