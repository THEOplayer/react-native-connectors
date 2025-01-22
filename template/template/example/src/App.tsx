import React, { useCallback, useState } from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { PlayerConfiguration, SourceDescription, THEOplayer, THEOplayerView } from 'react-native-theoplayer';
import type { ReactNativeTHEOplayerConnectorConfiguration } from 'ReactNativeTHEOplayerConnector';
import { useReactNativeTHEOplayerConnector } from 'ReactNativeTHEOplayerConnector';
import {
  AirplayButton,
  CastMessage,
  CenteredControlBar,
  CenteredDelayedActivityIndicator,
  ChromecastButton,
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
  UiContainer,
} from '@theoplayer/react-native-ui';

const config: ReactNativeTHEOplayerConnectorConfiguration = {
  debug: true,
};

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  license: undefined,
  libraryLocation: 'theoplayer',
};

const source: SourceDescription = {
  sources: {
    src: 'https://cdn.theoplayer.com/video/big_buck_bunny/big_buck_bunny.m3u8',
    type: 'application/x-mpegurl',
  },
  poster: 'https://cdn.theoplayer.com/video/big_buck_bunny/poster.jpg',
  metadata: {
    title: 'The Title',
    subtitle: 'The Subtitle',
    album: 'Album',
    displayIconUri: 'https://cdn.theoplayer.com/video/big_buck_bunny/poster.jpg',
    artist: 'Artist',
  },
};

const App = () => {
  const [player, setPlayer] = useState<THEOplayer | undefined>(undefined);
  const [, initConnector] = useReactNativeTHEOplayerConnector(config);

  const onPlayerReady = useCallback((player: THEOplayer) => {
    setPlayer(player);

    // Initialize connector
    initConnector(player);
    player.autoplay = false;
    player.source = source;
  }, []);

  const needsBorder = Platform.OS === 'ios';
  const PLAYER_CONTAINER_STYLE: ViewStyle = {
    position: 'absolute',
    top: needsBorder ? 20 : 0,
    left: needsBorder ? 5 : 0,
    bottom: 0,
    right: needsBorder ? 5 : 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  };

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }]}>
      <View style={PLAYER_CONTAINER_STYLE}>
        <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}>
          {player !== undefined && (
            <UiContainer
              theme={{ ...DEFAULT_THEOPLAYER_THEME }}
              player={player}
              behind={<CenteredDelayedActivityIndicator size={50} />}
              top={
                <ControlBar>
                  {!Platform.isTV && (
                    <>
                      <AirplayButton />
                      <ChromecastButton />
                    </>
                  )}
                  <LanguageMenuButton />
                  <SettingsMenuButton>
                    {/*Note: quality selection is not available on iOS */}
                    <QualitySubMenu />
                    <PlaybackRateSubMenu />
                  </SettingsMenuButton>
                </ControlBar>
              }
              center={<CenteredControlBar left={<SkipButton skip={-10} />} middle={<PlayButton />} right={<SkipButton skip={30} />} />}
              bottom={
                <>
                  <ControlBar style={{ justifyContent: 'flex-start' }}>
                    <CastMessage />
                  </ControlBar>
                  <ControlBar>
                    <SeekBar />
                  </ControlBar>
                  <ControlBar>
                    <MuteButton />
                    <TimeLabel showDuration={true} />
                    <Spacer />
                    <PipButton />
                    <FullscreenButton />
                  </ControlBar>
                </>
              }
            />
          )}
        </THEOplayerView>
      </View>
    </View>
  );
};

export default App;
