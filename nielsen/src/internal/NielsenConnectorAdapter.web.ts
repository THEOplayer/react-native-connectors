import type { THEOplayer } from 'react-native-theoplayer';
import { NielsenConnector, NielsenOptions } from '@theoplayer/nielsen-connector-web';

import type { ChromelessPlayer } from 'theoplayer';

export class NielsenConnectorAdapter {
  private integration: NielsenConnector;

  constructor(player: THEOplayer, appId: string, instanceName: string, options: NielsenOptions) {
    this.integration = new NielsenConnector(player.nativeHandle as ChromelessPlayer, appId, instanceName, options);
  }

  updateMetadata(metadata: { [key: string]: string }): void {
    this.integration.updateMetadata(metadata);
  }

  destroy() {
    this.integration.destroy();
  }
}
