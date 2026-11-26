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
npm install react-native-device-info@^14.0.4 @theoplayer/react-native-analytics-adobe-edge
```

[//]: # (npm install @theoplayer/react-native-analytics-adobe)

### Apple Native Dependencies

With CocoaPods, keep normal autolinking and run `pod install` after installing
the npm packages.

SPM is currently supported on iOS for apps using standard React Native. Apps that
use `react-native-tvos`, including all tvOS apps, should keep using CocoaPods
until the fork supports React Native's SPM tooling; see the base player's
[known limitation](https://github.com/THEOplayer/react-native-theoplayer/blob/develop/doc/creating-minimal-app.md#known-limitation-react-native-tvos).

With Swift Package Manager (SPM) on iOS:

1. Complete the base player's
   [SPM setup](https://github.com/THEOplayer/react-native-theoplayer/blob/6b98ad9f1e1ed786861bc73d15fb43c895ec3ba0/doc/creating-minimal-app.md#compatible-player-package).
2. Leave autolinking **enabled** for this connector and its
   `react-native-device-info` peer dependency.
3. Ensure the app's `react-native-device-info` dependency supports SPM; see the note below.
4. Run `npx --no-install react-native spm sync` from the app root, then build and
   run the Xcode project.

The connector supplies its own `Package.swift` and RN package registration.
No `spm scaffold` step or manual Adobe Edge Xcode reference is required.
Its manifest selects Adobe's 5.x `AEPCore`, `AEPServices`,
`AEPEdge`, `AEPEdgeIdentity`, and `AEPEdgeMedia` products, matching the existing
CocoaPods SDK major version.

This setup requires a base player release with SPM support, Swift tools 6.1 or
later, and deployment targets of iOS 16 or tvOS 15.1 or later. It assumes normal
npm folders at `<app>/node_modules/@theoplayer/react-native-analytics-adobe-edge`
and `<app>/node_modules/react-native-theoplayer`, with RN's React package at
`<app>/ios/build/xcframeworks`. Source-checkout links, hoisted dependencies, and
custom native directory layouts need separate validation.

#### Device-Info SPM Setup

The app must provide an SPM-compatible setup for its `react-native-device-info`
peer dependency. As an optional aid, this package includes a
[packaging-only patch for 14.1.1](patches/react-native-device-info+14.1.1.patch),
which can be applied with `patch-package`. The patch is specific to that version;
other versions may need a different setup. If the app already uses this patch
for the Adobe connector, reuse it. CocoaPods users do not need it.

## Usage

### Configuring the connector

Create the connector by providing the `THEOplayer` instance and a configuration object with separate parts for
Web and mobile platforms.

```tsx
import {useAdobe} from '@theoplayer/react-native-analytics-adobe-edge';

const config = {
  web: {
    datastreamId: 'abcde123-abcd-1234-abcd-abcde1234567',
    orgId: 'ADB3LETTERSANDNUMBERS@AdobeOrg',
    edgeBasePath: 'ee',
    edgeDomain: 'my.domain.com',
    debugEnabled: true,
  },
  mobile: {
    environmentId: 'abcdef123456/abcdef123456/launch-1234567890abcdef1234567890abcdef12',
    debugEnabled: true,
  },
}

/**
 * An optional custom identity map to associate the media session with user identities.
 */
const customIdentityMap = {
  EMAIL: [
    {
      id: 'user@example.com',
      authenticatedState: 'authenticated',
      primary: false,
    },
  ],
}

const App = () => {
  const [adobe, initAdobe] = useAdobe(config, /* optional */ customIdentityMap);

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
import {AdobeCustomMetadataDetails} from "@theoplayer/react-native-analytics-adobe-edge";

const onUpdateMetadata = () => {
  const metadata: AdobeCustomMetadataDetails[] = [
    {name: 'title', value: 'test'},
    {name: 'custom1', value: 'value1'},
  ]
  adobe.current?.updateMetadata(metadata);
};
```

### Setting an custom identity map

Besides passing a custom identity map during initialization, you can also set or update the identity map at any time:

```typescript
import {AdobeIdentityMap} from "@theoplayer/react-native-analytics-adobe-edge";

const onUpdateIdentityMap = () => {
  const identityMap: AdobeIdentityMap = {
    CUSTOMER_ID: [
      {
        id: 'customer-12345',
        authenticatedState: 'authenticated',
        primary: true,
      },
    ],
  };
  adobe.current?.setIdentityMap(identityMap);
};
```

### Starting a new session during a live stream

By default, the connector will start a new session when a new asset is loaded. However, during live streams, you might
want to start a new session
periodically when a new program starts. You can do this by calling `stopAndStartNewSession` with the new program's
metadata:

```typescript
const onNewProgram = () => {
  adobe.current?.stopAndStartNewSession({
    'friendlyName': 'Evening News',
  });
};
```
