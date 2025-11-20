import type { THEOplayer } from 'react-native-theoplayer';
import * as THEOplayerConvivaConnector from '@theoplayer/conviva-connector-web';
import { Constants, ConvivaMetadata as NativeConvivaMetadata } from '@convivainc/conviva-js-coresdk';
import type { ConvivaConfiguration } from '../api/ConvivaConfiguration';
import type { ConvivaMetadata } from '../api/ConvivaMetadata';
import type { ConvivaEventDetail } from '../api/ConvivaEventDetail';
import { ConvivaConnectorAdapterSpec } from './ConvivaConnectorAdapterSpec';
import { ChromelessPlayer } from 'theoplayer';

export class ConvivaConnectorAdapter implements ConvivaConnectorAdapterSpec {
  private integration: THEOplayerConvivaConnector.ConvivaConnector;

  constructor(player: THEOplayer, convivaMetadata: ConvivaMetadata, convivaConfig: ConvivaConfiguration) {
    this.integration = new THEOplayerConvivaConnector.ConvivaConnector(
      // Cast VegaPlayer to ChromelessPlayer interface
      player.nativeHandle as unknown as ChromelessPlayer,
      convivaMetadata as NativeConvivaMetadata,
      {
        ...convivaConfig,
        deviceMetadata: {
          [Constants.DeviceMetadata.TYPE]: Constants.DeviceType.SETTOP,
          [Constants.DeviceMetadata.CATEGORY]: Constants.DeviceCategory.AMAZON,
          [Constants.DeviceMetadata.MANUFACTURER]: 'Amazon',
        },
      },
    );
  }

  stopAndStartNewSession(metadata: ConvivaMetadata): void {
    this.integration.stopAndStartNewSession(metadata);
  }

  reportPlaybackFailed(errorMessage: string): void {
    this.integration.reportPlaybackFailed(errorMessage);
  }

  reportPlaybackEvent(eventName: string, eventDetail: ConvivaEventDetail): void {
    this.integration.reportPlaybackEvent(eventName, eventDetail);
  }

  setContentInfo(metadata: ConvivaMetadata): void {
    this.integration.setContentInfo(metadata);
  }

  setAdInfo(metadata: ConvivaMetadata): void {
    this.integration.setAdInfo(metadata);
  }

  destroy() {
    this.integration.destroy();
  }
}
