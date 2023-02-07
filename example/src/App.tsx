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

  const convivaMetadata = {
    ['Conviva.assetName']: 'Demo source',
    ['Conviva.streamUrl']: source.sources[0].src,
    ['Conviva.streamType']: 'VOD',
    ['Conviva.applicationName']: 'THEOplayer',
    ['Conviva.viewerId']: 'your_viewer_id'
  };

  const convivaConfig = {
    debug: false,
    gatewayUrl: 'CUSTOMER_GATEWAY_GOES_HERE',
    customerKey: 'CUSTOMER_KEY_GOES_HERE' // Can be a test or production key.
  };

  const onPlayerReady = useCallback((player: THEOplayer) => {
    convivaConnector.current = new ConvivaConnector(player, convivaMetadata, convivaConfig);
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
