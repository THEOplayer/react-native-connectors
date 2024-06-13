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

    // Set source with ssai integration 'yospace', and optional session properties.
    player.source = {
      sources: [
        {
          src: 'https://csm-e-sdk-validation.bln1.yospace.com/csm/extlive/yospace02,hlssample42.m3u8?yo.br=true&yo.av=4',
          ssai: {
            integration: 'yospace',

            // Optional, the default is 'live'.
            streamType: 'live',

            // Optional session properties
            //
            // @see YospaceSessionProperties.ts for available properties.
            sessionProperties: {
              prefetchResources: true
            }
          }
        }
      ]
    }
  }

  return (<THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}/>);
}
```
