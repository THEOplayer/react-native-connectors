import { PlayerEventType, THEOplayer } from "react-native-theoplayer";
import { RefObject, useEffect, useRef } from "react";
import { MuxConnector, MuxOptions } from "@theoplayer/react-native-analytics-mux";

export function useMux()
  : [RefObject<MuxConnector | undefined>, (player: THEOplayer | undefined, options: MuxOptions) => void] {
  const connector = useRef<MuxConnector | undefined>();
  const theoPlayer = useRef<THEOplayer | undefined>();

  const initialize = (player: THEOplayer | undefined, options: MuxOptions) => {
    // Optionally destroy existent connector
    onDestroy();

    theoPlayer.current = player;
    if (player) {
      connector.current = new MuxConnector(player, options);
      player.addEventListener(PlayerEventType.DESTROY, onDestroy);
    } else {
      throw new Error("Invalid THEOplayer instance");
    }
  }

  const onDestroy = () => {
    if (connector.current) {
      if (!theoPlayer.current) {
        throw new Error("Invalid THEOplayer instance");
      }
      theoPlayer.current.removeEventListener(PlayerEventType.DESTROY, onDestroy);
      connector.current.destroy();
      connector.current = undefined;
    }
  }

  useEffect(() => {
    return onDestroy;
  }, []);

  return [connector, initialize];
}
