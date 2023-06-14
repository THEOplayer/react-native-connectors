import React, { useCallback, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  PlayerConfiguration,
  PlayerError,
  PlayerEventType,
  SourceDescription,
  THEOplayer,
  THEOplayerView
} from 'react-native-theoplayer';
import { useYoubora } from '@theoplayer/react-native-analytics-youbora';
import { PlayButton } from './res/images';
import youbora from "youboralib";

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
  ]
};

const options = {
  'accountCode': 'powerdev',
  // 'username': 'dev',
  // 'parse.HLS': true,
  // 'parse.CDNNode': true,
  // 'network.ip': '1.1.1.1',
  // 'network.isp': 'MyISP',
  // 'network.connectionType': 'dialup',
  // 'content.transactionCode': 'myTransCode',
  // 'content.resource': 'mysrc.mp4',
  'content.isLive': false,
  'content.title': 'Big Buck Bunny',
  // 'content.title2': 'My Title2',
  // 'content.duration': 100,
  // 'content.fps': '100',
  // 'content.bitrate': 1000000,
  // 'content.throughput': 8000000,
  // 'content.rendition': 'My Rendition',
  // 'content.cdn': 'NICE264',
  // 'content.metadata': {
  //   custom_info: 'info'
  // },
  'ad.metadata': {
    custom_info: 'info'
  },
  // 'extraparam.1': 'myExtraParam1',
  // 'extraparam.2': 'myExtraParam2'
}

const App = () => {
  const [_youbora, initYoubora] = useYoubora(options, youbora.Log.Level.DEBUG);
  const theoPlayer = useRef<THEOplayer | null>();
  const [error, setError] = useState<PlayerError | null>();
  const [paused, setPaused] = useState<boolean>(true);

  const onPlayerReady = useCallback((player: THEOplayer) => {
    // Initialize Youbora connector
    initYoubora(player);
    player.autoplay = !paused;
    player.source = source;
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
