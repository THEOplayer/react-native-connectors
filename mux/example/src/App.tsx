import React, { useCallback, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import {
  PlayerConfiguration,
  SourceDescription,
  THEOplayer,
  THEOplayerView
} from 'react-native-theoplayer';
import { useMux } from '@theoplayer/react-native-analytics-mux';
import SOURCES_ANDROID from "./res/sources_android.json"
import SOURCES_IOS from "./res/sources_ios.json"
import SOURCES_WEB from "./res/sources_web.json"
import {
  CenteredControlBar,
  CenteredDelayedActivityIndicator,
  ControlBar,
  DEFAULT_THEOPLAYER_THEME,
  FullscreenButton,
  LanguageMenuButton,
  MuteButton,
  PipButton,
  PlaybackRateSubMenu,
  PlayButton,
  QualitySubMenu,
  SeekBar,
  SettingsMenuButton,
  SkipButton,
  Spacer,
  TimeLabel,
  UiContainer
} from '@theoplayer/react-native-ui';
import { MuxMenuButton } from "./custom/MuxMenuButton";

const SOURCES = Platform.select({
  "ios": SOURCES_IOS,
  "android": SOURCES_ANDROID,
  "web": SOURCES_WEB
}) || SOURCES_WEB;

const muxOptions = {
  debug: true,
  data: {
    env_key: 'ENV_KEY', // required
    // Site Metadata
    viewer_user_id: '', // ex: '12345'
    experiment_name: '', // ex: 'player_test_A'
    sub_property_id: '', // ex: 'cus-1'
    // Player Metadata
    player_name: '', // ex: 'My Main Player'
    player_version: '', // ex: '1.0.0'
    player_init_time: Date.now(), // ex: 1451606400000
    // Video Metadata
    video_id: '', // ex: 'abcd123'
    video_title: 'Big Buck Bunny', // ex: 'My Great Video'
    video_series: '', // ex: 'Weekly Great Videos'
    video_duration: 120000, // in milliseconds, ex: 120000
    video_stream_type: '', // 'live' or 'on-demand'
    video_cdn: '' // ex: 'Fastly', 'Akamai'
  }
};

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  license: undefined,
  libraryLocation: 'theoplayer'
};

const App = () => {
  const [muxConnector, initMux] = useMux(muxOptions);
  const [player, setPlayer] = useState<THEOplayer | undefined>();
  const [sourceIndex, setSourceIndex] = useState<number>(0);

  const onPlayerReady = useCallback((player: THEOplayer) => {
    // Initialize Mux connector
    initMux(player);
    player.source = SOURCES[sourceIndex].source as SourceDescription;
    player.pipConfiguration = {startsAutomatically: true};

    // Update theoPlayer reference.
    setPlayer(player);
  }, [player]);

  return (
    <View style={[StyleSheet.absoluteFill, {backgroundColor: '#000000'}]}>
      <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}>
        {player !== undefined && (
          <UiContainer
            theme={{...DEFAULT_THEOPLAYER_THEME}}
            player={player}
            behind={<CenteredDelayedActivityIndicator size={50}/>}
            top={
              <ControlBar>
                <LanguageMenuButton/>
                <SettingsMenuButton>
                  {/*Note: quality selection is not available on iOS */}
                  <QualitySubMenu/>
                  <PlaybackRateSubMenu/>
                </SettingsMenuButton>
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
                  <MuxMenuButton muxConnector={muxConnector}/>
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
