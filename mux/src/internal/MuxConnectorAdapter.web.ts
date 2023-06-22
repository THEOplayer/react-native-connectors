import type { THEOplayer } from 'react-native-theoplayer';
import initTHEOplayerMux from '@mux/mux-data-theoplayer';
import type { ChromelessPlayer } from 'theoplayer';

export class MuxConnectorAdapter {

  constructor(player: THEOplayer, options: any) {
    initTHEOplayerMux(player.nativeHandle as ChromelessPlayer, options, {});
  }

  destroy() {
    //
  }
}
