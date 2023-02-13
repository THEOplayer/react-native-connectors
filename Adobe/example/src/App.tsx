import React, { useCallback, useRef, useState } from 'react';
import { Image, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { PlayerConfiguration, PlayerError, PlayerEventType, THEOplayer, THEOplayerView } from 'react-native-theoplayer';
import { PlayButton } from './res/images';

const playerConfig: PlayerConfiguration = {
  license:
    'sZP7IYe6T6fL3LUe0KPKTOzo0S4eFSxe0QC-CKI63Oz_3D41IS0ZIQIe3QB6FOPlUY3zWokgbgjNIOf9fl5kCoP10LXlFDhtIuh-3uCLCmzrIKxeFSxe0Lbi3LCLISP60ZfVfK4_bQgZCYxNWoryIQXzImf90SCt3SBkTSfi0u5i0Oi6Io4pIYP1UQgqWgjeCYxgflEc3lbc3l5_0S0L3uftFOPeWok1dDrLYtA1Ioh6TgV6v6fVfKcqCoXVdQjLUOfVfGxEIDjiWQXrIYfpCoj-fgzVfKxqWDXNWG3ybojkbK3gflNWf6E6FOPVWo31WQ1qbta6FOPzdQ4qbQc1sD4ZFK3qWmPUFOPLIQ-LflNWfK1zWDikfgzVfG3gWKxydDkibK4LbogqW6f9UwPkImi6IK41Uw4ZIY06TgV6WY4VUQgodD4tfgkj',
  libraryLocation: 'theoplayer',
};

const source = {
  sources: [
    {
      src: 'https://cdn.theoplayer.com/video/dash/bbb_30fps/bbb_with_multiple_tiled_thumbnails.mpd',
      type: 'application/dash+xml',
    },
  ],
};

const App = () => {
  const theoPlayer = useRef<THEOplayer | null>();
  const [error, setError] = useState<PlayerError | null>();
  const [paused, setPaused] = useState<boolean>(true);

  const onPlayerReady = useCallback((player: THEOplayer) => {
    // Create Conviva connector
    player.source = source;
    player.addEventListener(PlayerEventType.ERROR, (event) => setError(event.error));

    // Update theoPlayer reference.
    theoPlayer.current = player;
  }, []);

  const onTogglePlayPause = useCallback(() => {
    const player = theoPlayer.current;
    if (player) {
      player.paused ? player.play() : player.pause();
      setPaused((paused) => !paused);
    }
  }, [theoPlayer]);

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}>
      <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady} />

      {/*Play/pause button*/}
      {!error && (
        <TouchableOpacity style={styles.fullscreen} onPress={onTogglePlayPause}>
          <Image style={styles.image} source={paused ? PlayButton : null} />
        </TouchableOpacity>
      )}

      {/*Error message*/}
      {error && (
        <View style={styles.fullscreen}>
          <Text style={styles.message}>{error.errorMessage}</Text>
        </View>
      )}
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
  },
});

export default App;
