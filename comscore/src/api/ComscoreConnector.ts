import type { THEOplayer } from 'react-native-theoplayer';
import { ComscoreConnectorAdapter } from '../internal/ComscoreConnectorAdapter';
import type { ComscoreConfiguration } from './ComscoreConfiguration';
import type { ComscoreMetadata } from './ComscoreMetadata';

export class ComscoreConnector {
  private connectorAdapter: ComscoreConnectorAdapter;

  constructor(player: THEOplayer, ComscoreMetadata: ComscoreMetadata, ComscoreConfig: ComscoreConfiguration) {
    this.connectorAdapter = new ComscoreConnectorAdapter(player, ComscoreMetadata, ComscoreConfig);
  }

  /**
   * Sets/updates Comscore metadata on the Comscore video analytics.
   * @param metadata object of key value pairs
   */
  update(metadata: ComscoreMetadata): void {
    this.connectorAdapter.update(metadata);
  }

  /**
   * Set a persistent label on the ComScore PublisherConfiguration
   */
  setPersistentLabel(label: string, value: string): void {
    this.connectorAdapter.setPersistentLabel(label, value);
  }

  /**
   * Set persistent labels on the ComScore PublisherConfiguration
   * @param labels object of key value pairs
   */
  setPersistentLabels(labels: { [key: string]: string }): void {
    this.connectorAdapter.setPersistentLabels(labels);
  }

  /**
   * Destroy ComScoreStreamingAnalytics and unregister it from player
   */
  destroy(): void {
    this.connectorAdapter.destroy();
  }
}
