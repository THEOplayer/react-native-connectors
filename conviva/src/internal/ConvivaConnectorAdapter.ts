import type { ConvivaEventDetail, ConvivaMetadata } from '@theoplayer/react-native-analytics-conviva';

/**
 * Common interface for Conviva connector adapters.
 */
export interface ConvivaConnectorAdapter {
  /**
   * Explicitly stop the current session and start a new one.
   *
   * This can be used to manually mark the start of a new session during a live stream,
   * for example when a new program starts.
   * By default, new sessions are only started on play-out of a new source, or when an ad break starts.
   *
   * @param metadata object of key value pairs.
   */
  stopAndStartNewSession(metadata: ConvivaMetadata): void;

  /**
   * Sets an error to the conviva session and closes the session.
   *
   * @param errorMessage string explaining what the error is.
   */
  reportPlaybackFailed(errorMessage: string): void;

  /**
   * Reports a custom event to Conviva.
   *
   * @param eventType string explaining what kind of event it is.
   * @param eventDetail object of key value pairs.
   */
  reportPlaybackEvent(eventType: string, eventDetail: ConvivaEventDetail): void;

  /**
   * Sets Conviva metadata on the Conviva video analytics.
   *
   * @param metadata object of key value pairs.
   */
  setContentInfo(metadata: ConvivaMetadata): void;

  /**
   * Sets Conviva metadata on the Conviva ad analytics.
   *
   * @param metadata object of key value pairs.
   */
  setAdInfo(metadata: ConvivaMetadata): void;

  /**
   * Stops video and ad analytics and closes all sessions.
   */
  destroy(): void;
}
