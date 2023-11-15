import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import {
  PlayerConfiguration,
  THEOplayer,
  THEOplayerView,
} from 'react-native-theoplayer';
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
import { useComscore } from '@theoplayer/react-native-analytics-comscore';
import { ComscoreConfiguration, ComscoreMetadata, ComscoreMediaType, ComscoreUserConsent, ComscoreUsagePropertiesAutoUpdateMode } from '@theoplayer/react-native-analytics-comscore';
import { SourceMenuButton, SOURCES } from "./custom/SourceMenuButton";

if (Platform.OS === 'web') {
  __DEBUG__ = true;
}

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  license: undefined,
  libraryLocation: 'theoplayer'
};

const comscoreMetadata: ComscoreMetadata = {
  mediaType: ComscoreMediaType.longFormOnDemand,
  uniqueId: "testuniqueId",
  length: 634.566,
  stationTitle: "THEOTV",
  programTitle: "Big Buck Bunny",
  episodeTitle: "Intro",
  genreName: "Animation",
  classifyAsAudioStream: false,
  customLabels: {
    "testcustomlabel": "testcustomvalue"
  },
  c3: "c3value",
  c4: "c4value",
  c6: "c6value"
};

const comscoreConfig: ComscoreConfiguration = {
  publisherId: "<publisherId>", // Can be a test or production key.
  applicationName: "ReactNativeTHEOplayer",
  usagePropertiesAutoUpdateMode: ComscoreUsagePropertiesAutoUpdateMode.foregroundAndBackground,
  userConsent: ComscoreUserConsent.granted,
  debug: true,
};

const App = () => {
  const [comscore, initComscore] = useComscore(comscoreMetadata, comscoreConfig);
  const [player, setPlayer] = useState<THEOplayer | undefined>();

  const onPlayerReady = useCallback((player: THEOplayer) => {
    // Initialize Comscore connector
    initComscore(player);
    player.source = SOURCES[0].source;
    comscore.current.update(comscoreMetadata)

    // Update theoPlayer reference.
    setPlayer(player);
  }, [player]);

  return (
    <View style={ styles.fullscreen }>

      <THEOplayerView config={ playerConfig } onPlayerReady={ onPlayerReady }>
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
  }
});

export default App;
