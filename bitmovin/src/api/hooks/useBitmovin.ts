import { PlayerEventType, THEOplayer } from 'react-native-theoplayer';
import { RefObject, useEffect, useRef } from 'react';
import { AnalyticsConfig, BitmovinConnector } from '@theoplayer/react-native-analytics-bitmovin';
import { SourceMetadata } from '../SourceMetadata';

type InitBitmovin = (player: THEOplayer | undefined, sourceMetadata?: SourceMetadata) => void;

export function useBitmovin(config: AnalyticsConfig): [RefObject<BitmovinConnector | undefined>, InitBitmovin] {
  const connector = useRef<BitmovinConnector | undefined>(undefined);
  const theoPlayer = useRef<THEOplayer | undefined>(undefined);

  const initialize: InitBitmovin = (player: THEOplayer | undefined, sourceMetadata?: SourceMetadata) => {
    // Optionally destroy existent connector
    onDestroy();

    theoPlayer.current = player;
    if (player) {
      connector.current = new BitmovinConnector(player, config, sourceMetadata);
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
