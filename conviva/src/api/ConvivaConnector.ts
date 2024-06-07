import type { THEOplayer } from 'react-native-theoplayer';
import { ConvivaConnectorAdapter } from '../internal/ConvivaConnectorAdapter';
import type { ConvivaConfiguration } from './ConvivaConfiguration';
import type { ConvivaMetadata } from './ConvivaMetadata';
import type { ConvivaEventDetail } from './ConvivaEventDetail';

export class ConvivaConnector {
  private connectorAdapter: ConvivaConnectorAdapter;

  /**
   * Create a new Conviva connector instance.
   *
   * @param player THEOplayer instance.
   * @param convivaMetadata object of key value pairs with initial metadata.
   * @param convivaConfig configuration object.
   */
  constructor(player: THEOplayer, convivaMetadata: ConvivaMetadata, convivaConfig: ConvivaConfiguration) {
    this.connectorAdapter = new ConvivaConnectorAdapter(player, convivaMetadata, convivaConfig);
  }

  /**
   * Sets Conviva metadata on the Conviva video analytics.
   *
   * @param metadata object of key value pairs.
   */
  setContentInfo(metadata: ConvivaMetadata): void {
    this.connectorAdapter.setContentInfo(metadata);
  }

  /**
   * Sets Conviva metadata on the Conviva ad analytics.
   *
   * @param metadata object of key value pairs.
   */
  setAdInfo(metadata: ConvivaMetadata): void {
    this.connectorAdapter.setAdInfo(metadata);
  }

  /**
   * Explicitly stop the current session and start a new one.
   *
   * This can be used to manually mark the start of a new session during a live stream,
   * for example when a new program starts.
   * By default, new sessions are only started on play-out of a new source, or when an ad break starts.
   *
   * @param metadata object of key value pairs.
   */
  stopAndStartNewSession(metadata: ConvivaMetadata): void {
    this.connectorAdapter.stopAndStartNewSession(metadata);
  }

  /**
   * Sets an error to the conviva session and closes the session.
   *
   * @param errorMessage string explaining what the error is.
   */
  reportPlaybackFailed(errorMessage: string): void {
    this.connectorAdapter.reportPlaybackFailed(errorMessage);
  }

  /**
   * Reports a custom event to Conviva.
   *
   * @param eventType string explaining what kind of event it is.
   * @param eventDetail object of key value pairs.
   */
  reportPlaybackEvent(eventType: string, eventDetail: ConvivaEventDetail): void {
    this.connectorAdapter.reportPlaybackEvent(eventType, eventDetail);
  }

  /**
   * Stops video and ad analytics and closes all sessions.
   */
  destroy(): void {
    this.connectorAdapter.destroy();
  }
}
