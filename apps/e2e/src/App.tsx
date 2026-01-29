import * as React from 'react';
import { useState } from 'react';
import {
  AdClickThroughButton,
  AdCountdown,
  AdDisplay,
  AdSkipButton,
  AutoFocusGuide,
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
  UiContainer,
} from '@theoplayer/react-native-ui';
import { PlayerConfiguration, PlayerEventType, THEOplayer, THEOplayerView } from 'react-native-theoplayer';
import { Platform, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Config from 'react-native-config';
import {useConviva} from "@theoplayer/react-native-analytics-conviva";
import {convivaConfig} from "./constants/conviva.config";
import {convivaMetadata} from "./constants/conviva.metadata";
import { useBitmovin } from '@theoplayer/react-native-analytics-bitmovin';
import { bitmovinConfig, bitmovinDefaultMetadata } from './constants/bitmovin.config';
import { BackgroundAudioSubMenu } from './components/menu/BackgroundAudioSubMenu';
import { PiPSubMenu } from './components/menu/PipSubMenu';
import { AutoPlaySubMenu } from './components/menu/AutoPlaySubMenu';
import { RenderingTargetSubMenu } from './components/menu/RenderingTargetSubMenu';
import { SourceMenuButton, SOURCES } from './components/menu/SourceMenuButton';
import { ConnectorSvg } from './res/ConnectorSvg';
import { ConnectorSubMenu } from './components/menu/ConnectorSubMenu';
import { ConnectorsMenuButton } from './components/menu/ConnectorMenu';

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  // Without a license, only demo sources hosted on '*.theoplayer.com' domains can be played.
  license: Config.THEO_LICENSE_KEY,
  libraryLocation: 'theoplayer',
  mediaControl: {
    mediaSessionEnabled: true,
  },
  mutedAutoplay: 'all',
};

/**
 * The example app demonstrates the use of the THEOplayerView with a custom UI using the provided UI components.
 * If you don't want to create a custom UI, you can just use the THEOplayerDefaultUi component instead.
 */
export default function App() {
  const [player, setPlayer] = useState<THEOplayer | undefined>(undefined);
  const isDarkMode = useColorScheme() === 'dark';

  const [, initConviva] = useConviva(convivaMetadata, convivaConfig);
  const [bitmovin, initBitmovin] = useBitmovin(bitmovinConfig);

  const onBitmovinProgramChange = () => {
    bitmovin.current?.programChange({
      title: 'New title',
    });
  };

  const onBitmovinUpdateCustomData = () => {
    bitmovin.current?.updateCustomData({
      customData0: 'customData0 value',
      customData1: 'customData1 value',
    });
  };

  const onPlayerReady = (player: THEOplayer) => {
    setPlayer(player);

    initConviva(player);
    initBitmovin(player, bitmovinDefaultMetadata);

    // optional debug logs
    player.addEventListener(PlayerEventType.SOURCE_CHANGE, console.log);
    player.addEventListener(PlayerEventType.LOADED_DATA, console.log);
    player.addEventListener(PlayerEventType.LOADED_METADATA, console.log);
    player.addEventListener(PlayerEventType.READYSTATE_CHANGE, console.log);
    player.addEventListener(PlayerEventType.PLAY, console.log);
    player.addEventListener(PlayerEventType.PLAYING, console.log);
    player.addEventListener(PlayerEventType.PAUSE, console.log);
    player.addEventListener(PlayerEventType.SEEKING, console.log);
    player.addEventListener(PlayerEventType.SEEKED, console.log);
    player.addEventListener(PlayerEventType.ENDED, console.log);
    player.muted = true;
    player.autoplay = true;

    player.source = SOURCES[0].source;

    player.backgroundAudioConfiguration = { enabled: true };
    player.pipConfiguration = { startsAutomatically: true };
  };

  return (
    /**
     * The SafeAreaProvider component is a View from where insets provided by consumers are relative to.
     * This means that if this view overlaps with any system elements (status bar, notches, etc.) these values will be provided to
     * descendent consumers such as SafeAreaView.
     * {@link https://appandflow.github.io/react-native-safe-area-context/api/safe-area-provider}
     */
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView style={styles.container}>
        <View style={styles.playerContainer}>
          <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}>
            {player !== undefined && (
              <UiContainer
                theme={{ ...DEFAULT_THEOPLAYER_THEME }}
                player={player}
                behind={<CenteredDelayedActivityIndicator size={50} />}
                top={
                  <AutoFocusGuide>
                    <ControlBar>
                      <Spacer />
                      <SourceMenuButton />
                      <LanguageMenuButton />
                      <ConnectorsMenuButton>
                        <ConnectorSubMenu title={'Bitmovin - programChange'} onPress={onBitmovinProgramChange} />
                        <ConnectorSubMenu title={'Bitmovin - updateCustomData'} onPress={onBitmovinUpdateCustomData} />
                      </ConnectorsMenuButton>
                      <SettingsMenuButton>
                        {/*Note: quality selection is not available on iOS */}
                        <QualitySubMenu />
                        <PlaybackRateSubMenu />
                        <BackgroundAudioSubMenu />
                        <PiPSubMenu />
                        <AutoPlaySubMenu />
                        {Platform.OS === 'android' && <RenderingTargetSubMenu />}
                      </SettingsMenuButton>
                    </ControlBar>
                  </AutoFocusGuide>
                }
                center={
                  <AutoFocusGuide>
                    <CenteredControlBar
                      style={{ width: '50%' }}
                      left={<SkipButton skip={-10} />}
                      middle={<PlayButton />}
                      right={<SkipButton skip={30} />}
                    />
                  </AutoFocusGuide>
                }
                bottom={
                  <AutoFocusGuide>
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
                  </AutoFocusGuide>
                }
                adTop={
                  <AutoFocusGuide>
                    <ControlBar>
                      <AdClickThroughButton />
                    </ControlBar>
                  </AutoFocusGuide>
                }
                adCenter={
                  <AutoFocusGuide>
                    <CenteredControlBar middle={<PlayButton />} />
                  </AutoFocusGuide>
                }
                adBottom={
                  <AutoFocusGuide>
                    <ControlBar style={{ justifyContent: 'flex-start' }}>
                      <AdDisplay />
                      <AdCountdown />
                      <Spacer />
                      <AdSkipButton />
                    </ControlBar>
                    <ControlBar>
                      <MuteButton />
                      <SeekBar />
                    </ControlBar>
                  </AutoFocusGuide>
                }
              />
            )}
          </THEOplayerView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  playerContainer: {
    flex: 1,
    // on iOS, we cannot stretch an inline playerView to cover the whole screen, otherwise it assumes fullscreen presentationMode.
    marginHorizontal: Platform.select({ ios: 2, default: 0 }),
    alignItems: 'center',
    justifyContent: 'center',
  },
});
