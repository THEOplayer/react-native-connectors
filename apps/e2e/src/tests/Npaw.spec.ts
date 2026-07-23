import { TestScope } from 'cavy';
import { LogLevel, NpawConnector } from '@theoplayer/react-native-analytics-npaw';
import { THEOplayer } from 'react-native-theoplayer';
import { testConnector } from './ConnectorUtils';

export default function (spec: TestScope) {
  spec.describe(`Setup NPAW connector`, function () {
    let connector: NpawConnector;
    testConnector(
      spec,
      (player: THEOplayer) => {
        connector = new NpawConnector(player, { accountCode: 'testAccountCode' });
      },
      () => {
        connector.setLogLevel(LogLevel.DEBUG);
      },
      () => {
        connector.destroy();
      },
    );
  });
}
