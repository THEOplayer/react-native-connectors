import React from 'react';
import { View } from 'react-native';
import { PlayerConfiguration, THEOplayer, THEOplayerView } from 'react-native-theoplayer';
import { ConvivaConnector } from 'react-native-theoplayer-conviva';

const playerConfig: PlayerConfiguration = {
  // Get your THEOplayer license from https://portal.theoplayer.com/
  license: undefined
};

const source = {
  sources: [
    {
      src: 'https://contentserver.prudentgiraffe.com/videos/dash/webvtt-embedded-in-isobmff/Manifest.mpd',
      type: 'application/dash+xml',
    },
  ],
};

const onPlayerReady = (player: THEOplayer) => {

  const connector = new ConvivaConnector(player, {}, {});
  player.autoplay = true;
  player.source = source;
}

const App = () => {
  return (
    <View style={ { position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 } }>
      <THEOplayerView config={ playerConfig } onPlayerReady={ onPlayerReady }/>
    </View>
  );
};

export default App;
