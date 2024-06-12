import type { THEOplayer } from 'react-native-theoplayer';
import type { ChromelessPlayer } from 'theoplayer';
import 'youbora-adapter-theoplayer2';
import youbora from 'youboralib';

export class YouboraConnectorAdapter {
  private plugin?: youbora.Plugin;

  constructor(player: THEOplayer, options: youbora.Options, logLevel?: youbora.Log.Level) {
    youbora.Log.logLevel = logLevel || youbora.Log.Level.SILENT;

    try {
      if (typeof youbora.adapters.TheoPlayer2 != 'undefined') {
        this.plugin = new youbora.Plugin(options);
        this.plugin.setAdapter(new youbora.adapters.TheoPlayer2(player.nativeHandle as ChromelessPlayer));
      }
    } catch (err) {
      console.error(err);
    }
  }

  setDebugLevel(level: youbora.Log.Level) {
    youbora.Log.logLevel = level;
  }

  destroy() {
    this.plugin = undefined;
  }
}
