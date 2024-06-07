import type { THEOplayer } from 'react-native-theoplayer';
import * as THEOplayerConvivaConnector from '@theoplayer/conviva-connector-web';
import type { ConvivaMetadata as NativeConvivaMetadata } from '@convivainc/conviva-js-coresdk';
import type { ConvivaConfiguration } from '../api/ConvivaConfiguration';
import type { ConvivaMetadata } from '../api/ConvivaMetadata';
import type { ChromelessPlayer } from 'theoplayer';
import type { ConvivaEventDetail } from '../api/ConvivaEventDetail';

/**
 * Extend player.ads with a BroadcastReceiver that will dispatch all broadcast ad events to the conviva connector,
 * in addition to the ad events originating from the player.
 */
function extendPlayer(player: THEOplayer): ChromelessPlayer {
  const nativePlayer = player.nativeHandle as ChromelessPlayer;
  if (nativePlayer.ads) {
    // Route broadcast events towards convivaAdEventsExtension
    Object.assign(nativePlayer.ads, { convivaAdEventsExtension: player.broadcast });
  }
  return nativePlayer;
}

export class ConvivaConnectorAdapter {
  private integration: THEOplayerConvivaConnector.ConvivaConnector;

  constructor(player: THEOplayer, convivaMetadata: ConvivaMetadata, convivaConfig: ConvivaConfiguration) {
    // Use AdEventsExtension
    this.integration = new THEOplayerConvivaConnector.ConvivaConnector(extendPlayer(player), convivaMetadata as NativeConvivaMetadata, convivaConfig);
  }

  stopAndStartNewSession(metadata: ConvivaMetadata): void {
    this.integration.stopAndStartNewSession(metadata);
  }

  reportPlaybackFailed(errorMessage: string): void {
    this.integration.reportPlaybackFailed(errorMessage);
  }

  reportPlaybackEvent(eventName: string, eventDetail: ConvivaEventDetail): void {
    this.integration.reportPlaybackEvent(eventName, eventDetail);
  }

  setContentInfo(metadata: ConvivaMetadata): void {
    this.integration.setContentInfo(metadata);
  }

  setAdInfo(metadata: ConvivaMetadata): void {
    this.integration.setAdInfo(metadata);
  }

  destroy() {
    this.integration.destroy();
  }
}
