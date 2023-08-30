import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  PlayerConfiguration,
  SourceDescription,
  THEOplayer,
  THEOplayerView
} from 'react-native-theoplayer';
import { MuxData, useMux } from '@theoplayer/react-native-analytics-mux';
import {
  CenteredControlBar,
  CenteredDelayedActivityIndicator,
  ControlBar,
  DEFAULT_THEOPLAYER_THEME,
  LanguageMenuButton,
  MuteButton,
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
import { SOURCES } from "./custom/SourceMenuButton";
import { AnalyticsMenuButton } from "./custom/AnalyticsMenuButton";

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

  const onPlayerReady = useCallback((player: THEOplayer) => {
    // Initialize Mux connector
    initMux(player);
    player.source = SOURCES[0].source as SourceDescription;

    muxConnector.current?.changeVideo({
      // Video Metadata
      video_id: '', // ex: 'abcd123'
      video_title: 'Big Buck Bunny', // ex: 'My Great Video'
      video_series: '', // ex: 'Weekly Great Videos'
      video_duration: 120000, // in milliseconds, ex: 120000
      video_stream_type: '', // 'live' or 'on-demand'
      video_cdn: '' // ex: 'Fastly', 'Akamai'
    });

    player.pipConfiguration = {startsAutomatically: true};

    // Update theoPlayer reference.
    setPlayer(player);
  }, [player]);

  const onChangeProgram = () => {
    muxConnector.current?.changeProgram({
        video_title: 'New video title'
      } as MuxData
    );
  }

  const onNotifyError = () => {
    muxConnector.current?.notifyError(
      100,
      "Description of error",
      'Additional context for the error'
    );
  }

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
                  <AnalyticsMenuButton
                    menuTitle={'Nielsen'}
                    options={[{
                      title: 'Change Program',
                      action: onChangeProgram
                    }, {
                      title: 'Notify Error',
                      action: onNotifyError
                    }]}/>
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
