# THEOplayer React-Native Gemius Connector

A Gemius analytics connector for `@theoplayer/react-native`.

## Installation

```sh
npm install @theoplayer/react-native-analytics-gemius
```

[//]: # (npm install @theoplayer/react-native-analytics-gemius)

## Prerequisites

### Android

On Android, the connector requires downloading the private `GemiusSDK_2.0.8.aar`
module into the app's `libs/` folder. Pass the SDK location to the connector
by setting the `gemiusSdkDir` in your app's `gradle.properties` file:

```bash
# Location of the Gemius SDK
gemiusSdkDir=./app/libs/
```

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
    // ...
  });
}
```
