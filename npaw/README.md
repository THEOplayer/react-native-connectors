# THEOplayer React Native NPAW Connector

An NPAW analytics connector for `@theoplayer/react-native` that works across iOS, Android, and web.

## Installation

```sh
npm install @theoplayer/react-native-analytics-npaw
```

## Usage

```tsx
import { LogLevel, useNpaw } from '@theoplayer/react-native-analytics-npaw';

const App = () => {
  const [_connector, initialize] = useNpaw({
    accountCode: 'your-account-code',
    analytics: {
      'content.title': 'My Title',
      'content.isLive': true,
    },
    logLevel: LogLevel.DEBUG,
  });

  const onPlayerReady = (player: THEOplayer) => {
    initialize(player);
  };

  return <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady} />;
};
```

See the [NPAW React Native Video.js integration documentation](https://documentation.npaw.com/integration-docs/docs/react-native-video-js)
for available plugin and analytics options.
