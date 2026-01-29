# THEOplayer React-Native Bitmovin Connector

A Bitmovin analytics connector for `@theoplayer/react-native`.

## Installation

```sh
npm install @theoplayer/react-native-analytics-bitmovin
```

[//]: # (npm install @theoplayer/react-native-analytics-bitmovin)

## Usage

### Configuring the connector

Create the connector using the `useBitmovin` hook with the initial configuration.

Once the player is ready, initialize the connector by calling the `initBitmovin` function with the `THEOplayer`
instance and the **default metadata**, which contains properties that do not change during the session.

Finally, when the player source is set, update the **source metadata** by calling the `updateSourceMetadata` function.

```tsx
import {
  useBitmovin,
  AnalyticsConfig,
  DefaultMetadata,
  SourceMetadata
} from '@theoplayer/react-native-analytics-bitmovin';

const bitmovinConfig: AnalyticsConfig = {
  licenseKey: 'license-key-here',
  logLevel: 'DEBUG'
}

const defaultMetadata: DefaultMetadata = {
  cdnProvider: 'akamai',
  customUserId: 'custom-user-id-1234',
  customData: {
    customData0: 'value0',
    customData1: 'value1'
  }
};

const sourceMetadata: SourceMetadata = {
  title: 'Sample Video',
  videoId: 'video-1234',
  cdnProvider: 'akamai',
  path: '/home/videos/sample-video',
  isLive: false,
  customData: {
    customData10: 'value10',
    customData11: 'value11'
  }
}

const App = () => {
  const [bitmovin, initBitmovin] = useBitmovin(bitmovinConfig);

  const onPlayerReady = (player: THEOplayer) => {
    // Initialize connector with player & default metadata.
    initBitmovin(player, defaultMetadata);
    player.source = {/*...*/}

    // Update source metadata.
    bitmovin.updateSourceMetadata(sourceMetadata);
  }

  return (<THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}/>);
}
```

### Dynamically updating custom data

The connector allows updating the **custom data** at any time during the playback session:

```tsx
bitmovin.updateCustomData({
  customData0: 'newValue0',
  customData1: 'newValue1'
});
```

### Updating source metadata during a live stream

The connector allows dynamically updating the **source metadata**, for example during a live stream when
the program changes:

```tsx
bitmovin.programChange({
  title: 'New Live Program',
  videoId: 'live-program-5678',
  customData: {
    customData10: 'newValue10'
  }
});
```
