import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  PlayerConfiguration,
  THEOplayer,
  THEOplayerView
} from 'react-native-theoplayer';
import { useAdobe } from "@theoplayer/react-native-analytics-adobe-edge";
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

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  license: undefined,
  libraryLocation: 'theoplayer',
};

// Insert correct config values here.
const uri = "https://edge.adobedc.net/ee-pre-prd/va/v1";
const dataStreamId = "01234567-0123-0123-0123-0123456789ab";

const App = () => {
  const [, initAdobe] = useAdobe(uri, dataStreamId);
  const [player, setPlayer] = useState<THEOplayer | undefined>();

  const onPlayerReady = useCallback((player: THEOplayer) => {
    // Initialize Adobe connector
    initAdobe(player);
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
  }
});

export default App;
