import { PlayerEventType, THEOplayer } from 'react-native-theoplayer';
import { RefObject, useEffect, useRef } from 'react';
import { BitmovinAnalyticsConfig, BitmovinConnector } from '@theoplayer/react-native-analytics-bitmovin';

export function useBitmovin(config: BitmovinAnalyticsConfig): [RefObject<BitmovinConnector | undefined>, (player: THEOplayer | undefined) => void] {
  const connector = useRef<BitmovinConnector | undefined>(undefined);
  const theoPlayer = useRef<THEOplayer | undefined>(undefined);

  const initialize = (player: THEOplayer | undefined) => {
    // Optionally destroy existent connector
    onDestroy();

    theoPlayer.current = player;
    if (player) {
      connector.current = new BitmovinConnector(player, config);
      player.addEventListener(PlayerEventType.DESTROY, onDestroy);
    } else {
      throw new Error('Invalid THEOplayer instance');
    }
  };

  const onDestroy = () => {
    if (connector.current) {
      if (!theoPlayer.current) {
        throw new Error('Invalid THEOplayer instance');
      }
      theoPlayer.current.removeEventListener(PlayerEventType.DESTROY, onDestroy);
      connector.current.destroy();
      connector.current = undefined;
    }
  };

  useEffect(() => {
    return onDestroy;
  }, []);

  return [connector, initialize];
}
