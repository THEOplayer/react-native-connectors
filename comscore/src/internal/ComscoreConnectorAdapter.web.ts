import type { THEOplayer } from 'react-native-theoplayer';
import type { ComscoreConfiguration } from '../api/ComscoreConfiguration';
import type { ComscoreMetadata } from '../api/ComscoreMetadata';


// @ts-ignore
import type { ChromelessPlayer } from 'theoplayer';

export class ComscoreConnectorAdapter {

  // private integration: THEOplayerComscoreConnector.ComscoreConnector;

  // @ts-ignore
  constructor (player: THEOplayer, ComscoreMetadata: ComscoreMetadata, ComscoreConfig: ComscoreConfiguration) {
    // this.integration = new THEOplayerComscoreConnector.ComscoreConnector(
    //   // @ts-ignore
    //   player.nativeHandle as ChromelessPlayer,
    //   ComscoreMetadata as NativeComscoreMetadata,
    //   ComscoreConfig
    // );
  }

  setContentInfo(_: ComscoreMetadata): void {
    // TODO uncomment once Comscore version has been updated
    // this.integration.setContentInfo(metadata);
  }

  setAdInfo(_: ComscoreMetadata): void {
    // TODO uncomment once Comscore version has been updated
    // this.integration.setAdInfo(metadata);
  }

  destroy() {
    // this.integration.destroy();
  }
}
