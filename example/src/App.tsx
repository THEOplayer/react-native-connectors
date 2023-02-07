import React, { useCallback, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { PlayerConfiguration, THEOplayer, THEOplayerView } from 'react-native-theoplayer';
import { ConvivaConnector } from 'react-native-theoplayer-conviva';

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  license: undefined
};

const source = {
  sources: [
    {
      src: 'https://contentserver.prudentgiraffe.com/videos/dash/webvtt-embedded-in-isobmff/Manifest.mpd',
      type: 'application/dash+xml',
    },
  ],
};

const App = () => {
  const [active, setActive] = useState<boolean>(true);
  const convivaConnector = useRef<ConvivaConnector | null>();
  const onPlayerReady = useCallback((player: THEOplayer) => {
    convivaConnector.current = new ConvivaConnector(player, {}, { customerKey: 'TODO'});
    player.autoplay = true;
    player.source = source;

    // Destroy connector when unmounting
    return () => { convivaConnector.current?.destroy() }
  }, []);

  const onToggleActive = useCallback(() => {
    setActive((active) => !active);
  }, [])

  return (
    <View style={ { position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 } }>
      {active && <THEOplayerView config={ playerConfig } onPlayerReady={ onPlayerReady }/>}
      <TouchableOpacity style={{position: 'absolute', top: 50, left: 50}} onPress={onToggleActive}><Text style={{backgroundColor: 'yellow'}}>MOUNT/UNMOUNT</Text></TouchableOpacity>
    </View>
  );
};

export default App;
