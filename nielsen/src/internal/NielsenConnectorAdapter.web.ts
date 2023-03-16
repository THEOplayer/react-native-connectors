import type { THEOplayer } from 'react-native-theoplayer';
import { NielsenConnector, NielsenOptions } from '@theoplayer/nielsen-connector-web';


// @ts-ignore
import type { ChromelessPlayer } from 'theoplayer';

export class NielsenConnectorAdapter {

  private integration: NielsenConnector;

  constructor(player: THEOplayer, appId: string, channelName: string, NielsenConfig: NielsenOptions) {
    this.integration = new NielsenConnector(
      player.nativeHandle as ChromelessPlayer,
      appId,
      channelName,
      NielsenConfig
    );
  }

  updateMetadata(metadata: { [ key: string ]: string }): void {
    this.integration.updateMetadata(metadata);
  }

  destroy() {
    this.integration.destroy();
  }
}
