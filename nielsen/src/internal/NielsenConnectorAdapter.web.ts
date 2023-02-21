import type { THEOplayer } from 'react-native-theoplayer';
import type { NielsenConfiguration } from '../api/NielsenConfiguration';
import type { NielsenMetadata } from '../api/NielsenMetadata';


// @ts-ignore
import type { ChromelessPlayer } from 'theoplayer';

export class NielsenConnectorAdapter {

  // private integration: THEOplayerNielsenConnector.NielsenConnector;

  // @ts-ignore
  constructor (player: THEOplayer, NielsenMetadata: NielsenMetadata, NielsenConfig: NielsenConfiguration) {
    // this.integration = new THEOplayerNielsenConnector.NielsenConnector(
    //   // @ts-ignore
    //   player.nativeHandle as ChromelessPlayer,
    //   NielsenMetadata as NativeNielsenMetadata,
    //   NielsenConfig
    // );
  }

  setContentInfo(_: NielsenMetadata): void {
    // TODO uncomment once Nielsen version has been updated
    // this.integration.setContentInfo(metadata);
  }

  setAdInfo(_: NielsenMetadata): void {
    // TODO uncomment once Nielsen version has been updated
    // this.integration.setAdInfo(metadata);
  }

  destroy() {
    // this.integration.destroy();
  }
}
