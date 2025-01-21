# THEOplayer React-Native Nielsen Connector

A Nielsen analytics connector for `@theoplayer/react-native`.

## Installation

```sh
npm install @theoplayer/react-native-analytics-nielsen
```

[//]: # (npm install @theoplayer/react-native-analytics-nielsen)

## Usage

### Configuring the connector

Create the connector by providing the `THEOplayer` instance, the `appId` provided by Nielsen, and `instanceName`
that describes the player or site, and an optional set of `NielsenOptions`:

```tsx
import { useNielsen, NielsenOptions } from '@theoplayer/react-native-analytics-nielsen';

const appId = 'PXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX';

const instanceName = 'THEOplayer demo';

const nielsenOptions: NielsenOptions = {
  // Enables Debug Mode which allows output to be viewed in console
  nol_sdkDebug: 'debug'

  // HTML DOM element id of the player container (if implementing Viewability/Audibility)
  // containerId: 'player1',

  // Optout on initialization of the SDK
  // optout: false,
};

const App = () => {
  const [nielsen, initNielsen] = useNielsen(appId, instanceName, nielsenOptions);

  const onPlayerReady = (player: THEOplayer) => {
    // Initialize Nielsen connector
    initNielsen(player);
  }

  return (<THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}/>);
}
```

### Passing metadata dynamically

The connector allows passing or updating the current asset's metadata at any time:

```typescript
const onUpdateMetadata = () => {
  nielsen.current?.updateMetadata({
    'title': 'Episode Title',
    'assetid': 'unique_id_500291'
  });
};
```
