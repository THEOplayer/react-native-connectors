# THEOplayer React-Native Adscript Connector

A [Nielsen Adscript](https://adscript.admosphere.cz/) analytics connector for `@theoplayer/react-native`.

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
by setting the `adscriptSdkDir` in your app's `gradle.properties` file:

```bash
# Location of the adscript SDK
adscriptSdkDir=./app/libs/
```

## Usage

### Configuring the connector

Create the connector by providing the `THEOplayer` instance and a `GemiusConfiguration` object.

```tsx
import { useAdscript, AdscriptMetadata } from '@theoplayer/react-native-analytics-adscript';

const adscriptImplementationId = "myImplementionId";
const adscriptContentMetadata: AdscriptMetadata = {
  assetId: "abc98731568435405",
  type: "content"
};

const App = () => {
  const [adscript, initAdscript] = useAdscript(adscriptImplementationId, adscriptContentMetadata, true /*debug*/);

  const onPlayerReady = (player: THEOplayer) => {
    // Initialize Adscript connector
    initAdscript(player);
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
