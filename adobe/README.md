# THEOplayer React-Native Adobe Connector

An Adobe analytics connector for `@theoplayer/react-native`.

## Installation

```sh
npm install https://theoplayer-cdn.s3.eu-west-1.amazonaws.com/react-native-theoplayer/theoplayer-react-native-analytics-adobe-0.1.0.tgz
```

[//]: # (npm install @theoplayer/react-native-analytics-adobe)

## Usage

### Configuring the connector

Create the connector by providing the `THEOplayer` instance, the Media Collection API's end point,
Visitor Experience Cloud Org ID, Analytics Report Suite ID and the Analytics Tracking Server URL.

```jsx
import { AdobeConnector, useAdobe } from '@theoplayer/react-native-analytics-adobe';

const uri = "<Media Collection API's end point>";
const ecid = "<Visitor Experience Cloud Org ID>";
const sid = "<Report Suite ID>";
const trackingUrl = "<Tracking Server URL>";

const App = () => {
  const [adobe, initAdobe] = useAdobe(uri, ecid, sid, trackingUrl);

  const onPlayerReady = (player: THEOplayer) => {
    // Initialize Adobe connector
    initAdobe(player);
  }

  return (<THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}/>);
}
```

The Adobe connector will dispatch player events to Adobe with standard metadata the player has access to,
such as duration or whether it is a live or vod.

### Passing metadata dynamically

The connector allows passing or updating the current asset's metadata at any time:

```typescript
import { AdobeMetaData } from "./Types";

const onUpdateMetadata = () => {
  const metadata: AdobeMetaData = {
    "params": {
      "media.channelName": "channelName",
      "media.id": "mediaId"
    },
    "customMetadata": {
      "customTag1": "customValue1",
      "customTag2": "customValue2"
    }
  };
  adobe.current?.updateMetadata(metadata);
};
```
