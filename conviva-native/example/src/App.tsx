import React, { useCallback, useRef, useState } from 'react';
import { Image, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { PlayerConfiguration, PlayerError, PlayerEventType, THEOplayer, THEOplayerView } from 'react-native-theoplayer';
import { ConvivaConnector } from '@theoplayer/react-native-conviva';
import { PlayButton } from './res/images';
import type { ConvivaMetadata } from "@convivainc/conviva-js-coresdk";

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  license: undefined,
  libraryLocation: 'theoplayer'
};

const source = {
  sources: [
    {
      "src": "https://cdn.theoplayer.com/video/dash/bbb_30fps/bbb_with_multiple_tiled_thumbnails.mpd",
      "type": "application/dash+xml"
    }
  ],
};

const App = () => {
  const convivaConnector = useRef<ConvivaConnector | null>();
  const theoPlayer = useRef<THEOplayer | null>();
  const [error, setError] = useState<PlayerError | null>();
  const [paused, setPaused] = useState<boolean>(true);

  const convivaMetadata: ConvivaMetadata = {
    ['Conviva.assetName']: 'Demo source',
    ['Conviva.streamUrl']: source.sources[0].src,
    ['Conviva.streamType']: 'VOD',
    ['Conviva.applicationName']: 'THEOplayer',
    ['Conviva.viewerId']: 'your_viewer_id'
  };

  const convivaConfig = {
    gatewayUrl: 'CUSTOMER_GATEWAY_GOES_HERE',
    customerKey: 'CUSTOMER_KEY_GOES_HERE' // Can be a test or production key.
  };

  const onPlayerReady = useCallback((player: THEOplayer) => {
    // Create Conviva connector
    convivaConnector.current = new ConvivaConnector(player, convivaMetadata, convivaConfig);
    player.autoplay = !paused;
    player.source = source;
    player.addEventListener(PlayerEventType.ERROR, (event) => setError(event.error));

    // Update theoPlayer reference.
    theoPlayer.current = player;

    // Destroy connector when unmounting
    return () => { convivaConnector.current?.destroy() }
  }, []);

  const onTogglePlayPause = useCallback(() => {
    const player = theoPlayer.current;
    if (player) {
      player.paused? player.play() : player.pause();
      setPaused((paused) => !paused);
    }
  }, [theoPlayer])

  return (
    <View style={ { position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 } }>

      <THEOplayerView config={ playerConfig } onPlayerReady={ onPlayerReady }/>

      {/*Play/pause button*/}
      {!error && (
        <TouchableOpacity style={styles.fullscreen} onPress={onTogglePlayPause}>
          <Image style={styles.image} source={paused ? PlayButton : null} />
        </TouchableOpacity>
      )}

      {/*Error message*/}
      {error && <View style={styles.fullscreen}><Text style={styles.message}>{error.errorMessage}</Text></View>}
    </View>
  );
};

const styles = StyleSheet.create({
  fullscreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: 16,
    paddingLeft: 50,
    paddingRight: 50,
    color: 'white',
    backgroundColor: 'black',
  },
  image: {
    resizeMode: 'contain',
    width: 75,
    height: 75,
    tintColor: '#ffc50f',
  },
  playButton: {
    width: 90,
    height: 90,
    tintColor: '#ffc50f',
  }
});

export default App;
