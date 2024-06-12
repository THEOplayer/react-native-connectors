import { PlayerEventType, THEOplayer } from 'react-native-theoplayer';
import { RefObject, useEffect, useRef } from 'react';
import type { NielsenOptions } from '@theoplayer/nielsen-connector-web';
import { NielsenConnector } from '@theoplayer/react-native-analytics-nielsen';

export function useNielsen(
  appId: string,
  instanceName: string,
  options: NielsenOptions,
): [RefObject<NielsenConnector | undefined>, (player: THEOplayer | undefined) => void] {
  const connector = useRef<NielsenConnector | undefined>();
  const theoPlayer = useRef<THEOplayer | undefined>();

  const initialize = (player: THEOplayer | undefined) => {
    // Optionally destroy existent connector
    onDestroy();

    theoPlayer.current = player;
    if (player) {
      connector.current = new NielsenConnector(player, appId, instanceName, options);
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
