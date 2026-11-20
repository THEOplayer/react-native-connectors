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

With SPM, using React Native 0.88's experimental integration tooling:

1. Complete the base player's SPM setup: disable iOS autolinking for
   `react-native-theoplayer`, add its installed npm folder to the app target in
   Xcode, and select the player's desired traits.
2. Leave autolinking **enabled** for this connector and its
   `react-native-device-info` peer dependency.
3. Apply the temporary device-info compatibility patch described below.
4. Run `npx --no-install react-native spm sync` from the app root, then build and
   run the Xcode project.

The Adobe connector itself supplies its own `Package.swift` and RN package
registration; no `spm scaffold` step is needed for this connector.
Do not add it manually in Xcode or select an Adobe trait on the base player.
Its native Media Collection connector is implemented in this package; no
separate Adobe vendor SDK or `iOS-Connector` product is required.

The separate `react-native-device-info` peer does not ship built-in SPM support
as of version 15.0.2. The compatibility patch below supplies the missing
packaging for version 14.1.1. Applying the shipped patch replaces the need to
run `spm scaffold` yourself.

This setup requires a base player release with SPM support, Swift tools 6.1 or
later, and deployment targets of iOS 16 or tvOS 15.1 or later. It assumes normal
npm folders at `<app>/node_modules/@theoplayer/react-native-analytics-adobe`
and `<app>/node_modules/react-native-theoplayer`, with RN's React package at
`<app>/ios/build/xcframeworks`. Source-checkout links, hoisted dependencies, and
custom native directory layouts need separate validation.

#### Required Temporary Device-Info SPM Patch

The supplied patch is validated specifically for **14.1.1**, which satisfies
this connector's declared 14.x peer dependency. Pin the peer to that version
and apply the compatibility patch shipped with this connector; do not apply
this version-specific patch to 15.x. It adds only SPM packaging, including the
peer's existing privacy manifest; it does not change device-info's native
implementation.

From the app root, after installing this connector:

```sh
npm install --save-exact react-native-device-info@14.1.1
npm install --save-dev patch-package
mkdir -p patches
cp node_modules/@theoplayer/react-native-analytics-adobe/patches/react-native-device-info+14.1.1.patch patches/
npx patch-package --error-on-fail
```

Add `"postinstall": "patch-package --error-on-fail"` to the app's npm scripts,
or append that command to an existing postinstall script. Commit the app's
patch, package manifest, and lockfile so a fresh install reapplies it. Then run
RN SPM sync as described above.

This is an additional setup requirement for Adobe, unlike connectors whose
dependencies already provide SPM support. Revisit the patch and version pin
when a compatible upstream device-info release ships SPM support. Do not
disable device-info autolinking to bypass the requirement. CocoaPods users
do not need this patch.

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
