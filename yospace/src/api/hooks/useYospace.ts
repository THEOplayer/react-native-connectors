import { PlayerEventType, THEOplayer } from 'react-native-theoplayer';
import { RefObject, useEffect, useRef } from 'react';
import { YospaceConnector } from '@theoplayer/react-native-yospace';

export function useYospace(): [RefObject<YospaceConnector | undefined>, (player: THEOplayer | undefined) => void] {
  const connector = useRef<YospaceConnector | undefined>();
  const theoPlayer = useRef<THEOplayer | undefined>();

  const initialize = (player: THEOplayer | undefined) => {
    // Optionally destroy existent connector
    onDestroy();

    theoPlayer.current = player;
    if (player) {
      connector.current = new YospaceConnector(player);
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
