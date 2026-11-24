# THEOplayer React-Native Bitmovin Connector

A Bitmovin analytics connector for `@theoplayer/react-native`.

## Installation

Using npm:
```sh
npm install @theoplayer/react-native-analytics-bitmovin
```
[//]: # (npm install @theoplayer/react-native-analytics-bitmovin)

Using yarn:
```sh
yarn add @theoplayer/react-native-analytics-bitmovin
```
[//]: # (yarn add @theoplayer/react-native-analytics-bitmovin)

### Apple Native Dependencies

With CocoaPods, keep normal autolinking and run `pod install` after installing
the npm package.

With Swift Package Manager (SPM) on iOS and tvOS:

1. Complete the base player's
   [SPM setup](https://github.com/THEOplayer/react-native-theoplayer/blob/develop/doc/creating-minimal-app.md#getting-started-on-ios-and-tvos).
2. Leave autolinking **enabled** for `@theoplayer/react-native-analytics-bitmovin`.
3. Run `npx --no-install react-native spm sync` from the app root, then build and
   run the Xcode project.

The connector supplies its own `Package.swift` and RN package registration.
No `spm scaffold` step, dependency patch, or manual Bitmovin Xcode reference is
required. Its manifest selects Bitmovin's 3.x
`THEOplayerCollector` product, which includes `CoreCollector` transitively.
It does not select Bitmovin's own player or AVFoundation collector products.

This setup requires a base player release with SPM support, Swift tools 6.1 or
later, and deployment targets of iOS 16 or tvOS 15.1 or later. It assumes normal
npm folders at `<app>/node_modules/@theoplayer/react-native-analytics-bitmovin`
and `<app>/node_modules/react-native-theoplayer`, with RN's React package at
`<app>/ios/build/xcframeworks`. Source-checkout links, hoisted dependencies, and
custom native directory layouts need separate validation.

## Usage

### Configuring the connector

Create the connector using the `useBitmovin` hook with the initial configuration.

Once the player is ready, initialize the connector by calling the `initBitmovin` function with the `THEOplayer`
instance and the **default metadata**, which contains properties that do not change during the session.

Finally, before the player source is set, update first the **source metadata** by calling the `updateSourceMetadata` function.

> **IMPORTANT:** Call `updateSourceMetadata` before setting the player source, otherwise the source metadata will
> not be included in the analytics events.

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
    customData1: 'value1',
    customData2: 'value2'
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

    // Update source metadata.
    bitmovin.updateSourceMetadata(sourceMetadata);

    // Set player source after updating source metadata.
    player.source = {/*...*/}
  }

  return (<THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}/>);
}
```

### Dynamically updating custom data

The connector allows updating the **custom data** at any time during the playback session, which will cause the new
custom data to be merged with the existing custom data and included in all subsequent analytics events:

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

### Getting the current impression ID

The current impression ID can be retrieved asynchronously. The promise resolves to `undefined` when
there is no active impression or analytics session:

```tsx
const impressionId = await bitmovin.getImpressionId();
```
