import React, { useCallback, useRef, useState } from 'react';
import { Image, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import {
  AdIntegrationKind,
  PlayerConfiguration,
  PlayerError,
  PlayerEventType,
  SourceDescription,
  THEOplayer,
  THEOplayerView
} from 'react-native-theoplayer';
import { PlayButton } from './res/images';
import { useAdobe } from "@theoplayer/react-native-analytics-adobe";

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  license: undefined,
  libraryLocation: 'theoplayer',
};

const source_hls: SourceDescription = {
  sources: [
    {
      src: 'https://cdn.theoplayer.com/video/big_buck_bunny/big_buck_bunny.m3u8',
      type: 'application/x-mpegurl',
    },
  ],
  ads: [
    {
      sources: 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/vmap_ad_samples&sz=640x480&cust_params=sample_ar%3Dpreonly&ciu_szs=300x250%2C728x90&gdfp_req=1&ad_rule=1&output=vmap&unviewed_position_start=1&env=vp&impl=s&correlator=',
      integration: 'google-ima' as AdIntegrationKind,
    }
  ]
};

const uri = "smetrics.nfl.com/va" // "<Media Collection API's end point>";
const ecid = "F75C3025512D2C1D0A490D44@AdobeOrg" // "<Visitor Experience Cloud Org ID>";
const sid = "nfldev" // "<Report Suite ID>";
const trackingUrl = "smetrics.nfl.com" // "<Tracking Server URL>";

const App = () => {
  const [_adobe, initAdobe] = useAdobe(uri, ecid, sid, trackingUrl);
  const theoPlayer = useRef<THEOplayer | null>();
  const [error, setError] = useState<PlayerError | null>();
  const [paused, setPaused] = useState<boolean>(true);

  const onPlayerReady = useCallback((player: THEOplayer) => {
    // Initialize Adobe connector
    initAdobe(player);
    player.source = source_hls;
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
    <View style={styles.fullscreen}>
      <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}/>

      {/*Play/pause button*/}
      {!error && (
        <TouchableOpacity style={styles.fullscreen} onPress={onTogglePlayPause}>
          {paused && <Image style={styles.image} source={PlayButton}/>}
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
