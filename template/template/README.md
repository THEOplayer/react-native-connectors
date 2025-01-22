# THEOplayer React-Native Connector

A connector for `@theoplayer/react-native`.

## Installation

```sh
npm install ReactNativeTHEOplayerConnector
```

## Usage

### Configuring the connector

Create the connector by providing the `THEOplayer` instance and a config
object:

```jsx
import { useReactNativeTHEOplayerConnector } from 'ReactNativeTHEOplayerConnector';

const config: ReactNativeTHEOplayerConnectorConfiguration = {
  debug: true,
};

const App = () => {
  const [connector, initConnector] = useReactNativeTHEOplayerConnector(config);

  const onPlayerReady = (player: THEOplayer) => {
    // Initialize connector
      initConnector(player);
  }

  return (<THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}/>);
}
```
