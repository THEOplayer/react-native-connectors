import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  PlayerConfiguration,
  THEOplayer,
  THEOplayerView
} from 'react-native-theoplayer';
import { AgamaPolyfills, useAgama } from "@theoplayer/react-native-analytics-agama";
import type { AgamaConfiguration } from "../../src/api/AgamaConfiguration";
import {
  CenteredControlBar,
  CenteredDelayedActivityIndicator,
  ControlBar,
  DEFAULT_THEOPLAYER_THEME, FullscreenButton,
  LanguageMenuButton,
  MuteButton, PipButton,
  PlaybackRateSubMenu, PlayButton,
  QualitySubMenu,
  SeekBar,
  SettingsMenuButton,
  SkipButton, Spacer,
  TimeLabel,
  UiContainer
} from "@theoplayer/react-native-ui";
import { SourceMenuButton, SOURCES } from "./custom/SourceMenuButton";

// Enable connector debug info
__DEBUG__ = true;

// Install Agama polyfills and libraries
AgamaPolyfills.install();
require('./static/empclient.min');
require('./static/empclient.compat5.min');

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  license: undefined,
  libraryLocation: 'theoplayer',
};

const agamaConfig: AgamaConfiguration = {
  config: 'emp_service=http://127.0.0.1:8191/report;report_interval=60;id_report_interval=240;operator_id=fooSoo',
  logLevel: 'debug',
  application: 'React-Native THEOplayer Demo',
}

const App = () => {
  const [, initAgama] = useAgama(agamaConfig as AgamaConfiguration);
  const [player, setPlayer] = useState<THEOplayer | undefined>();

  const onPlayerReady = useCallback((player: THEOplayer) => {
    // Initialize Agama connector
    initAgama(player);
    player.source = SOURCES[0].source;

    // Update theoPlayer reference.
    setPlayer(player);
  }, []);

  return (
    <View style={styles.fullscreen}>
      <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}>
        {player !== undefined && (
          <UiContainer
            theme={{...DEFAULT_THEOPLAYER_THEME}}
            player={player}
            behind={<CenteredDelayedActivityIndicator size={50}/>}
            top={
              <ControlBar>
                <SourceMenuButton/>
                <LanguageMenuButton/>
                <SettingsMenuButton>
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
                  <PipButton/>
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
});

export default App;
