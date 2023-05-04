# THEOplayer React-Native Conviva Connector

A Conviva analytics connector for `@theoplayer/react-native`.

## Installation

```sh
npm install @theoplayer/react-native-analytics-conviva
```

[//]: # (npm install @theoplayer/react-native-analytics-conviva)

## Usage

### Configuring the connector

Create the connector by providing the `THEOplayer` instance, some initial metadata and a config
object:

```jsx
import { useConviva } from '@theoplayer/react-native-analytics-conviva';

const convivaMetadata: ConvivaMetadata = {
  ['Conviva.applicationName']: 'THEOplayer',
  ['Conviva.viewerId']: 'your_viewer_id'
};

const convivaConfig: ConvivaConfiguration = {
  customerKey: 'your_customer_key',
  debug: true,
  gatewayUrl: 'https://[account]-test.testonly.conviva.com'
};

const App = () => {
  const [conviva, initConviva] = useConviva(convivaMetadata, convivaConfig);

  const onPlayerReady = (player: THEOplayer) => {
    // Initialize connector
    initConviva(player);
  }

  return (<THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}/>);
}
```

The `convivaMetada` object contains key-value pairs that are passed directly to the Conviva SDK.
Most media related properties, such as its streamURL, duration or whether it is a live or vod
stream, are passed by the connector itself.
Any metadata related properties can be passed through the open key-value map:

| Key                   | Value                           |
|-----------------------|---------------------------------|
| `'Conviva.assetName'` | Asset name of the next program. |
| `'customTag'`         | Any custom value.               |

### Passing metadata dynamically

The connector allows passing or updating the current asset's metadata at any time:

```typescript
const onUpdateMetadata = () => {
  const metadata: ConvivaMetadata = {
    ['customTag1']: "customValue1",
    ['customTag2']: "customValue2",
  };
  conviva.current?.setContentInfo(metadata);
};
```
