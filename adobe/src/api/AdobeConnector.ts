import type { THEOplayer } from 'react-native-theoplayer';
import type { AdobeMetaData } from '../internal/Types';
import { AdobeConnectorAdapter } from '../internal/AdobeConnectorAdapter';

export { type AdobeMetaData };

export class AdobeConnector {
  private connectorAdapter: AdobeConnectorAdapter;

  constructor(
    player: THEOplayer,
    uri: string,
    ecid: string,
    sid: string,
    trackingUrl: string,
    metadata?: AdobeMetaData,
    userAgent?: string,
    useDebug?: boolean,
  ) {
    this.connectorAdapter = new AdobeConnectorAdapter(player, uri, ecid, sid, trackingUrl, metadata, userAgent, useDebug);
  }

  /**
   * Sets metadata which will be passed for the session start request.
   */
  updateMetadata(metadata: AdobeMetaData): void {
    this.connectorAdapter.updateMetadata(metadata);
  }

  /**
   * Dispatch error event to adobe
   * @param metadata containing at least the qoeData with the errorID and the errorSource set to external.
   */
  setError(metadata: AdobeMetaData): void {
    this.connectorAdapter.setError(metadata);
  }

  /**
   * Set debug flag.
   * @param debug whether to write debug info or not.
   */
  setDebug(debug: boolean) {
    this.connectorAdapter.setDebug(debug);
  }

  /**
   * Explicitly stop the current session and start a new one.
   *
   * This can be used to manually mark the start of a new session during a live stream,
   * for example when a new program starts.
   *
   * @param metadata object of key value pairs.
   */
  stopAndStartNewSession(metadata?: AdobeMetaData): void {
    void this.connectorAdapter.stopAndStartNewSession(metadata);
  }

  /**
   * Stops video and ad analytics and closes all sessions.
   */
  destroy(): void {
    void this.connectorAdapter.destroy();
  }
}
