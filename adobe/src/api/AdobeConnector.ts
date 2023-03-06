import type { THEOplayer } from "react-native-theoplayer";

export class AdobeConnector {
  private player: THEOplayer;

  constructor(player: THEOplayer) {
    this.player = player
  }

}
