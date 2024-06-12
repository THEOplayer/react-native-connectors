import type { THEOplayer } from 'react-native-theoplayer';
import type { ComscoreConfiguration } from '../api/ComscoreConfiguration';
import type { ComscoreMetadata } from '../api/ComscoreMetadata';

import { ComscoreTheo } from './web/ComscoreTheo';
import { AdMetadata } from './web/ComscoreAdMetadata';
import { ContentMetadata } from './web/ComscoreContentMetadata';

export class ComscoreConnectorAdapter {
  private integration: ComscoreTheo;

  constructor(player: THEOplayer, ComscoreMetadata: ComscoreMetadata, ComscoreConfig: ComscoreConfiguration) {
    this.integration = new ComscoreTheo(
      ComscoreConfig.publisherId,
      player,
      new ContentMetadata(ComscoreMetadata),
      new AdMetadata(),
      ComscoreConfig.usagePropertiesAutoUpdateMode,
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
    this.integration.destroy();
  }
}
