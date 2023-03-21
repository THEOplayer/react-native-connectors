import type { THEOplayer } from 'react-native-theoplayer';
import type { ComscoreConfiguration } from '../api/ComscoreConfiguration';
import type { ComscoreMetadata } from '../api/ComscoreMetadata';


// @ts-ignore
import { ComscoreTheo } from './ComscoreTheo';
import { AdMetadata } from './ComscoreAdMetadata';
import { ContentMetadata } from './ComscoreContentMetadata';

export class ComscoreConnectorAdapter {

  private integration: ComscoreTheo;

  constructor (player: THEOplayer, ComscoreMetadata: ComscoreMetadata, ComscoreConfig: ComscoreConfiguration) {
    this.integration = new ComscoreTheo(
      ComscoreConfig.publisherId,
      player,
      new ContentMetadata(ComscoreMetadata),
      new AdMetadata(),
    );
  }

  update(metadata: ComscoreMetadata): void {
    // TODO uncomment once Comscore version has been updated
    this.integration.setContentMetadata(new ContentMetadata(metadata));
  }

  setPersistentLabel(label: string, value: string): void {
    // TODO Implement web counterpart
  }

  setPersistentLabels(labels: { [key: string]: string }): void {
    // TODO Implement web counterpart
  }

  destroy() {
    // TODO do any cleanup if necessary
  }
}
