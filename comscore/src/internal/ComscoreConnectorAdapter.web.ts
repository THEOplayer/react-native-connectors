import type { THEOplayer } from 'react-native-theoplayer';
import type { ComscoreConfiguration } from '../api/ComscoreConfiguration';

import type { ComscoreMetadata } from '../api/ComscoreMetadata';
import { AdMetadata } from "./web/comscore/AdMetadata";
import { ContentMetadata } from "./web/comscore/ContentMetadata";
import { ComscoreTheo } from "./web/integration/ComscoreTheo";

export class ComscoreConnectorAdapter {

  // @ts-ignore
  private integration: ComscoreTheo;

  // @ts-ignore
  constructor (player: THEOplayer, comscoreMetadata: ComscoreMetadata, comscoreConfig: ComscoreConfiguration) {

    // @ts-ignore
    const contentMetadata = new ContentMetadata(comscoreMetadata);
    const adMetadata = new AdMetadata();
    this.integration = new ComscoreTheo('123', player.nativeHandle as THEOplayer.ChromelessPlayer, contentMetadata, adMetadata);
  }

  destroy() {
    // this.integration.destroy();
  }
}
