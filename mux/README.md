# THEOplayer React-Native Mux Connector

A Mux analytics connector for `@theoplayer/react-native`.

## Installation

```sh
npm install @theoplayer/react-native-analytics-mux
```

[//]: # (npm install @theoplayer/react-native-analytics-mux)

## Usage

### Configuring the connector

Create the connector by providing the `THEOplayer` instance, some initial metadata and a config
object:

```jsx
import { useMux } from '@theoplayer/react-native-analytics-mux';

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
    player_init_time: '', // ex: 1451606400000
    // Video Metadata
    video_id: '', // ex: 'abcd123'
    video_title: '', // ex: 'My Great Video'
    video_series: '', // ex: 'Weekly Great Videos'
    video_duration: '', // in milliseconds, ex: 120000
    video_stream_type: '', // 'live' or 'on-demand'
    video_cdn: '' // ex: 'Fastly', 'Akamai'
  }
};

const App = () => {
  const [mux, initMux] = useMux(muxOptions);

  const onPlayerReady = (player: THEOplayer) => {
    // Initialize connector
    initMux(player);
  }

  return (<THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}/>);
}
```
