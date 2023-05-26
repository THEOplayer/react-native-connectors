import type { THEOplayer } from 'react-native-theoplayer';
import * as THEOplayerConvivaConnector from '@theoplayer/conviva-connector-web';
import type { ConvivaMetadata as NativeConvivaMetadata } from '@convivainc/conviva-js-coresdk';
import type { ConvivaConfiguration } from '../api/ConvivaConfiguration';
import type { ConvivaMetadata } from '../api/ConvivaMetadata';
import type { ChromelessPlayer } from 'theoplayer';

export class ConvivaConnectorAdapter {

  private integration: THEOplayerConvivaConnector.ConvivaConnector;

  constructor (player: THEOplayer, convivaMetadata: ConvivaMetadata, convivaConfig: ConvivaConfiguration) {
    this.integration = new THEOplayerConvivaConnector.ConvivaConnector(
      player.nativeHandle as ChromelessPlayer,
      convivaMetadata as NativeConvivaMetadata,
      convivaConfig
    );
  }

  stopAndStartNewSession(metadata: ConvivaMetadata): void {
    this.integration.stopAndStartNewSession(metadata)
  }

  reportPlaybackFailed(errorMessage: string): void {
    this.integration.reportPlaybackFailed(errorMessage);
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
