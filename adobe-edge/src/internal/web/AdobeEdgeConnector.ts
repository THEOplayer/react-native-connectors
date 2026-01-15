import { AdobeEdgeHandler } from './AdobeEdgeHandler';
import { AdobeCustomMetadataDetails, AdobeEdgeWebConfig, AdobeErrorDetails, AdobeIdentityMap } from '@theoplayer/react-native-analytics-adobe-edge';
import { ChromelessPlayer } from 'theoplayer';

export class AdobeEdgeConnector {
  private _handler: AdobeEdgeHandler;

  constructor(player: ChromelessPlayer, config: AdobeEdgeWebConfig, customIdentityMap?: AdobeIdentityMap) {
    this._handler = new AdobeEdgeHandler(player, config, customIdentityMap);
  }

  /**
   * Explicitly stop the current session and start a new one.
   *
   * This can be used to manually mark the start of a new session during a live stream,
   * for example when a new program starts.
   * By default, new sessions are only started on play-out of a new source, or for an ad break.
   *
   * @param metadata object of key value pairs.
   */
  stopAndStartNewSession(metadata?: AdobeCustomMetadataDetails[]) {
    return this._handler.stopAndStartNewSession(metadata);
  }

  updateMetadata(metadata: AdobeCustomMetadataDetails[]) {
    this._handler.updateMetadata(metadata);
  }

  setCustomIdentityMap(customIdentityMap: AdobeIdentityMap): void {
    this._handler.setCustomIdentityMap(customIdentityMap);
  }

  setDebug(debug: boolean) {
    this._handler.setDebug(debug);
  }

  setError(errorDetails: AdobeErrorDetails) {
    return this._handler.setError(errorDetails.name);
  }

  destroy() {
    return this._handler.destroy();
  }
}
