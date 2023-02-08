import type { THEOplayer } from 'react-native-theoplayer';
import * as THEOplayerConvivaConnector from '@theoplayer/conviva-connector-web';
import type { ConvivaMetadata as NativeConvivaMetadata } from '@convivainc/conviva-js-coresdk';
import type { ConvivaConfiguration } from './ConvivaConfiguration';
import type { ConvivaMetadata } from './ConvivaMetadata';
import type { ChromelessPlayer } from 'theoplayer';

export class ConvivaConnectorAdapter {

  private integration: THEOplayerConvivaConnector.ConvivaConnector;

  constructor (player: THEOplayer, convivaMetadata: ConvivaMetadata, convivaConfig: ConvivaConfiguration) {
    this.integration = new THEOplayerConvivaConnector.ConvivaConnector(
      // @ts-ignore
      player.nativeHandle as ChromelessPlayer,
      convivaMetadata as NativeConvivaMetadata,
      convivaConfig
    );
  }

  setContentInfo(_: ConvivaMetadata): void {
    // TODO uncomment once conviva version has been updated
    // this.integration.setContentInfo(metadata);
  }

  setAdInfo(_: ConvivaMetadata): void {
    // TODO uncomment once conviva version has been updated
    // this.integration.setAdInfo(metadata);
  }

  destroy() {
    this.integration.destroy();
  }
}
