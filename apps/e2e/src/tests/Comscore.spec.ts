import {TestScope} from 'cavy';
import {
  ComscoreConfiguration,
  ComscoreConnector,
  ComscoreMetadata,
  ComscoreUsagePropertiesAutoUpdateMode,
  ComscoreUserConsent
} from '@theoplayer/react-native-analytics-comscore';
import {ComscoreMediaType} from '@theoplayer/react-native-analytics-comscore/src/api/ComscoreMetadata';
import {testConnector} from "./ConnectorUtils";
import {THEOplayer} from "react-native-theoplayer";

export default function (spec: TestScope) {
  spec.describe(`Setup Comscore connector`, function () {
    let connector: ComscoreConnector;
    const metadata: ComscoreMetadata = {
      mediaType: ComscoreMediaType.live,
      uniqueId: 'uniqueId',
      length: 0,
      stationTitle: 'stationTitle',
      programTitle: 'programTitle',
      episodeTitle: 'episodeTitle',
      genreName: 'genreName',
      classifyAsAudioStream: false,
    };
    const config: ComscoreConfiguration = {
      publisherId: 'publisherId',
      applicationName: 'applicationName',
      userConsent: ComscoreUserConsent.granted,
      usagePropertiesAutoUpdateMode: ComscoreUsagePropertiesAutoUpdateMode.foregroundAndBackground,
      debug: true
    };

    testConnector(
      spec,
      (player: THEOplayer) => {
        connector = new ComscoreConnector(player, metadata, config);
      },
      () => {
        connector.update(metadata);
      },
      () => {
        connector.destroy();
      },
    );
  });
}
