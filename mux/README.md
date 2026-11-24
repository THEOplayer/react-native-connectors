# THEOplayer React-Native Mux Connector

A Mux analytics connector for `@theoplayer/react-native`, supporting Web, iOS, Android, and tvOS through SPM.

## Installation

```sh
npm install @theoplayer/react-native-analytics-mux
```

[//]: # (npm install @theoplayer/react-native-analytics-mux)

### Apple Native Dependencies

With CocoaPods on iOS, keep normal autolinking and run `pod install` after
installing the npm package. The connector and vendor pod declarations remain
iOS-only; use SPM for tvOS.

With Swift Package Manager (SPM) on iOS and tvOS:

1. Complete the base player's
   [SPM setup](https://github.com/THEOplayer/react-native-theoplayer/blob/main/doc/creating-minimal-app.md#getting-started-on-ios-and-tvos).
2. Leave autolinking **enabled** for `@theoplayer/react-native-analytics-mux`.
3. Run `npx --no-install react-native spm sync` from the app root, then build and
   run the Xcode project.

The connector includes its own `Package.swift` and RN package registration.
No `spm scaffold` step, dependency patch, or manual Mux Xcode reference is
required. It shares the installed base player and resolves the vendor
`MuxStatsTHEOplayer` (0.15.0 or newer, below 1.0) and `MuxCore` (5.4.0 or newer,
below 6.0) products.

Use an SPM-enabled base-player archive; older player archives without a manifest
cannot be used with this setup. It requires Swift tools 6.1 or later and
deployment targets of iOS 16 or tvOS 15.1 or later. The supported layout places
the connector at `<app>/node_modules/@theoplayer/react-native-analytics-mux`,
the base player at `<app>/node_modules/react-native-theoplayer`, and RN's React
package at `<app>/ios/build/xcframeworks`. Source-checkout links, hoisted
dependencies, and custom native directory layouts need separate validation.

## Usage

### Configuring the connector

Create the connector by providing the `THEOplayer` instance, some initial metadata and a config
object:

```jsx
import { useMux } from '@theoplayer/react-native-analytics-mux';

const muxOptions = {
  debug: true,
  data: {
    env_key: 'ENV_KEY', // required
    // Site Metadata
    viewer_user_id: '12345',
    experiment_name: 'player_test_A',
    sub_property_id: 'cus-1',
    // Player Metadata
    player_name: 'My Main Player',
    player_version: '1.0.0',
    player_init_time: 1451606400000,
    // Video Metadata
    video_id: 'abcd123',
    video_title: 'My Great Video',
    video_series: 'Weekly Great Videos',
    video_duration: 12000, // in milliseconds
    video_stream_type: 'on-demand', // 'live' or 'on-demand'
    video_cdn: 'Akamai'
  }
};

const App = () => {
  const [mux, initMux] = useMux();

  const onPlayerReady = (player: THEOplayer) => {
    // Initialize connector
    initMux(player, muxOptions);
  }

  return (<THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}/>);
}
```

### Change program within a stream

In some cases, you may have the program change within a stream, and you may want to track
each program as a view on its own.
An example of this is a live stream that streams multiple programs back to back.

For this purpose, the `changeProgram` method can signal the start of a new program and pass
updated metadata to the connector on Android and Web. `changeProgram` is not supported
on iOS or tvOS; on those platforms it does not start a new view or update metadata.

```typescript
mux.current?.changeProgram({
  video_title: 'New program',
  video_duration: 160000
});
```
