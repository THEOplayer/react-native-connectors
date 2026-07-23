# THEOplayer React Native NPAW Connector

An [NPAW](https://npaw.com/) (formerly YOUBORA) analytics connector for `@theoplayer/react-native`.

This connector is JavaScript-only and works across iOS, Android and web through the unified
`react-native-theoplayer` player, using only the `npaw-plugin-react-native` plugin — no native
iOS/Android modules are required.

## Installation

```sh
npm install @theoplayer/react-native-analytics-npaw
```

## Usage

### Configuring the connector

Create the connector with the `useNpaw` hook, passing a config object and initializing it once the
`THEOplayer` instance is ready:

```tsx
import { LogLevel, useNpaw } from '@theoplayer/react-native-analytics-npaw';

const App = () => {
  const [npaw, initNpaw] = useNpaw({
    accountCode: 'your-account-code',
    analytics: {
      'content.title': 'Big Buck Bunny',
      'content.isLive': false,
      // Free-form custom metadata shown in the NPAW "Metadata" panel:
      'content.metadata': { genre: 'animation' },
    },
    // Optional NpawPlugin options (host, sessionRecovery, ...):
    plugin: { sessionRecovery: 'auto' },
    logLevel: LogLevel.DEBUG,
  });

  const onPlayerReady = (player: THEOplayer) => {
    initNpaw(player);
  };

  return <THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady} />;
};
```

Alternatively, construct the `NpawConnector` class directly:

```ts
import { NpawConnector } from '@theoplayer/react-native-analytics-npaw';

const connector = new NpawConnector(player, { accountCode: 'your-account-code' });
```

### Configuration

| Field         | Description                                                                        |
|---------------|------------------------------------------------------------------------------------|
| `accountCode` | Your NPAW account code. **Required.**                                              |
| `analytics`   | Per-video analytics options, e.g. `content.title`, `content.isLive`, `content.metadata`, `user.name`, ... |
| `plugin`      | `NpawPlugin` options such as `host`, `sessionRecovery` and `balancerAnalyticsEnabled`. |
| `logLevel`    | Initial `LogLevel`.                                                                |

### What is tracked automatically

Once initialized, the connector registers a video adapter (and an ads adapter) against the player
and reports playback automatically:

- Playback events (start, join, pause/resume, buffering, seeking, end and errors) mapped from the
  unified `PlayerEventType` events.
- Playhead, duration and live/VOD state, resource, rendition and bitrate.
- The active subtitle/caption track language (`getSubtitles`) and audio language (`getVideoLanguage`).
- Ads: ad breaks, ad start/join/stop, quartiles, skip, click and errors, with ad position
  (`pre`/`mid`/`post`), duration and skippability.

### Updating options at runtime

```ts
// Update options for the current video (e.g. late-arriving metadata):
npaw.current?.setVideoOptions({ 'content.title': 'New Title' });

// Update global analytics options:
npaw.current?.setAnalyticsOptions({ 'user.name': 'viewer-1' });

// Change the log level:
npaw.current?.setLogLevel(LogLevel.SILENT);

// Stop analytics and close all sessions:
npaw.current?.destroy();
```

See the [NPAW integration documentation](https://documentation.npaw.com/integration-docs/docs/)
for the full set of plugin and analytics options.
