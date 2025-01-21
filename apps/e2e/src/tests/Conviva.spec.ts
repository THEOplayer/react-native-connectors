import { TestScope } from 'cavy';
import { ConvivaConnector } from '@theoplayer/react-native-analytics-conviva';
import {testConnector} from "./ConnectorUtils";
import {THEOplayer} from "react-native-theoplayer";

export default function (spec: TestScope) {
  spec.describe(`Setup Conviva connector`, function () {
    let connector: ConvivaConnector;
    testConnector(
      spec,
      (player: THEOplayer) => {
        connector = new ConvivaConnector(
          player,
          {},
          {
            customerKey: 'testCustomerKey',
            gatewayUrl: 'testGatewayUrl',
          },
        );
      },
      () => {
        connector.setContentInfo({ customKey: 'customValue' });
        connector.setAdInfo({ customKey: 'customValue' });
        connector.reportPlaybackEvent('customEvent', { customKey: 'customValue' });
        connector.reportPlaybackFailed('customErrorMessage');
        connector.stopAndStartNewSession({ customKey: 'customValue' });
      },
      () => {
        connector.destroy();
      },
    );
  });
}
