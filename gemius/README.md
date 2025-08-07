# THEOplayer React-Native Gemius Connector

A Gemius analytics connector for `@theoplayer/react-native`.

## Installation

```sh
npm install @theoplayer/react-native-analytics-gemius
```

[//]: # (npm install @theoplayer/react-native-analytics-gemius)

## Usage

### Configuring the connector

Create the connector by providing the `THEOplayer` instance and a `GemiusConfiguration` object.

```tsx
import { useGemius } from '@theoplayer/react-native-analytics-gemius';

const gemiusConfig = {
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
