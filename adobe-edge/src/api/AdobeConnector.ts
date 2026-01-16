import type { THEOplayer } from 'react-native-theoplayer';
import { AdobeConnectorAdapterNative } from '../internal/AdobeConnectorAdapterNative';
import { Platform } from 'react-native';
import { AdobeConnectorAdapter } from '../internal/AdobeConnectorAdapter';
import { AdobeConnectorAdapterWeb } from '../internal/AdobeConnectorAdapterWeb';
import { AdobeEdgeConfig } from './AdobeEdgeConfig';
import { AdobeIdentityMap } from './details/AdobeIdentityMap';
import { AdobeMetadata } from './details/AdobeMetadata';

export class AdobeConnector {
  private connectorAdapter?: AdobeConnectorAdapter;

  /**
   * Creates an instance of AdobeConnector.
   */
  constructor(player: THEOplayer, config: AdobeEdgeConfig, customIdentityMap?: AdobeIdentityMap) {
    if (['ios', 'android'].includes(Platform.OS)) {
      if (config.mobile) {
        this.connectorAdapter = new AdobeConnectorAdapterNative(player, config.mobile, customIdentityMap);
      } else {
        console.error('AdobeConnector Error: Missing config for mobile platform');
      }
    } else {
      if (config.web) {
        this.connectorAdapter = new AdobeConnectorAdapterWeb(player, config.web, customIdentityMap);
      } else {
        console.error('AdobeConnector Error: Missing config for Web platform');
      }
    }
  }

  /**
   * Sets customMetadataDetails which will be passed for the session start request.
   */
  updateMetadata(customMetadataDetails: AdobeMetadata): void {
    this.connectorAdapter?.updateMetadata(customMetadataDetails);
  }

  /**
   * Sets custom identity map.
   *
   * @example
   * ```typescript
   * {
   *  "EMAIL": [
   *    {
   *      "id": "user@example.com",
   *      "authenticatedState": "authenticated",
   *      "primary": "false"
   *    },
   *    {
   *      "id" : "useralias@example.com",
   *      "authenticatedState": "ambiguous",
   *      "primary": false
   *    }
   *  ],
   *  "Email_LC_SHA256": [
   *    {
   *      "id": "2394509340-9b942f32f709db2c57e79cecec4462836ca1efef1c336a939c4b1674bcc74320",
   *      "authenticatedState": "authenticated",
   *      "primary": "false"
   *    }
   *  ]
   * }
   */
  setCustomIdentityMap(customIdentityMap: AdobeIdentityMap): void {
    this.connectorAdapter?.setCustomIdentityMap(customIdentityMap);
  }

  /**
   * Dispatch error event to adobe
   */
  setError(errorId: string): void {
    this.connectorAdapter?.setError(errorId);
  }

  /**
   * Set debug flag.
   *
   * @param debug whether to write debug info or not.
   */
  setDebug(debug: boolean) {
    this.connectorAdapter?.setDebug(debug);
  }

  /**
   * Explicitly stop the current session and start a new one.
   *
   * This can be used to manually mark the start of a new session during a live stream,
   * for example when a new program starts.
   *
   * @param customMetadataDetails media details information.
   */
  stopAndStartNewSession(customMetadataDetails: AdobeMetadata): void {
    void this.connectorAdapter?.stopAndStartNewSession(customMetadataDetails);
  }

  /**
   * Stops video and ad analytics and closes all sessions.
   */
  destroy(): void {
    void this.connectorAdapter?.destroy();
  }
}
