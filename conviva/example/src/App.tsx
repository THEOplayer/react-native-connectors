import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
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
import type { ConvivaConfiguration, ConvivaMetadata } from '@theoplayer/react-native-analytics-conviva';
import { useConviva } from '@theoplayer/react-native-analytics-conviva';
import { SourceMenuButton, SOURCES } from "./custom/SourceMenuButton";
import { AnalyticsMenuButton } from "./custom/AnalyticsMenuButton";

// Insert correct config values here.
const TEST_CUSTOMER_KEY = '<customer_key>';
const TOUCHSTONE_SERVICE_URL = '<touchstone_url>';

const convivaMetadata: ConvivaMetadata = {
  ['Conviva.assetName']: 'NA (not set)',
  ['Conviva.applicationName']: 'THEOplayer',
  ['Conviva.viewerId']: 'your_viewer_id'
};

const convivaConfig: ConvivaConfiguration = {
  customerKey: TEST_CUSTOMER_KEY, // Can be a test or production key.
  debug: true,
  gatewayUrl: TOUCHSTONE_SERVICE_URL
};

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  license: undefined,
  libraryLocation: 'theoplayer'
};

const App = () => {
  const [conviva, initConviva] = useConviva(convivaMetadata, convivaConfig);
  const [player, setPlayer] = useState<THEOplayer | undefined>();

  const onPlayerReady = useCallback((player: THEOplayer) => {
    // Initialize Conviva connector
    initConviva(player);
    player.source = SOURCES[0].source;

    // Update theoPlayer reference.
    setPlayer(player);
  }, [player]);

  const onCustomMetadata = () => {
    const metadata: ConvivaMetadata = {
      ['customTag1']: `custom ${(new Date()).toLocaleString()}`,
      ['customTag2']: "customValue2",
    };
    conviva.current?.setContentInfo(metadata);
  };

  const onStopAndStartNewSession = useCallback(() => {
    conviva.current?.stopAndStartNewSession({
      ['Conviva.assetName']: 'New session title'
    });
  }, [player])

  return (
    <View style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}}>

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
                  <AnalyticsMenuButton
                    menuTitle={"Conviva Connector"}
                    options={[
                      {
                        title: 'Change Program',
                        action: onCustomMetadata
                      },
                      {
                        title: 'Stop and Start New Session',
                        action: onStopAndStartNewSession
                      }
                    ]}/>
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

export default App;
