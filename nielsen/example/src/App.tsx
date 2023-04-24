import React, { useCallback, useRef, useState } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  AdIntegrationKind,
  PlayerConfiguration,
  PlayerError,
  PlayerEventType,
  SourceDescription,
  THEOplayer,
  THEOplayerView
} from 'react-native-theoplayer';
import { useNielsen } from '@theoplayer/react-native-analytics-nielsen';
import { PlayButton } from './res/images';
import type { NielsenOptions } from "@theoplayer/nielsen-connector-web";

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  license: undefined,
  libraryLocation: 'theoplayer'
};

const source: SourceDescription = {
  sources: [
    {
      type: "application/x-mpegurl",
      src: "https://cdn.theoplayer.com/video/big_buck_bunny/big_buck_bunny.m3u8"
    }
  ],
  ads: [
    {
      sources: 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/vmap_ad_samples&sz=640x480&cust_params=sample_ar%3Dpreonly&ciu_szs=300x250%2C728x90&gdfp_req=1&ad_rule=1&output=vmap&unviewed_position_start=1&env=vp&impl=s&correlator=',
      integration: 'google-ima' as AdIntegrationKind,
    }
  ]
};

let appId: string
if (Platform.OS === "web") {
  appId = "P77E3B909-D4B5-4E5C-9B5F-77B0E8FE27F5";
} else if (Platform.OS === "android") {
  appId = "P4B35DFE9-0EB1-41F9-8E66-7ED2FF4746DB";
} else if (Platform.OS === "ios") {
  appId = "PE8381632-E66B-4AF5-8C10-D3303C005D9E";
}

const nielsenOptions: NielsenOptions = {
  // containerId: 'THEOplayer',
  nol_sdkDebug: 'debug'
};

const App = () => {
  const [nielsen, initNielsen] = useNielsen(appId, 'THEOplayer demo', nielsenOptions);
  const theoPlayer = useRef<THEOplayer | null>();
  const [error, setError] = useState<PlayerError | null>();
  const [paused, setPaused] = useState<boolean>(true);

  const onPlayerReady = useCallback((player: THEOplayer) => {
    // Initialize Nielsen connector
    initNielsen(player);
    player.autoplay = !paused;
    player.source = source;
    player.addEventListener(PlayerEventType.ERROR, (event) => setError(event.error));

    // Update theoPlayer reference.
    theoPlayer.current = player;
  }, [theoPlayer]);

  const onCustomMetadata = () => {
    const metadata = {
      'assetid': 'C77664',
      'program': 'testprogram'
    };
    nielsen.current?.updateMetadata(metadata);
  };

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

      <TouchableOpacity style={styles.button} onPress={onCustomMetadata}>
        <Text style={styles.buttonText}>{"Set custom metadata"}</Text>
      </TouchableOpacity>

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
  },
  buttonText: {
    fontSize: 20,
    marginVertical: 2,
    color: 'black',
    borderRadius: 4,
    padding: 3,
    backgroundColor: '#ffc50f',
  },
  button: {
    marginHorizontal: 5,
  },
});

export default App;
