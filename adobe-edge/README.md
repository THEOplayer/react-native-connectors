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

```sh
npm install @theoplayer/react-native-analytics-adobe-edge
```

[//]: # (npm install @theoplayer/react-native-analytics-adobe)

## Usage

### Configuring the connector

Create the connector by providing the `THEOplayer` instance and a configuration object with separate parts for
Web and mobile platforms.

```tsx
import { useAdobe } from '@theoplayer/react-native-analytics-adobe-edge';

const config = {
  web: {
    datastreamId: 'abcde123-abcd-1234-abcd-abcde1234567',
    orgId: 'ADB3LETTERSANDNUMBERS@AdobeOrg',
    edgeBasePath: 'ee',
    debugEnabled: true,
  },
  mobile: {
    appId: 'launch-1234567890abcdef1234567890abcdef12',
    debugEnabled: true,
  },
};

const App = () => {
  const [adobe, initAdobe] = useAdobe(config);

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
    {name: 'title', value: 'test'},
    {name: 'custom1', value: 'value1'},
  ]
  adobe.current?.updateMetadata(metadata);
};
```
