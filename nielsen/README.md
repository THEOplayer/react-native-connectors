# THEOplayer React-Native Nielsen Connector

A Nielsen analytics connector for `@theoplayer/react-native`.

## Installation

```sh
npm install https://theoplayer-cdn.s3.eu-west-1.amazonaws.com/react-native-theoplayer/theoplayer-react-native-analytics-nielsen-0.1.0.tgz
```

[//]: # (npm install @theoplayer/react-native-analytics-nielsen)

## Usage

### Configuring the connector

Create the connector by providing the `THEOplayer` instance, the `appId` provided by Nielsen, and `instanceName`
that describes the player or site, and an optional set of `NielsenOptions`:

```jsx
import { NielsenConnector } from '@theoplayer/react-native-analytics-nielsen';

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
  const nielsenConnector = useRef<NielsenConnector | null>();

  useEffect(() => {
    return () => {
      // Destroy connector when unmounting
      nielsenConnector.current?.destroy()
    }
  }, []);

  const onPlayerReady = (player: THEOplayer) => {
    // Create Nielsen connector
    nielsenConnector.current = new NielsenConnector(player, appId, instanceName, nielsenOptions);
  }

  return (<THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}/>);
}
```

### Passing metadata dynamically

The connector allows passing or updating the current asset's metadata at any time:

```typescript
const onUpdateMetadata = () => {
  nielsenConnector.current?.updateMetadata({
    'title': 'Episode Title',
    'assetid': 'unique_id_500291'
  });
};
```
