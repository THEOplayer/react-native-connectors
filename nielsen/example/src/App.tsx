import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  PlayerConfiguration,
  PlayerError,
  PlayerEventType,
  SourceDescription,
  THEOplayer,
  THEOplayerView
} from 'react-native-theoplayer';
import { NielsenConnector } from '@theoplayer/react-native-analytics-nielsen';
import { PlayButton } from './res/images';
import type { NielsenOptions } from "@theoplayer/nielsen-connector-web";

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  license: undefined,
  libraryLocation: 'theoplayer'
};

const source = {
  sources: [
    {
      type: "application/x-mpegurl",
      src: "https://www.nielseninternet.com/DTVR/RTVOD_%28PC-FD%29_C3/prog_index.m3u8"
    }
  ],
  ads: [
    {
      sources: 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/vmap_ad_samples&sz=640x480&cust_params=sample_ar%3Dpreonly&ciu_szs=300x250%2C728x90&gdfp_req=1&ad_rule=1&output=vmap&unviewed_position_start=1&env=vp&impl=s&correlator=',
      integration: 'google-ima',
    }
  ]
} as SourceDescription;

const App = () => {
  const nielsenConnector = useRef<NielsenConnector | null>();
  const theoPlayer = useRef<THEOplayer | null>();
  const [error, setError] = useState<PlayerError | null>();
  const [paused, setPaused] = useState<boolean>(true);

  const appId = Platform.OS == "web" ? "P77E3B909-D4B5-4E5C-9B5F-77B0E8FE27F5" : "PE8381632-E66B-4AF5-8C10-D3303C005D9E";

  const nielsenOptions: NielsenOptions = {
    // containerId: 'THEOplayer',
    nol_sdkDebug: 'debug'
  };

  useEffect(() => {
    // Destroy connector when unmounting
    return () => { nielsenConnector.current?.destroy() }
  },[]);

  const onPlayerReady = useCallback((player: THEOplayer) => {
    // Create Nielsen connector
    nielsenConnector.current = new NielsenConnector(player, appId, 'THEOplayer demo', nielsenOptions);
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
    nielsenConnector.current?.updateMetadata(metadata);
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
