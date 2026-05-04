import { PlayerEventType, THEOplayer } from 'react-native-theoplayer';
import { RefObject, useEffect, useRef } from 'react';
import { MediaKindSSAIConnector } from '@theoplayer/react-native-mediakind-ssai';

export type InitMediaKindSSAI = (player: THEOplayer | undefined) => void;

export function useMediaKindSSAI(): [RefObject<MediaKindSSAIConnector | undefined>, InitMediaKindSSAI] {
  const connector = useRef<MediaKindSSAIConnector | undefined>(undefined);
  const theoPlayer = useRef<THEOplayer | undefined>(undefined);

  const initialize: InitMediaKindSSAI = (player: THEOplayer | undefined) => {
    // Optionally destroy existent connector
    onDestroy();

    theoPlayer.current = player;
    if (player) {
      connector.current = new MediaKindSSAIConnector(player);
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
