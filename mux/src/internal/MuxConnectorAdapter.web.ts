import type { THEOplayer } from 'react-native-theoplayer';
import initTHEOplayerMux from '@mux/mux-data-theoplayer';
import type { ChromelessPlayer } from 'theoplayer';
import * as THEOplayerWeb from 'theoplayer';
import type { MuxOptions } from '../api/MuxOptions';
import type { MuxData } from '../api/MuxData';
import type { MuxPresentation } from '../api/MuxConnector';

export class MuxConnectorAdapter {
  private connector: any;

  constructor(player: THEOplayer, options: MuxOptions) {
    this.connector = initTHEOplayerMux(player.nativeHandle as ChromelessPlayer, options, THEOplayerWeb);
  }

  changeVideo(data: MuxData) {
    this.connector?.emit('videochange', data);
  }

  changeProgram(data: MuxData) {
    this.connector?.emit('programchange', data);
  }

  changePresentation(_presentation: MuxPresentation) {
    // Not available for web
  }

  notifyError(code: number, message: string, context: string) {
    this.connector?.emit('error', {
      player_error_code: code,
      player_error_message: message,
      player_error_context: context,
    });
  }

  destroy() {
    /* unused */
  }
}
