import type { THEOplayer } from 'react-native-theoplayer';
import { YospaceConnector } from "@theoplayer/yospace-connector-web";
import type { ChromelessPlayer } from "theoplayer";

export class YospaceConnectorAdapter {
  private connector: YospaceConnector;

  constructor(player: THEOplayer, _debugFlags: number = 0) {
    this.connector = new YospaceConnector(player.nativeHandle as ChromelessPlayer);

    // TODO:
    // this.connector.setupYospaceSession()
    console.warn('THEOplayer Yospace connector does not support Web yet.');
  }

  destroy() {
    /* unused */
  }
}
