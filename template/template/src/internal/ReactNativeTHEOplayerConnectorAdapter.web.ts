import type { THEOplayer } from 'react-native-theoplayer';
import type { ReactNativeTHEOplayerConnectorConfiguration } from '../api/ReactNativeTHEOplayerConnectorConfiguration';
import type { ChromelessPlayer } from 'theoplayer';

export class ReactNativeTHEOplayerConnectorAdapter {
  constructor(player: THEOplayer, _config: ReactNativeTHEOplayerConnectorConfiguration) {
    const nativeWebPlayer = player.nativeHandle as ChromelessPlayer;
    // Attach connector to native web player.
  }

  destroy() {
    // Clean-up
  }
}
