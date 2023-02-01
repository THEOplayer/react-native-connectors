import type { THEOplayer } from 'react-native-theoplayer';
import type { ConvivaConfiguration } from './ConvivaConfiguration';
import type { ConvivaMetadata } from './ConvivaMetadata';

export class ConvivaConnectorAdapter {

  constructor (private player: THEOplayer, convivaMetadata: ConvivaMetadata, convivaConfig: ConvivaConfiguration) {
    // TODO
  }

  destroy() {
    // TODO
  }
}
