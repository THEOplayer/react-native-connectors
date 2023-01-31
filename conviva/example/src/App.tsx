import React, { useCallback, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import {
  PlayerConfiguration,
  PlayerError,
  PlayerEventType,
  PresentationMode,
  SourceDescription,
  THEOplayer,
  THEOplayerView
} from 'react-native-theoplayer';
import type { ConvivaConfiguration, ConvivaMetadata } from '@theoplayer/react-native-analytics-conviva';
import { useConviva } from '@theoplayer/react-native-analytics-conviva';
import { ForwardButton, PauseButton, PlayButton, RewindButton } from './res/images';
import SOURCES_ANDROID from "./res/sources_android.json"
import SOURCES_IOS from "./res/sources_ios.json"
import SOURCES_WEB from "./res/sources_web.json"
import { TestButton } from "./TestButton";

const SOURCES = Platform.select({
  "ios": SOURCES_IOS,
  "android": SOURCES_ANDROID,
  "web": SOURCES_WEB
}) || SOURCES_WEB;

// Insert correct config values here.
const TEST_CUSTOMER_KEY = '<customer_key>';
const TOUCHSTONE_SERVICE_URL = '<touchstone_url>';

const convivaMetadata: ConvivaMetadata = {
  ['Conviva.assetName']: 'NA (not set)',
  ['Conviva.applicationName']: 'THEOplayer',
  ['Conviva.viewerId']: 'your_viewer_id'
};

const convivaConfig: ConvivaConfiguration = {
  customerKey: TEST_CUSTOMER_KEY, // Can be a test or production key.
  debug: true,
  gatewayUrl: TOUCHSTONE_SERVICE_URL
};

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  license: undefined,
  libraryLocation: 'theoplayer'
};

const App = () => {
  const [conviva, initConviva] = useConviva(convivaMetadata, convivaConfig);
  const theoPlayer = useRef<THEOplayer | undefined>();
  const [sourceIndex, setSourceIndex] = useState<number>(0);
  const [error, setError] = useState<PlayerError | undefined>();
  const [paused, setPaused] = useState<boolean>(true);

  const onCustomMetadata = () => {
    const metadata: ConvivaMetadata = {
      ['customTag1']: `custom ${(new Date()).toLocaleString()}`,
      ['customTag2']: "customValue2",
    };
    conviva.current?.setContentInfo(metadata);
  };

  const onPlayerReady = useCallback((player: THEOplayer) => {
    // Initialize Conviva connector
    initConviva(player);
    player.autoplay = !paused;
    player.source = SOURCES[sourceIndex].source as SourceDescription;
    player.pipConfiguration = { startsAutomatically: true };
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

  const onStopAndStartNewSession = useCallback(() => {
    conviva.current?.stopAndStartNewSession({
      ['Conviva.assetName']: 'New session title'
    });
  }, [theoPlayer])

  return (
    <View style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}>

      <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}/>

      {!error && (
        <View style={styles.fullscreenCenter}>
          <View style={styles.controlsContainer}>
            {/*Play/pause & trick-play buttons*/}
            <View style={styles.controlsRow}>
              <TestButton onPress={() => skip(theoPlayer.current, -15000)} image={RewindButton} />
              <TestButton onPress={onTogglePlayPause} image={paused ? PlayButton : PauseButton } />
              <TestButton onPress={() => skip(theoPlayer.current, 15000)} image={ForwardButton} />
            </View>
            <Text style={styles.infoText}>{`Source: ${SOURCES[sourceIndex].name}`}</Text>
            <TestButton onPress={() => seekToBeforeEnd(theoPlayer.current)} title={"Seek to end -5sec"} />
            <TestButton onPress={() => toPip(theoPlayer.current)} title={"Picture-in-Picture"} />
            <TestButton onPress={() => {
              const nextSourceIndex = (sourceIndex + 1) % SOURCES.length;
              setSourceIndex(nextSourceIndex);
              setSource(theoPlayer.current, SOURCES[nextSourceIndex].source as SourceDescription);
              setPaused(true);
            }} title={"Next source"} />
            <TestButton onPress={onCustomMetadata} title={"Set custom metadata"} />
            <TestButton onPress={onStopAndStartNewSession} title={"Stop & start new session"} />
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
    player.presentationMode = PresentationMode.pip;
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
  infoText: {
    fontSize: 18,
    marginVertical: 2,
    color: '#ffc50f',
    padding: 3,
    backgroundColor: 'black',
  },
  message: {
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: 16,
    paddingLeft: 50,
    paddingRight: 50,
    color: 'white',
    backgroundColor: 'black',
  }
});

export default App;
