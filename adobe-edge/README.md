# THEOplayer React-Native Adobe Edge Connector

An Adobe analytics connector for `@theoplayer/react-native` using the
[Media Edge API](https://developer.adobe.com/client-sdks/edge/media-for-edge-network/).

Media Edge API is the third generation of solution for tracking Media Events.
It features more analytics data, and the delay before the data can be analysed is much shorter: ~15 minutes
compared to ~45 minutes with Media Heartbeats.

To set up terminology, in chronological order, media tracking solutions were:

1. Media Heartbeats solution
2. Media Collection API
3. Media Edge API

## Installation

The `@theoplayer/react-native` package has a peer dependency on `react-native-device-info`, which has to be installed as well:

```sh
npm install \
  react-native-device-info \
  @theoplayer/react-native-analytics-adobe-edge
```

[//]: # (npm install @theoplayer/react-native-analytics-adobe)

## Usage

### Configuring the connector

Create the connector by providing the `THEOplayer` instance, the Media Collection API's end point,
Visitor Experience Cloud Org ID, Analytics Report Suite ID and the Analytics Tracking Server URL.

```tsx
import { useAdobe } from '@theoplayer/react-native-analytics-adobe';

const baseUrl = "https://edge.adobedc.net/ee-pre-prd/va/v1";
const dataStreamId = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX";
const userAgent = "<Custom User-Agent>"; // Optionally provide a custom user-agent header value.
const debugSessionID = "<debugSessionID>"; // Optionally provide a query parameter to be added to outgoing requests.

const App = () => {
  const [adobe, initAdobe] = useAdobe(baseUrl, dataStreamId, userAgent, debugSessionID);

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
import { AdobeCustomMetadataDetails } from "@theoplayer/react-native-analytics-adobe-edge";

const onUpdateMetadata = () => {
  const metadata: AdobeCustomMetadataDetails[] = [
      { "customTag1": "customValue1" },
      { "customTag2": "customValue2" }
    ]
  adobe.current?.updateMetadata(metadata);
};
```
