import React, { useCallback, useState } from 'react';
import {Platform, StyleSheet, View } from 'react-native';
import {
  PlayerConfiguration,
  THEOplayer,
  THEOplayerView
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
import { useNielsen } from '@theoplayer/react-native-analytics-nielsen';
import type { NielsenOptions } from "@theoplayer/nielsen-connector-web";
import { SourceMenuButton, SOURCES } from "./custom/SourceMenuButton";

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  license: undefined,
  libraryLocation: 'theoplayer'
};

// Insert correct config values here.
let appId: string
if (Platform.OS === "web") {
  appId = "<appId_web>";
} else if (Platform.OS === "android") {
  appId = "<appId_android>";
} else if (Platform.OS === "ios") {
  appId = "<appId_ios>";
}

const nielsenOptions: NielsenOptions = {
  // containerId: 'THEOplayer',
  nol_sdkDebug: 'debug'
};

const App = () => {
  const [nielsen, initNielsen] = useNielsen(appId, 'THEOplayer demo', nielsenOptions);
  const [player, setPlayer] = useState<THEOplayer | undefined>();

  const onPlayerReady = useCallback((player: THEOplayer) => {
    // Initialize Nielsen connector
    initNielsen(player);
    player.source = SOURCES[0].source;

    // Update theoPlayer reference.
    setPlayer(player);
  }, [player]);

  const onCustomMetadata = () => {
    const metadata = {
      'assetid': 'C77664',
      'program': 'testprogram'
    };
    nielsen.current?.updateMetadata(metadata);
  };

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
