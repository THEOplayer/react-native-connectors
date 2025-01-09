import {TestScope} from 'cavy';
import {AdobeConnector} from '@theoplayer/react-native-analytics-adobe';
import {testConnector} from "./ConnectorUtils";
import {THEOplayer} from "react-native-theoplayer";

export default function (spec: TestScope) {
  spec.describe(`Setup Adobe connector`, function () {
    let connector: AdobeConnector;
    testConnector(
      spec,
      (player: THEOplayer) => {
        connector = new AdobeConnector(player, 'uri', 'ecid', 'sid', 'trackingUrl');
      },
      () => {
        connector.stopAndStartNewSession({
          qoeData: {customKey: 'customValue'},
          customMetadata: {customKey: 'customValue'},
        });
      },
      () => {
        connector.destroy();
      },
    );
  });
}
