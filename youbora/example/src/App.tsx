import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  PlayerConfiguration,
  SourceDescription,
  THEOplayer,
  THEOplayerView,
} from 'react-native-theoplayer';
import { useYoubora, youbora } from '@theoplayer/react-native-analytics-youbora';
import {
  CenteredControlBar,
  CenteredDelayedActivityIndicator,
  ControlBar,
  DEFAULT_THEOPLAYER_THEME,
  FullscreenButton,
  FULLSCREEN_CENTER_STYLE, LanguageMenuButton, MuteButton,
  PlayButton,
  SeekBar,
  SkipButton,
  Spacer,
  TimeLabel,
  UiContainer
} from "@theoplayer/react-native-ui";

const config: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  license: undefined,
  libraryLocation: 'theoplayer',
  chromeless: true
};

const source: SourceDescription = {
  sources: [
    {
      type: "application/x-mpegurl",
      src: "https://cdn.theoplayer.com/video/big_buck_bunny/big_buck_bunny.m3u8"
    }
  ]
};

const options: youbora.Options = {
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
  const [connector, initYoubora] = useYoubora(options);
  const [player, setPlayer] = useState<THEOplayer | undefined>(undefined);

  const onPlayerReady = useCallback((player: THEOplayer) => {
    // Update theoPlayer reference.
    setPlayer(player);

    // Initialize Youbora connector
    initYoubora(player);

    // Change log level
    connector.current?.setDebugLevel(youbora.Log.Level.DEBUG);

    player.source = source;
  }, [player]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={[FULLSCREEN_CENTER_STYLE, {backgroundColor: '#000000'}]}/>
      <THEOplayerView config={config} onPlayerReady={onPlayerReady}>
        {player && (
          <UiContainer
            theme={{...DEFAULT_THEOPLAYER_THEME}}
            player={player}
            behind={<CenteredDelayedActivityIndicator size={50}/>}
            top={
              <ControlBar>
                <LanguageMenuButton/>
              </ControlBar>
            }
            center={<CenteredControlBar left={<SkipButton skip={-10}/>} middle={<PlayButton/>}
                                        right={<SkipButton skip={30}/>}/>}
            bottom={
              <>
                <ControlBar>
                  <SeekBar/>
                </ControlBar>
                <ControlBar>
                  <MuteButton/>
                  <TimeLabel showDuration={true}/>
                  <Spacer/>
                  <FullscreenButton/>
                </ControlBar>
              </>
            }
          />
        )}
      </THEOplayerView>
    </View>
  );
};

export default App;
