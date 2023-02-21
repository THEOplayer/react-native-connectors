import React, { useCallback, useRef, useState } from 'react';
import { Image, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { PlayerConfiguration, PlayerError, PlayerEventType, THEOplayer, THEOplayerView } from 'react-native-theoplayer';
import { NielsenConnector } from '@theoplayer/react-native-nielsen';
import { PlayButton } from './res/images';
import type { NielsenConfiguration, NielsenMetadata } from '@theoplayer/react-native-nielsen';

const TEST_CUSTOMER_KEY = 'TODO';

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
    },
    {
      type: "application/x-mpegurl",
      src: "https://cdn.theoplayer.com/video/big_buck_bunny/big_buck_bunny.m3u8"
    }
  ],
};

const App = () => {
  const nielsenConnector = useRef<NielsenConnector | null>();
  const theoPlayer = useRef<THEOplayer | null>();
  const [error, setError] = useState<PlayerError | null>();
  const [paused, setPaused] = useState<boolean>(true);

  const nielsenMetadata: NielsenMetadata = {
    // TODO
  };

  const nielsenConfig: NielsenConfiguration = {
    customerKey: TEST_CUSTOMER_KEY, // Can be a test or production key.
    debug: true,
    gatewayUrl: 'TODO'
  };

  const onPlayerReady = useCallback((player: THEOplayer) => {
    // Create Nielsen connector
    nielsenConnector.current = new NielsenConnector(player, nielsenMetadata, nielsenConfig);
    player.autoplay = !paused;
    player.source = source;
    player.addEventListener(PlayerEventType.ERROR, (event) => setError(event.error));

    // Update theoPlayer reference.
    theoPlayer.current = player;

    // Destroy connector when unmounting
    return () => { nielsenConnector.current?.destroy() }
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
