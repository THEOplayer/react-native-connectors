import type { THEOplayer } from 'react-native-theoplayer';
import { AdobeConnectorAdapter } from '../internal/AdobeConnectorAdapter';
import type { AdobeCustomMetadataDetails } from './details/AdobeCustomMetadataDetails';
import type { AdobeErrorDetails } from './details/AdobeErrorDetails';

export class AdobeConnector {
  private connectorAdapter: AdobeConnectorAdapter;

  constructor(player: THEOplayer, baseUrl: string, dataStreamId: string, userAgent?: string, useDebug?: boolean, debugSessionId?: string) {
    this.connectorAdapter = new AdobeConnectorAdapter(player, baseUrl, dataStreamId, userAgent, useDebug, debugSessionId);
  }

  /**
   * Sets customMetadataDetails which will be passed for the session start request.
   */
  updateMetadata(customMetadataDetails: AdobeCustomMetadataDetails[]): void {
    this.connectorAdapter.updateMetadata(customMetadataDetails);
  }

  /**
   * Dispatch error event to adobe
   */
  setError(errorDetails: AdobeErrorDetails): void {
    this.connectorAdapter.setError(errorDetails);
  }

  /**
   * Set debug flag.
   *
   * @param debug whether to write debug info or not.
   */
  setDebug(debug: boolean) {
    this.connectorAdapter.setDebug(debug);
  }

  /**
   * Set a debugSessionID query parameter that is added to all outgoing requests.
   */
  setDebugSessionId(id: string | undefined) {
    this.connectorAdapter.setDebugSessionId(id);
  }

  /**
   * Explicitly stop the current session and start a new one.
   *
   * This can be used to manually mark the start of a new session during a live stream,
   * for example when a new program starts.
   *
   * @param customMetadataDetails media details information.
   */
  stopAndStartNewSession(customMetadataDetails: AdobeCustomMetadataDetails[]): void {
    void this.connectorAdapter.stopAndStartNewSession(customMetadataDetails);
  }

  /**
   * Stops video and ad analytics and closes all sessions.
   */
  destroy(): void {
    void this.connectorAdapter.destroy();
  }
}
