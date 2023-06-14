# THEOplayer React-Native Youbora Connector

A Youbora analytics connector for `@theoplayer/react-native`.

## Installation

```sh
npm install @theoplayer/react-native-analytics-youbora
```

[//]: # (npm install @theoplayer/react-native-analytics-youbora)

## Usage

### Configuring the connector

Create the connector by providing the `THEOplayer` instance, the `appId` provided by Youbora, and `instanceName`
that describes the player or site, and an optional set of `YouboraOptions`:

```jsx
import { useYoubora } from '@theoplayer/react-native-analytics-youbora';

const youboraOptions: YouboraOptions = {
  'accountCode': 'powerdev',
  // 'username': 'dev',
  // 'parse.HLS': true,
  // 'parse.CDNNode': true,
  // 'network.ip': '1.1.1.1',
  // 'network.isp': 'MyISP',
  // 'network.connectionType': 'dialup',
  // 'content.transactionCode': 'myTransCode',
  // 'content.resource': 'mysrc.mp4',
  'content.isLive': true,
  'content.title': 'My Title',
  // 'content.title2': 'My Title2',
  // 'content.duration': 100,
  // 'content.fps': '100',
  // 'content.bitrate': 1000000,
  // 'content.throughput': 8000000,
  // 'content.rendition': 'My Rendition',
  // 'content.cdn': 'NICE264',
  // 'content.metadata': {
  //   custom_info: 'info'
  // },
  // 'ad.metadata': {
  //   custom_info: 'info'
  // },
  // 'extraparam.1': 'myExtraParam1',
  // 'extraparam.2': 'myExtraParam2'
};

const App = () => {
  const [youbora, initYoubora] = useYoubora(youboraOptions, youbora.Log.Level.DEBUG);

  const onPlayerReady = (player: THEOplayer) => {
    // Initialize Youbora connector
    initYoubora(player);
  }

  return (<THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}/>);
}
```
