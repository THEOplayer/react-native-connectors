import type { THEOplayer } from 'react-native-theoplayer';
import { NielsenConnectorAdapter } from '../internal/NielsenConnectorAdapter';
import type { NielsenOptions } from "@theoplayer/nielsen-connector-web";

export class NielsenConnector {

  private connectorAdapter: NielsenConnectorAdapter

  constructor(player: THEOplayer, appId: string, channelName: string, NielsenConfig: NielsenOptions) {
    this.connectorAdapter = new NielsenConnectorAdapter(player, appId, channelName, NielsenConfig);
  }

  /**
   * Adds metadata which will be sent on Nielsen requests.
   * @param metadata contains the key value pairs with data.
   */
  updateMetadata(metadata: {[key: string]: string}): void {
    this.connectorAdapter.updateMetadata(metadata);
  }

  /**
   * Stops video and ad analytics and closes all sessions.
   */
  destroy(): void {
    this.connectorAdapter.destroy();
  }
}
