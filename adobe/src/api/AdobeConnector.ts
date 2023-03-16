import type { THEOplayer } from "react-native-theoplayer";
import type { AdobeMetaData } from "../internal/Types";
import { AdobeConnectorAdapter } from "../internal/AdobeConnectorAdapter";

export class AdobeConnector {

  private connectorAdapter: AdobeConnectorAdapter

  constructor(player: THEOplayer, uri: string, ecid: string, sid: string, trackingUrl: string) {
    this.connectorAdapter = new AdobeConnectorAdapter(player, uri, ecid, sid, trackingUrl);
  }

  /**
   * Sets metadata which will be passed for every event request.
   */
  updateMetadata(metadata: AdobeMetaData): void {
    this.connectorAdapter.updateMetadata(metadata);
  }

  /**
   * Stops video and ad analytics and closes all sessions.
   */
  destroy(): void {
    this.connectorAdapter.destroy();
  }
}
