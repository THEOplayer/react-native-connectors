# THEOplayer React-Native Gemius Connector

A Gemius analytics connector for `@theoplayer/react-native`.

## Installation

```sh
npm install @theoplayer/react-native-analytics-gemius
```

[//]: # (npm install @theoplayer/react-native-analytics-gemius)

## Prerequisites

### Android

The Gemius Android SDK is not publicly available as a Maven module, so additional work is needed to include it as
connector dependency.
It requires downloading the private `GemiusSDK_2.0.8.aar` module into the app's `libs/` folder.
The SDK location needs to be passed to the connector by setting the `gemiusSdkDir` in your app's `gradle.properties` file:

```bash
# Location of the Gemius SDK
gemiusSdkDir=./app/libs/
```

If a different version of the Gemius SDK is used than the default (v2.0.8),
make sure to update the version in the `gradle.properties` file accordingly:

```
THEOplayerGemius_gemiusVersion=2.0.8
```

### iOS & tvOS

#### CocoaPods

With the existing CocoaPods setup, supply the vendor's Apple SDK archive,
containing the iOS and tvOS XCFrameworks.

Create a `Frameworks` folder in your app's `ios` folder, copy the Gemius SDK XCFrameworks in it
and add this `GemiusSDK.podspec` file inside, which describes the structure and metadata of Gemius's CocoaPod:

```ruby
Pod::Spec.new do |spec|
  spec.name         = "GemiusSDK"
  spec.version      = "2.0.6"
  spec.summary      = "The Gemius SDK for iOS"

  spec.homepage     = 'https://github.com/THEOplayer/iOS-Connector'
  spec.license      = { :type => 'MIT', :file => 'LICENSE' }
  spec.author       = "Dolby Laboratories, Inc."
  spec.source       = { :git => 'https://github.com/THEOplayer/iOS-Connector.git', :tag => spec.version.to_s }

  spec.source_files  = "Classes", "Classes/**/*.{h,m}"
  spec.ios.vendored_frameworks = "GemiusSDK.xcframework"
  spec.tvos.vendored_frameworks = "GemiusSDKtvOS.xcframework"
end
```

Finally, include the Gemius SDK as dependency in your app's `Podfile`:

```ruby
  pod 'GemiusSDK', :path => 'Frameworks/'
```

#### Swift Package Manager

SPM is currently supported on iOS for apps using standard React Native. Apps that
use `react-native-tvos`, including all tvOS apps, should keep using CocoaPods
until the fork supports React Native's SPM tooling; see the base player's
[known limitation](https://github.com/THEOplayer/react-native-theoplayer/blob/develop/doc/creating-minimal-app.md#known-limitation-react-native-tvos).

With Swift Package Manager (SPM) on iOS:

1. Complete the base player's
   [SPM setup](https://github.com/THEOplayer/react-native-theoplayer/blob/6b98ad9f1e1ed786861bc73d15fb43c895ec3ba0/doc/creating-minimal-app.md#compatible-player-package).
2. Leave autolinking **enabled** for
   `@theoplayer/react-native-analytics-gemius`.
3. Run `npx --no-install react-native spm sync` from the app root, then build and
   run the Xcode project.

The connector includes its own `Package.swift` and RN package registration.
No `spm scaffold` step, dependency patch, local SDK wrapper, or manual Gemius
Xcode reference is required. Unlike the local CocoaPods
setup above, SPM downloads the official
[Gemius iOS SDK](https://github.com/gemius/gemiussdk-spm-ios) package automatically,
using product `GemiusSDK` at version 2.5.0 or newer, below 3.0.
The JavaScript configuration and reporting API are unchanged.

Use an SPM-enabled base-player archive; older player archives without a manifest
cannot be used with this setup. It requires Swift tools 6.1 or later and
an iOS deployment target of 16 or later, subject to vendor SDK
requirements. The supported layout places the connector at
`<app>/node_modules/@theoplayer/react-native-analytics-gemius`, the base player at
`<app>/node_modules/react-native-theoplayer`, and RN's React package at
`<app>/ios/build/xcframeworks`. Source-checkout links, hoisted dependencies, and
custom native directory layouts need separate validation.

## Usage

### Configuring the connector

Create the connector by providing the `THEOplayer` instance and a `GemiusConfiguration` object.

```tsx
import { useGemius, GemiusConfiguration, ProgramType } from '@theoplayer/react-native-analytics-gemius';

const gemiusConfig: GemiusConfiguration = {
  applicationName: "Demo",
  applicationVersion: "1.0",
  hitCollectorHost: "your_hit_collector_host",
  gemiusId: "your_gemius_id",
  debug: true
}

const App = () => {
  const [gemius, initGemius] = useGemius(gemiusConfig);

  const onPlayerReady = (player: THEOplayer) => {
    // Initialize Gemius connector
    initGemius(player);
  };

  return <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady} />;
};
```

### Passing metadata dynamically

The connector allows passing or updating the current asset's metadata at any time:

```typescript
const onUpdateMetadata = () => {
  gemius.current?.update('programId', {
    name: 'Demo asset',
    duration: 1200,
    programType: ProgramType.VIDEO,
    customKey: 'customValue',
    // ...
  });
}
```
