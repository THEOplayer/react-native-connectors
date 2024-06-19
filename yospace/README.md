# THEOplayer React-Native Yospace Connector

A Yospace connector for `@theoplayer/react-native`.
The connector only supports Android platforms for now.

## Installation

```sh
npm install @theoplayer/react-native-yospace
```

The connector uses the **private Yospace SDK**, for which credentials need to be configured.

### Android

On Android, configure the Maven repository credentials either setting project properties, for example in
the `gradle.properties` file:

```
YOSPACE_USERNAME=myUserName
YOSPACE_PASSWORD=myPassword
```

or, alternatively, by setting both `YOSPACE_USERNAME` and `YOSPACE_PASSWORD` as environment variables on your build
system. Make sure not to expose them!

[//]: # (npm install @theoplayer/react-native-yospace)

## Usage

### Configuring the connector

Create the connector by providing the `THEOplayer` instance, some initial metadata and a config
object:

```tsx
import { useYospace } from '@theoplayer/react-native-yospace';

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
          type: 'application/x-mpegurl',
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
