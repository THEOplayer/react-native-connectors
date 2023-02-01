import type { THEOplayer } from 'react-native-theoplayer';
import * as THEOplayerConvivaConnector from '@theoplayer/conviva-connector-web';
import type { ConvivaMetadata as NativeConvivaMetadata } from '@convivainc/conviva-js-coresdk';
import type { ConvivaConfiguration } from './ConvivaConfiguration';
import type { ConvivaMetadata } from './ConvivaMetadata';

export class ConvivaConnectorAdapter {

  private integration: THEOplayerConvivaConnector.ConvivaConnector;

  constructor (player: THEOplayer, convivaMetadata: ConvivaMetadata, convivaConfig: ConvivaConfiguration) {
    this.integration = new THEOplayerConvivaConnector.ConvivaConnector(
      player, // TODO: we need to be able to access the native player, e.g. player.nativePlayer
      convivaMetadata as NativeConvivaMetadata,
      convivaConfig
    );
  }

  destroy() {
  }
}
