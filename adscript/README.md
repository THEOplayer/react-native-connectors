# THEOplayer React-Native AdScript Connector

A [Nielsen AdScript](https://adscript.admosphere.cz/) analytics connector for `@theoplayer/react-native`.

## Installation

```sh
npm install @theoplayer/react-native-analytics-adscript
```

[//]: # (npm install @theoplayer/react-native-analytics-adscript)

## Prerequisites

### Android

On Android, the connector requires downloading the private
[AdScript client library](https://adscript.admosphere.cz/download/AdScriptApiClient_v1.0.10.aar.gz)
module into the app's `libs/` folder. Pass the SDK location to the connector
by setting the `adScriptSdkDir` in your app's `gradle.properties` file:

```bash
# Location of the AdScript SDK
adScriptSdkDir=./app/libs/
```

### iOS & tvOS

On Apple platforms, the connector requires downloading the private `AdScriptAPIClient` archive.

#### CocoaPods

Create a `Frameworks` folder in your app's `ios` folder, copy the Adscript SDK XCFramework in it
and add this `AdScriptApiClient.podspec` file inside, which describes the structure and metadata of Adscript's CocoaPod:

```ruby
Pod::Spec.new do |spec|
  spec.name         = "AdScriptApiClient"
  spec.version      = "1.0.8"
  spec.summary      = "The Adscript Api Client for iOS"

  spec.homepage     = 'https://github.com/THEOplayer/iOS-Connector'
  spec.license      = { :type => 'MIT', :file => 'LICENSE' }
  spec.author       = "Dolby Laboratories, Inc."
  spec.source       = { :git => 'https://github.com/THEOplayer/iOS-Connector.git', :tag => spec.version.to_s }

  spec.source_files  = "Classes", "Classes/**/*.{h,m}"
  spec.ios.vendored_frameworks = "AdScriptApiClient.xcframework"
end
```

Choose the IDFA (Identifier for Advertisers) or no-IDFA SDK using the vendor's
download options, not by renaming a framework. The framework reference must
match the archive's actual filename:

```
spec.ios.vendored_frameworks = "AdScriptApiClient.xcframework"
```

For an archive containing `AdScriptApiClient_withidfa.xcframework`, use:

```
spec.ios.vendored_frameworks = "AdScriptApiClient_withidfa.xcframework"
```

Finally, include the AdScript SDK as dependency in your app's `Podfile`:

```ruby
  pod 'AdScriptApiClient', :path => 'Frameworks/'
```

#### Swift Package Manager

SPM is supported on iOS and tvOS with an app-supplied vendor SDK.

The connector ships its own `Package.swift` and RN package registration, but
does **not** ship or download the private vendor SDK. Instead, the app owns a
small local Swift package that wraps the XCFramework, replacing the local pod
setup described above:

```text
<app>/ios/Frameworks/AdScriptSDK/
  Package.swift
  AdScriptApiClient.xcframework/
```

After installing the connector's npm package:

1. Complete the base player's
   [SPM setup](https://github.com/THEOplayer/react-native-theoplayer/blob/develop/doc/creating-minimal-app.md#getting-started-on-ios-and-tvos).
2. Copy the SDK-package template from the installed connector, running these
   commands from the app root:

   ```sh
   mkdir -p ios/Frameworks/AdScriptSDK
   cp node_modules/@theoplayer/react-native-analytics-adscript/spm/AdScriptSDK/Package.swift \
     ios/Frameworks/AdScriptSDK/Package.swift
   ```

3. Place the vendor's `AdScriptApiClient.xcframework` beside that manifest.
   Keep the private SDK out of public repositories and published npm archives.
4. Leave autolinking **enabled** for
   `@theoplayer/react-native-analytics-adscript`, then run
   `npx --no-install react-native spm sync` and build the Xcode project.

Prepare the local SDK package **before** resolving packages or building.
No local podspec, `spm scaffold` step, or manual AdScript Xcode reference is
needed. The connector references the local
`AdScriptSDK` package automatically and resolves Swift Collections through SPM.

Choose the desired IDFA/no-IDFA variant through the vendor. Filenames alone do
not establish which variant an archive contains. If the supplied XCFramework
has a different name, such as `AdScriptApiClient_withidfa.xcframework`, update
only the binary target's `path` in the app-owned `Package.swift` to match. Keep
the product and target name `AdScriptApiClient`, and use a binary exporting that
module with the required platform/architecture slices. Do not link both
variants together.

The tested 1.4.0 archive uses `AdScriptApiClient.xcframework` and references
Apple's advertising-ID APIs; a separate no-IDFA archive has not been validated.

This setup requires Swift tools 6.1 or later, an SPM-enabled base-player build,
and deployment targets of iOS 16 or tvOS 15.1 or later, subject to the supplied
SDK's own requirements. It assumes the connector is installed at
`<app>/node_modules/@theoplayer/react-native-analytics-adscript`, the player at
`<app>/node_modules/react-native-theoplayer`, RN's React package at
`<app>/ios/build/xcframeworks`, and the vendor wrapper at the path shown above.
Source-checkout links, hoisted dependencies, and custom native directory layouts
need separate validation.

## Usage

### Configuring the connector

Create the connector by providing the `THEOplayer` instance, an `implementationId`, and a `metadata` object.

```tsx
import { useAdScript, AdScriptMetadata } from '@theoplayer/react-native-analytics-adscript';

const adscriptImplementationId = "myImplementionId";
const adscriptContentMetadata: AdScriptMetadata = {
  assetId: "abc98731568435405",
  type: "content"
};

const App = () => {
  const [adscript, initAdScript] = useAdScript(adscriptImplementationId, adscriptContentMetadata, true /*debug*/);

  const onPlayerReady = (player: THEOplayer) => {
    // Initialize AdScript connector
    initAdScript(player);
  };

  return <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady} />;
};
```

### Passing metadata dynamically

The connector allows passing or updating the current asset's metadata at any time:

```typescript
const onUpdateMetadata = () => {
  adscript.current?.updateMetadata({
    assetId: 'updatedId',
    type: "content",
    // ...
  });
}
```

### Passing additional information

Additional information about the logged-in user from the client database:

```typescript
const onUpdateUser = () => {
  adscript.current?.updateUser([
    "866d3a3c-aa87-4fe7-9066-8286641edd17",     // client-side user identifier (customerId)
    "cf895a00-a987-4501-ac00-6adb57014129",     // client-side user device identifier (Android_ID)
    "9530321a-d3d0-4bda-8704-1eb94a5940c3",     // client-side profile identifier of the logged-in user (profileId)
    "jsg75682-k276t-kw82-k8d5-8926sh6528j2",    // optional - SW device identifier for a situation where there are multiple device IDs in the client DB (typically a) HW ID - fill in i2, b) SW ID - fill in i4).
    "ef3c6dc72a26912f07f0e733d51b46c771d807bf"  // fingerprint of the user's email address
  ]);
}
```
