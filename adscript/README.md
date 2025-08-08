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
