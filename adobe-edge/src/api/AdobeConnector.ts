import type { THEOplayer } from 'react-native-theoplayer';
import { AdobeConnectorAdapterNative } from '../internal/AdobeConnectorAdapterNative';
import type { AdobeCustomMetadataDetails } from './details/AdobeCustomMetadataDetails';
import type { AdobeErrorDetails } from './details/AdobeErrorDetails';
import { Platform } from 'react-native';
import { AdobeConnectorAdapter } from '../internal/AdobeConnectorAdapter';
import { AdobeConnectorAdapterWeb } from '../internal/AdobeConnectorAdapterWeb';

export class AdobeConnector {
  private connectorAdapter: AdobeConnectorAdapter;

  constructor(player: THEOplayer, edgeBasePath: string, datastreamId: string, orgId: string, debugEnabled?: boolean, debugSessionId?: string) {
    // By default, use a default typescript connector on all platforms, unless explicitly requested.
    if (['ios', 'android'].includes(Platform.OS)) {
      this.connectorAdapter = new AdobeConnectorAdapterNative(player, edgeBasePath, datastreamId, orgId, debugEnabled, debugSessionId);
    } else {
      this.connectorAdapter = new AdobeConnectorAdapterWeb(player, edgeBasePath, datastreamId, orgId, debugEnabled, debugSessionId);
    }
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
