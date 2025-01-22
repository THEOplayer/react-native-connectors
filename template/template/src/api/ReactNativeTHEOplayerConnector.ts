import type { THEOplayer } from 'react-native-theoplayer';
import { ReactNativeTHEOplayerConnectorAdapter } from '../internal/ReactNativeTHEOplayerConnectorAdapter';
import type { ReactNativeTHEOplayerConnectorConfiguration } from "./ReactNativeTHEOplayerConnectorConfiguration";

export class ReactNativeTHEOplayerConnector {

  private connectorAdapter: ReactNativeTHEOplayerConnectorAdapter

  /**
   * Create a new connector instance.
   *
   * @param player THEOplayer instance.
   * @param config configuration object.
   */
  constructor(player: THEOplayer, config: ReactNativeTHEOplayerConnectorConfiguration) {
    this.connectorAdapter = new ReactNativeTHEOplayerConnectorAdapter(player, config);
  }

  /**
   * Destroy connector.
   */
  destroy(): void {
    this.connectorAdapter.destroy();
  }
}
