import {TestScope} from 'cavy';
import {NielsenConnector} from '@theoplayer/react-native-analytics-nielsen';
import {testConnector} from "./ConnectorUtils";
import {THEOplayer} from "react-native-theoplayer";

export default function (spec: TestScope) {
  spec.describe(`Setup Nielsen connector`, function () {
    let connector: NielsenConnector;
    testConnector(
      spec,
      (player: THEOplayer) => {
        connector = new NielsenConnector(player, 'testApiString', 'testInstanceName', {});
      },
      () => {
        connector.updateMetadata({customKey: 'customValue'});
      },
      () => {
        connector.destroy();
      },
    );
  });
}
