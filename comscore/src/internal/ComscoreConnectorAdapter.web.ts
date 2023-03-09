import type { THEOplayer } from 'react-native-theoplayer';
import type { ComscoreConfiguration } from '../api/ComscoreConfiguration';
import type { ComscoreMetadata } from '../api/ComscoreMetadata';


// @ts-ignore
import type { ChromelessPlayer } from 'theoplayer';
import { ComscoreTheo } from './ComscoreTheo';
import { AdMetadata } from './ComscoreAdMetadata';
import { ContentMetadata } from './ComscoreContentMetadata';
import type { IContentMetadata } from './IComscoreContentMetadata';

export class ComscoreConnectorAdapter {

  private integration: ComscoreTheo;

  // // @ts-ignore
  // constructor (player: THEOplayer, ComscoreMetadata: ComscoreMetadata, ComscoreConfig: ComscoreConfiguration) {
  //   this.integration = new ComscoreTheo(
  //     // @ts-ignore
  //     player.nativeHandle as ChromelessPlayer,
  //     ComscoreMetadata as NativeComscoreMetadata, // TODO uitleg vragen
  //     ComscoreConfig
  //   );
  // }

  constructor (player: THEOplayer, ComscoreMetadata: ComscoreMetadata, ComscoreConfig: ComscoreConfiguration) {
    this.integration = new ComscoreTheo(
      ComscoreConfig.customerKey,
      player,
      new ContentMetadata(ComscoreMetadata),
      new AdMetadata(),
    );
  }

  setContentInfo(metadata: ComscoreMetadata): void {
    // TODO uncomment once Comscore version has been updated
    this.integration.setContentMetadata(new ContentMetadata(metadata));
  }

  setAdInfo(metadata: ComscoreMetadata): void {
    // TODO uncomment once Comscore version has been updated
    this.integration.setAdMetadata(new AdMetadata(metadata));
  }

  destroy() {
    this.integration.destroy(); // TODO
  }
}
