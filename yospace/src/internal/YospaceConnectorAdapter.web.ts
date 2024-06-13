import type { THEOplayer } from 'react-native-theoplayer';
import { YospaceConnector } from "@theoplayer/yospace-connector-web";
import type { ChromelessPlayer } from "theoplayer";

export class YospaceConnectorAdapter {
  private connector: YospaceConnector;

  constructor(player: THEOplayer) {
    this.connector = new YospaceConnector(player.nativeHandle as ChromelessPlayer);
  }

  destroy() {
    /* unused */
  }
}
