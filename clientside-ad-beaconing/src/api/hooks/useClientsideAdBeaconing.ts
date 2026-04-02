import { PlayerEventType, THEOplayer } from 'react-native-theoplayer';
import { RefObject, useEffect, useRef } from 'react';
import { ClientsideAdBeaconingConnector } from '@theoplayer/react-native-clientside-ad-beaconing';

export type InitClientsideAdBeaconing = (player: THEOplayer | undefined) => void;

export function useClientsideAdBeaconing(): [RefObject<ClientsideAdBeaconingConnector | undefined>, InitClientsideAdBeaconing] {
  const connector = useRef<ClientsideAdBeaconingConnector | undefined>(undefined);
  const theoPlayer = useRef<THEOplayer | undefined>(undefined);

  const initialize: InitClientsideAdBeaconing = (player: THEOplayer | undefined) => {
    // Optionally destroy existent connector
    onDestroy();

    theoPlayer.current = player;
    if (player) {
      connector.current = new ClientsideAdBeaconingConnector(player);
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
