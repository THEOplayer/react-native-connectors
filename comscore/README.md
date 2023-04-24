# THEOplayer React-Native Comscore Connector

A Comscore analytics connector for `@theoplayer/react-native`.

## Installation

```sh
npm install https://theoplayer-cdn.s3.eu-west-1.amazonaws.com/react-native-theoplayer/theoplayer-react-native-analytics-comscore-0.1.0.tgz
```

[//]: # 'npm install @theoplayer/react-native-analytics-comscore'

## Usage

### Configuring the connector

Create the connector by providing the `THEOplayer` instance, a ComscoreConfiguration (which contains your publisher id) and the ComscoreMetadata of the first source you will set to the player (you can change it dynamically throughout the entire lifecycle of the connector):

```jsx
import { useComscore } from '@theoplayer/react-native-analytics-comscore';

export const comscoreMetadata: ComscoreMetadata = {
  mediaType: ComscoreMediaType.longFormOnDemand,
  uniqueId: "testuniqueId",
  length: 634.566,
  stationTitle: "THEOTV",
  programTitle: "Big Buck Bunny",
  episodeTitle: "Intro",
  genreName: "Animation",
  classifyAsAudioStream: false,
  customLabels: {
    "testcustomlabel": "testcustomvalue"
  }
};

const comscoreConfig: ComscoreConfiguration = {
    publisherId: "<your publisher id (aka c2 id)",
    applicationName: "<your app name>",
    userConsent: ComscoreUserConsent.granted,
    debug: true,
  };

const App = () => {
  const [comscore, initComscore] = useComscore(COMSCORE_METADATA, comscoreConfig);

  const onPlayerReady = (player: THEOplayer) => {
    // Initialize Comscore connector
    initComscore(player);
  }

  return (<THEOplayerView config={playerConfig} onPlayerReady={onPlayerReady}/>);
}
```

### Passing metadata dynamically

The connector allows passing or updating the current asset's metadata at any time:

```typescript
const onUpdateMetadata = () => {
  comscore.current.update({
      mediaType: ComscoreMediaType.longFormOnDemand,
      uniqueId: 'testuniqueId',
      length: 634.566,
      stationTitle: 'THEOTV',
      programTitle: 'Big Buck Bunny',
      episodeTitle: 'Intro',
      genreName: 'Animation',
      classifyAsAudioStream: false,
      customLabels: {
          testcustomlabel: 'testcustomvalue'
      }
  });
};
```

### ComscoreMetadata fields

Based on the `ComscoreMetadata` type, you can tell which fields are mandatory and which aren't. Note that this is purely for the integration to work correctly. Depending on the Comscore solution you are using, different fields are required/optional. The mandatory fields in the `ComscoreMetadata` type are the ones that are mandatory for all three Comscore solutions:

-   Video Metrix (V)
-   Cross Platform Product Suite (X)
-   Cross Media Audience Measurement (C)

| Property                           | Required | Optional |
| ---------------------------------- | :------: | :------: |
| `mediaType`                        |   All    |          |
| `uniqueId`                         |   All    |          |
| `length`                           |   All    |          |
| `c3?`                              |    V     |          |
| `c4?`                              |    V     |          |
| `c6?`                              |    V     |          |
| `stationTitle`                     |   All    |          |
| `stationCode?`                     |          |   All    |
| `networkAffiliate?`                |          |   All    |
| `publisherName?`                   |   X C    |    V     |
| `programTitle`                     |   All    |          |
| `programId?`                       |          |   V C    |
| `episodeTitle`                     |   All    |          |
| `episodeId?`                       |          |   X C    |
| `episodeSeasonNumber?`             |   X C    |          |
| `episodeNumber?`                   |   X C    |          |
| `genreName`                        |   All    |          |
| `genreId?`                         |          |   All    |
| `carryTvAdvertisementLoad?`        |    X     |          |
| `classifyAsCompleteEpisode?`       |    X     |          |
| `dateOfProduction?`                |          |    C     |
| `timeOfProduction?`                |          |    C     |
| `dateOfTvAiring?`                  |   X C    |          |
| `timeOfTvAiring?`                  |          |   X C    |
| `dateOfDigitalAiring?`             |   X C    |          |
| `timeOfDigitalAiring?`             |          |   X C    |
| `feedType?`                        |    X     |          |
| `classifyAsAudioStream`            |    Al    |          |
| `deliveryMode?`                    |          |   All    |
| `deliverySubscriptionType?`        |          |   All    |
| `deliveryComposition?`             |          |   All    |
| `deliveryAdvertisementCapability?` |          |   All    |
| `mediaFormat?`                     |          |   All    |
| `distributionModel?`               |          |   All    |
| `playlistTitle?`                   |          |    C     |
| `totalSegments?`                   |          |   V C    |
| `clipUrl?`                         |          |   V C    |
| `videoDimension?`                  |          |    C     |
| `customLabels?`                    |          |   All    |
