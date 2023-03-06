import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Text, StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import {
  PlayerConfiguration,
  PlayerError,
  PlayerEventType,
  SourceDescription,
  THEOplayer,
  THEOplayerView
} from 'react-native-theoplayer';
import { ConvivaConnector } from '@theoplayer/react-native-analytics-conviva';
import { ForwardButton, PauseButton, PlayButton, RewindButton } from './res/images';
import type { ConvivaConfiguration, ConvivaMetadata } from '@theoplayer/react-native-analytics-conviva';
import SOURCES_ANDROID from "./res/sources_android.json"
import SOURCES_IOS from "./res/sources_ios.json"
import SOURCES_WEB from "./res/sources_web.json"
const SOURCES = Platform.select({
  "ios": SOURCES_IOS,
  "android": SOURCES_ANDROID,
  "web": SOURCES_WEB
}) || SOURCES_WEB;

const TEST_CUSTOMER_KEY = '876a2328cc34e791190d855daf389567c96d1e86';
const TOUCHSTONE_SERVICE_URL = 'https://theoplayer-test.testonly.conviva.com';

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  license: undefined,
  libraryLocation: 'theoplayer',
  pip: {
    canStartPictureInPictureAutomaticallyFromInline: true,
  }
};

const App = () => {
  const convivaConnector = useRef<ConvivaConnector | undefined>();
  const theoPlayer = useRef<THEOplayer | undefined>();
  const [sourceIndex, setSourceIndex] = useState<number>(0);
  const [error, setError] = useState<PlayerError | undefined>();
  const [paused, setPaused] = useState<boolean>(true);

  useEffect(() => {
    // Destroy connector when unmounting
    return () => {
      convivaConnector.current?.destroy()
    }
  }, []);

  const convivaMetadata: ConvivaMetadata = {
    ['Conviva.applicationName']: 'THEOplayer',
    ['Conviva.viewerId']: 'your_viewer_id'
  };

  const convivaConfig: ConvivaConfiguration = {
    customerKey: TEST_CUSTOMER_KEY, // Can be a test or production key.
    debug: false,
    gatewayUrl: TOUCHSTONE_SERVICE_URL
  };

  const onCustomMetadata = () => {
    const metadata: ConvivaMetadata = {
      ['customTag1']: `custom ${(new Date()).toLocaleString()}`,
      ['customTag2']: "customValue2",
    };
    convivaConnector.current?.setContentInfo(metadata);
  };

  const onPlayerReady = useCallback((player: THEOplayer) => {
    // Create Conviva connector
    convivaConnector.current = new ConvivaConnector(player, convivaMetadata, convivaConfig);
    player.autoplay = !paused;
    player.source = SOURCES[sourceIndex].source as SourceDescription;
    player.addEventListener(PlayerEventType.ERROR, (event) => setError(event.error));
    player.addEventListener(PlayerEventType.PAUSE, () => setPaused(true));

    // Update theoPlayer reference.
    theoPlayer.current = player;
  }, []);

  const onTogglePlayPause = useCallback(() => {
    const player = theoPlayer.current;
    if (player) {
      player.paused ? player.play() : player.pause();
      setPaused((paused) => !paused);
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
              <TouchableOpacity style={styles.button} onPress={() => skip(theoPlayer.current, -15000)}>
                <Image style={styles.image} source={RewindButton}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={onTogglePlayPause}>
                {paused && <Image style={styles.image} source={PlayButton}/>}
                {!paused && <Image style={styles.image} source={PauseButton}/>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => skip(theoPlayer.current, 15000)}>
                <Image style={styles.image} source={ForwardButton}/>
              </TouchableOpacity>
            </View>

            <Text style={styles.infoText}>{`Source: ${SOURCES[sourceIndex].name}`}</Text>
            <TouchableOpacity style={styles.button} onPress={() => seekToBeforeEnd(theoPlayer.current)}>
              <Text style={styles.buttonText}>{"Seek to end -5sec"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => toPip(theoPlayer.current)}>
              <Text style={styles.buttonText}>{"Picture-in-Picture"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => {
              const nextSourceIndex = (sourceIndex + 1) % SOURCES.length;
              setSourceIndex(nextSourceIndex);
              setSource(theoPlayer.current, SOURCES[nextSourceIndex].source as SourceDescription);
              setPaused(true);
            }}>
              <Text style={styles.buttonText}>{"Next source"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onCustomMetadata}>
              <Text style={styles.buttonText}>{"Set custom metadata"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/*Error message*/}
      {error && <View style={styles.fullscreenCenter}><Text style={styles.message}>{error.errorMessage}</Text></View>}
    </View>
  );
};

function setSource(player: THEOplayer | undefined, source: SourceDescription) {
  if (player) {
    player.source = source;
  }
}

function skip(player: THEOplayer | undefined, skipTime: number) {
  if (player) {
    player.currentTime = player.currentTime + skipTime;
  }
}

function seekToBeforeEnd(player: THEOplayer | undefined) {
  if (player && !isNaN(player.duration)) {
    player.currentTime = player.duration - 5000;
  }
}

function toPip(player: THEOplayer | undefined) {
  if (player) {
    player.presentationMode = 'picture-in-picture';
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
  infoText: {
    fontSize: 18,
    marginVertical: 2,
    color: '#ffc50f',
    padding: 3,
    backgroundColor: 'black',
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
