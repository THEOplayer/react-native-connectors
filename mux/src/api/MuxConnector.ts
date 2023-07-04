import type { THEOplayer } from 'react-native-theoplayer';
import { MuxConnectorAdapter } from '../internal/MuxConnectorAdapter';
import type { MuxOptions } from "./MuxOptions";
import type { MuxData } from "./MuxData";

export class MuxConnector {

  private connectorAdapter: MuxConnectorAdapter;

  /**
   * Create a new Mux connector instance.
   */
  constructor(player: THEOplayer, options: MuxOptions) {
    this.connectorAdapter = new MuxConnectorAdapter(player, options);
  }

  /**
   * In some cases, you may have the program change within a stream, and you may want to track each program as a
   * view on its own. An example of this is a live stream that streams multiple programs back to back,
   * with no interruptions.
   * You can include any metadata when changing the video but you should only need to update the values that start
   * with video.
   */
  changeProgram(data: MuxData) {
    this.connectorAdapter.changeProgram(data);
  }

  /**
   * Stops video and ad analytics and closes all sessions.
   */
  destroy(): void {
    this.connectorAdapter.destroy();
  }
}
