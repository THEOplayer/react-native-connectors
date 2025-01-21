import type { THEOplayer } from 'react-native-theoplayer';
import { NielsenConnector as NativeNielsenConnector, NielsenOptions as NativeNielsenOptions } from '@theoplayer/nielsen-connector-web';
import type { ChromelessPlayer } from 'theoplayer';
import { NielsenOptions } from '@theoplayer/react-native-analytics-nielsen';

export class NielsenConnectorAdapter {
  private integration: NativeNielsenConnector;

  constructor(player: THEOplayer, appId: string, instanceName: string, options: NielsenOptions) {
    this.integration = new NativeNielsenConnector(player.nativeHandle as ChromelessPlayer, appId, instanceName, options as NativeNielsenOptions);
  }

  updateMetadata(metadata: { [key: string]: string }): void {
    this.integration.updateMetadata(metadata);
  }

  destroy() {
    this.integration.destroy();
  }
}
