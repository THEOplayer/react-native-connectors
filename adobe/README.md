# THEOplayer React-Native Adobe Connector

An Adobe analytics connector for `@theoplayer/react-native`.

## Installation

This connector has a peer dependency on `react-native-device-info`, which has to be installed as well:

```sh
npm install \
  react-native-device-info@^14.0.4 \
  @theoplayer/react-native-analytics-adobe
```

[//]: # (npm install @theoplayer/react-native-analytics-adobe)

### Apple Native Dependencies

With CocoaPods, keep normal autolinking and run `pod install` after installing
the npm packages.

With Swift Package Manager (SPM) on iOS and tvOS:

1. Complete the base player's
   [SPM setup](https://github.com/THEOplayer/react-native-theoplayer/blob/main/doc/creating-minimal-app.md#getting-started-on-ios-and-tvos).
2. Leave autolinking **enabled** for this connector and its
   `react-native-device-info` peer dependency.
3. Ensure the app's `react-native-device-info` dependency supports SPM; see the note below.
4. Run `npx --no-install react-native spm sync` from the app root, then build and
   run the Xcode project.

The Adobe connector itself supplies its own `Package.swift` and RN package
registration; no `spm scaffold` step is needed for this connector.
Do not add the connector manually in Xcode.
Its native Media Collection connector is implemented in this package; no
separate Adobe vendor SDK or `iOS-Connector` product is required.

This setup requires a base player release with SPM support, Swift tools 6.1 or
later, and deployment targets of iOS 16 or tvOS 15.1 or later. It assumes normal
npm folders at `<app>/node_modules/@theoplayer/react-native-analytics-adobe`
and `<app>/node_modules/react-native-theoplayer`, with RN's React package at
`<app>/ios/build/xcframeworks`. Source-checkout links, hoisted dependencies, and
custom native directory layouts need separate validation.

#### Device-Info SPM Setup

The app must provide an SPM-compatible setup for its `react-native-device-info`
peer dependency. As an optional aid, this package includes a
[packaging-only patch for 14.1.1](patches/react-native-device-info+14.1.1.patch),
which can be applied with `patch-package`. The patch is specific to that version;
other versions may need a different setup. CocoaPods users do not need it.

## Usage

### Configuring the connector

Create the connector by providing the `THEOplayer` instance, the Media Collection API's end point,
Visitor Experience Cloud Org ID, Analytics Report Suite ID and the Analytics Tracking Server URL.

```tsx
import { useAdobe } from '@theoplayer/react-native-analytics-adobe';

const uri = "<Media Collection API's end point>";
const ecid = "<Visitor Experience Cloud Org ID>";
const sid = "<Report Suite ID>";
const trackingUrl = "<Tracking Server URL>";
const metadata = {}; // Optionally provide initial metadata
const userAgent = "<Custom User-Agent>"; // Optionally provide a custom user-agent header value.
const debug = true; // Optionally provide a debug flag for extra logging.
const useNative = true; // Use a native connector on iOS & Android; `false` by default.

const App = () => {
  const [adobe, initAdobe] = useAdobe(uri, ecid, sid, trackingUrl, metadata, userAgent, debug, useNative);

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
