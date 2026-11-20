# THEOplayer React-Native Conviva Connector

A Conviva analytics connector for `@theoplayer/react-native`.

## Installation

```sh
npm install @theoplayer/react-native-analytics-conviva
```

[//]: # (npm install @theoplayer/react-native-analytics-conviva)

### Apple Native Dependencies

With CocoaPods, keep the normal autolinking setup and run `pod install` after
installing the npm package.

With SPM, using React Native 0.88's experimental integration tooling:

1. Complete the base player's SPM setup: disable iOS autolinking for
   `react-native-theoplayer`, add its installed npm folder to the app target in
   Xcode, and select the player's desired traits.
2. Leave autolinking **enabled** for `@theoplayer/react-native-analytics-conviva`.
3. Run `npx --no-install react-native spm sync` from the app root, then build and
   run the Xcode project.

The connector supplies its own `Package.swift` and RN package registration.
Do not add it manually in Xcode or select a Conviva trait on the base player.
SwiftPM selects the native Conviva connector and Conviva SDK automatically and
shares compatible player and connector package versions with the base player.
Other analytics connector products are not selected by this package.

This setup requires a base player release with SPM support, Swift tools 6.1 or
later, and deployment targets of iOS 16 or tvOS 15.1 or later. It assumes normal
npm folders at `<app>/node_modules/@theoplayer/react-native-analytics-conviva`
and `<app>/node_modules/react-native-theoplayer`, with RN's React package at
`<app>/ios/build/xcframeworks`. Source-checkout links, hoisted dependencies, and
custom native directory layouts need separate validation.

## Usage

### Configuring the connector

Create the connector by providing the `THEOplayer` instance, some initial metadata and a config
object:

```jsx
import { useConviva } from '@theoplayer/react-native-analytics-conviva';

const convivaMetadata: ConvivaMetadata = {
  ['Conviva.applicationName']: 'THEOplayer',
  ['Conviva.viewerId']: 'your_viewer_id'
};

const convivaConfig: ConvivaConfiguration = {
  customerKey: 'your_customer_key',
  debug: true,
  gatewayUrl: 'https://[account]-test.ts-testonly.conviva.com'
};

const App = () => {
  const [conviva, initConviva] = useConviva(convivaMetadata, convivaConfig);

  const onPlayerReady = (player: THEOplayer) => {
    // Initialize connector
    initConviva(player);
  }

  return (<THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}/>);
}
```

The `convivaMetada` object contains key-value pairs that are passed directly to the Conviva SDK.
Most media related properties, such as its streamURL, duration or whether it is a live or vod
stream, are passed by the connector itself.
Any metadata related properties can be passed through the open key-value map:

| Key                   | Value                           |
|-----------------------|---------------------------------|
| `'Conviva.assetName'` | Asset name of the next program. |
| `'customTag'`         | Any custom value.               |

### Passing metadata dynamically

The connector allows passing or updating the current asset's metadata at any time:

```typescript
const onUpdateMetadata = () => {
  const metadata: ConvivaMetadata = {
    ['customTag1']: "customValue1",
    ['customTag2']: "customValue2",
  };
  conviva.current?.setContentInfo(metadata);
};
```
