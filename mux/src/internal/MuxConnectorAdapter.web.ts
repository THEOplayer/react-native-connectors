import type { THEOplayer } from 'react-native-theoplayer';
import initTHEOplayerMux from '@mux/mux-data-theoplayer';
import type { ChromelessPlayer } from 'theoplayer';
import * as THEOplayerWeb from 'theoplayer';
import type { MuxOptions } from "../api/MuxOptions";
import type { MuxData } from "../api/MuxData";

export class MuxConnectorAdapter {

  private connector: any;

  constructor(private player: THEOplayer, options: MuxOptions) {
    this.connector = initTHEOplayerMux(player.nativeHandle as ChromelessPlayer, options, THEOplayerWeb);
  }

  changeProgram(data: MuxData) {
    this.connector?.mux?.emit('programchange', data);
  }

  destroy() {
    //
  }
}
