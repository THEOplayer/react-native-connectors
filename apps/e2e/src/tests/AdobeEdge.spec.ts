import { TestScope } from 'cavy';
import { AdobeConnector } from '@theoplayer/react-native-analytics-adobe-edge';
import { testConnector } from './ConnectorUtils';
import { THEOplayer } from 'react-native-theoplayer';

export default function (spec: TestScope) {
  spec.describe(`Setup Adobe Edge connector`, function () {
    let connector: AdobeConnector;
    testConnector(
      spec,
      (player: THEOplayer) => {
        connector = new AdobeConnector(player, {
          web: {
            datastreamId: 'abcde123-abcd-1234-abcd-abcde1234567',
            orgId: 'ADB3LETTERSANDNUMBERS@AdobeOrg',
            edgeBasePath: 'ee',
            debugEnabled: true,
          },
          mobile: {
            appId: 'launch-1234567890abcdef1234567890abcdef12',
            debugEnabled: true,
          },
        });
      },
      () => {
        connector.stopAndStartNewSession([
          { name: 'title', value: 'test' },
          { name: 'custom1', value: 'value1' },
        ]);
      },
      () => {
        connector.destroy();
      },
    );
  });
}
