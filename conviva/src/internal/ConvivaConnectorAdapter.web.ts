import type { THEOplayer } from 'react-native-theoplayer';
import * as THEOplayerConvivaConnector from '@theoplayer/conviva-connector-web';
import type { ConvivaMetadata as NativeConvivaMetadata } from '@convivainc/conviva-js-coresdk';
import type { ConvivaConfiguration } from '../api/ConvivaConfiguration';
import type { ConvivaMetadata } from '../api/ConvivaMetadata';
import type { ChromelessPlayer } from 'theoplayer';
import { BroadcastReceiver } from "react-native-theoplayer/lib/typescript/internal/adapter/event/BroadcastAdapter.web";

/**
 * Extend player.ads with a BroadcastReceiver that will dispatch all broadcast ad events to the conviva connector,
 * in addition to the ad events originating from the player.
 */
function extendPlayer(player: THEOplayer, receiver: BroadcastReceiver): ChromelessPlayer {
    const nativePlayer = player.nativeHandle as ChromelessPlayer;
    if (nativePlayer.ads) {
        // Route broadcast events towards convivaAdEventsExtension
        Object.assign(nativePlayer.ads, {convivaAdEventsExtension: receiver});
    }
    return nativePlayer;
}

export class ConvivaConnectorAdapter extends BroadcastReceiver {

    private integration: THEOplayerConvivaConnector.ConvivaConnector;

    constructor(player: THEOplayer, convivaMetadata: ConvivaMetadata, convivaConfig: ConvivaConfiguration) {
        super(player);

        // Use AdEventsExtension
        this.integration = new THEOplayerConvivaConnector.ConvivaConnector(
            extendPlayer(player, this),
            convivaMetadata as NativeConvivaMetadata,
            convivaConfig
        );
    }

    stopAndStartNewSession(metadata: ConvivaMetadata): void {
        this.integration.stopAndStartNewSession(metadata)
    }

    reportPlaybackFailed(errorMessage: string): void {
        this.integration.reportPlaybackFailed(errorMessage);
    }

    setContentInfo(metadata: ConvivaMetadata): void {
        this.integration.setContentInfo(metadata);
    }

    setAdInfo(metadata: ConvivaMetadata): void {
        this.integration.setAdInfo(metadata);
    }

    destroy() {
        super.destroy();
        this.integration.destroy();
    }
}
