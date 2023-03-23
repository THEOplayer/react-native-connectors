import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import {
  PlayerConfiguration,
  PlayerError,
  PlayerEventType,
  SourceDescription,
  THEOplayer,
  THEOplayerView
} from 'react-native-theoplayer';
import { ComscoreConnector } from '@theoplayer/react-native-analytics-comscore';
import { PlayButton } from './res/images';
import { ComscoreConfiguration, ComscoreMetadata, ComscoreMediaType, ComscoreUserConsent } from '@theoplayer/react-native-analytics-comscore';

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  license: undefined,
  libraryLocation: 'theoplayer'
};

const source: SourceDescription = {
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
  "ads": [
    {
      "integration": "google-ima",
      "sources": {
        "src": "https://cdn.theoplayer.com/demos/ads/vast/dfp-preroll-no-skip.xml"
      }
    }
  ]
};

const App = () => {
  const comscoreConnector = useRef<ComscoreConnector | null>();
  const theoPlayer = useRef<THEOplayer | null>();
  const [error, setError] = useState<PlayerError | null>();
  const [paused, setPaused] = useState<boolean>(true);

  const comscoreMetadata: ComscoreMetadata = {
    mediaType: ComscoreMediaType.longFormOnDemand,
    uniqueId: "testuniqueId",
    length: 634.566,
    stationTitle: "THEOTV",
    programTitle: "Big Buck Bunny",
    episodeTitle: "Intro",
    genreName: "Animation",
    classifyAsAudioStream: false,
    customLabels: {
      "testcustomlabel": "testcustomvalue"
    }
  };

  const comscoreConfig: ComscoreConfiguration = {
    publisherId: "15866303", // Can be a test or production key.
    applicationName: "Wonne Test RN",
    userConsent: ComscoreUserConsent.granted,
    debug: true,
  };

  useEffect(() => {
    // Destroy connector when unmounting
    return () => { comscoreConnector.current?.destroy() }
  }, [])

  const onPlayerReady = useCallback((player: THEOplayer) => {
    // Create Comscore connector
    comscoreConnector.current = new ComscoreConnector(player, comscoreMetadata, comscoreConfig);
    player.autoplay = !paused;
    player.source = source;
    comscoreConnector.current.update(comscoreMetadata)
    player.addEventListener(PlayerEventType.ERROR, (event) => setError(event.error));

    // Update theoPlayer reference.
    theoPlayer.current = player;
  }, [theoPlayer]);

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
          {paused && <Image style={styles.image} source={PlayButton} />}
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
