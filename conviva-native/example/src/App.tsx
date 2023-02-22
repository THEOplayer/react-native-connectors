import React, { useCallback, useRef, useState } from 'react';
import { Image, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import {
  PlayerConfiguration,
  PlayerError,
  PlayerEventType,
  SourceDescription,
  THEOplayer,
  THEOplayerView
} from 'react-native-theoplayer';
import { ConvivaConnector } from '@theoplayer/react-native-conviva';
import { ForwardButton, PauseButton, PlayButton, RewindButton } from './res/images';
import type { ConvivaConfiguration, ConvivaMetadata } from '@theoplayer/react-native-conviva';
import SOURCES from "./res/sources.json";

const TEST_CUSTOMER_KEY = '876a2328cc34e791190d855daf389567c96d1e86';
const TOUCHSTONE_SERVICE_URL = 'https://theoplayer-test.testonly.conviva.com';

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  license: undefined,
  libraryLocation: 'theoplayer'
};

const hlsSource = SOURCES[0] as SourceDescription;
const dashSource = SOURCES[1] as SourceDescription;
const sourceWithPreRoll = SOURCES[2] as SourceDescription;

const App = () => {
  const convivaConnector = useRef<ConvivaConnector | undefined>();
  const theoPlayer = useRef<THEOplayer | undefined>();
  const [error, setError] = useState<PlayerError | undefined>();
  const [paused, setPaused] = useState<boolean>(true);

  const convivaMetadata: ConvivaMetadata = {
    ['Conviva.applicationName']: 'THEOplayer',
    ['Conviva.viewerId']: 'your_viewer_id'
  };

  const convivaConfig: ConvivaConfiguration = {
    customerKey: TEST_CUSTOMER_KEY, // Can be a test or production key.
    debug: true,
    gatewayUrl: TOUCHSTONE_SERVICE_URL
  };

  const onSourceChange = () => {
    const now = new Date();

    const streamUrl = extractSource(theoPlayer.current?.source);
    const metadata: ConvivaMetadata = {
      ['Conviva.assetName']: `Demo source ${now.toLocaleString()}`,
      ['Conviva.streamUrl']: streamUrl || '',
      ['Conviva.streamType']: "VOD",
    };
    convivaConnector.current?.setContentInfo(metadata);
  };

  const onPlayerReady = useCallback((player: THEOplayer) => {
    // Create Conviva connector
    convivaConnector.current = new ConvivaConnector(player, convivaMetadata, convivaConfig);
    player.autoplay = !paused;
    player.source = dashSource;
    player.addEventListener(PlayerEventType.ERROR, (event) => setError(event.error));
    player.addEventListener(PlayerEventType.SOURCE_CHANGE, onSourceChange);

    // Update theoPlayer reference.
    theoPlayer.current = player;

    // Destroy connector when unmounting
    return () => {
      convivaConnector.current?.destroy()
    }
  }, []);

  const onTogglePlayPause = useCallback(() => {
    const player = theoPlayer.current;
    if (player) {
      player.paused ? player.play() : player.pause();
      setPaused((paused) => !paused);
    }
  }, [theoPlayer])

  const onSkipBackward = useCallback(() => {
    const player = theoPlayer.current;
    if (player) {
      player.currentTime -= 15000;
    }
  }, [theoPlayer])

  const onSkipForward = useCallback(() => {
    const player = theoPlayer.current;
    if (player) {
      player.currentTime += 15000;
    }
  }, [theoPlayer])

  const onPip = useCallback(() => {
    // TODO: first merge PiP feature
    const player = theoPlayer.current;
    if (player) {
      player.currentTime = player.duration - 5000;
    }
  }, [theoPlayer])

  return (
    <View style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}>

      <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}/>

      {!error && (
        <View style={styles.fullscreenCenter}>
          <View style={styles.controlsContainer}>
            {/*Play/pause & trick-play buttons*/}
            <View style={styles.controlsRow}>
              <TouchableOpacity style={styles.button} onPress={onSkipBackward}>
                <Image style={styles.image} source={RewindButton}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={onTogglePlayPause}>
                {paused && <Image style={styles.image} source={PlayButton}/>}
                {!paused && <Image style={styles.image} source={PauseButton}/>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={onSkipForward}>
                <Image style={styles.image} source={ForwardButton}/>
              </TouchableOpacity>
            </View>

            {/* PiP */}
            <TouchableOpacity style={styles.button} onPress={() => seekToBeforeEnd(theoPlayer.current)}>
              <Text style={styles.buttonText}>{"Seek to end -5sec"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => toPip(theoPlayer.current)}>
              <Text style={styles.buttonText}>{"Picture-in-Picture"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/*Error message*/}
      {error && <View style={styles.fullscreenCenter}><Text style={styles.message}>{error.errorMessage}</Text></View>}
    </View>
  );
};

function seekToBeforeEnd(player: THEOplayer | undefined) {
  if (player && !isNaN(player.duration)) {
    player.currentTime = player.duration - 5000;
  }
}

function toPip(player: THEOplayer| undefined) {
  if (player) {
    // TODO: once PiP feature is merged.
    // player.presentationMode = 'picture-in-picture';
  }
}

function extractSource(source?: SourceDescription): string | undefined {
  if (!source || !source.sources) {
    return undefined;
  }
  if (Array.isArray(source.sources)) {
    return source.sources.length > 0 ? source.sources[0].src : undefined;
  } else {
    return source.sources.src;
  }
}

const styles = StyleSheet.create({
  fullscreenCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'column'
  },
  controlsRow: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  button: {
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 20,
    marginVertical: 2,
    color: 'black',
    borderRadius: 4,
    padding: 3,
    backgroundColor: '#ffc50f',
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
