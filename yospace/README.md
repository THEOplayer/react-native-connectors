# THEOplayer React-Native Yospace Connector

A Yospace connector for `@theoplayer/react-native`.

## Installation

```sh
npm install @theoplayer/react-native-analytics-yospace
```

[//]: # (npm install @theoplayer/react-native-analytics-yospace)

## Usage

### Configuring the connector

Create the connector by providing the `THEOplayer` instance, some initial metadata and a config
object:

```tsx
import { useYospace } from '@theoplayer/react-native-analytics-yospace';

const App = () => {
  const [yospace, initYospace] = useYospace();

  const onPlayerReady = (player: THEOplayer) => {
    // Initialize connector
    useYospace(player);
  }

  return (<THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}/>);
}
```
