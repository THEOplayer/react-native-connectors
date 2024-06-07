import type { THEOplayer } from 'react-native-theoplayer';
import { NielsenConnectorAdapter } from '../internal/NielsenConnectorAdapter';
import type { NielsenOptions } from '@theoplayer/nielsen-connector-web';

export class NielsenConnector {
  private connectorAdapter: NielsenConnectorAdapter;

  /**
   * Create NielsenConnector
   *
   * @param player        THEOplayer instance.
   * @param appId         UniqueID assigned to player/site.
   * @param instanceName  User-defined string value for describing the player/site.
   * @param options       Additional options.
   */
  constructor(player: THEOplayer, appId: string, instanceName: string, options: NielsenOptions) {
    this.connectorAdapter = new NielsenConnectorAdapter(player, appId, instanceName, options);
  }

  /**
   * Adds metadata which will be sent on Nielsen requests.
   * @param metadata contains the key value pairs with data.
   */
  updateMetadata(metadata: { [key: string]: string }): void {
    this.connectorAdapter.updateMetadata(metadata);
  }

  /**
   * Stops video and ad analytics and closes all sessions.
   */
  destroy(): void {
    this.connectorAdapter.destroy();
  }
}
