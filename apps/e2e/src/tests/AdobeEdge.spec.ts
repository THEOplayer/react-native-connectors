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
            environmentId: 'abcdef012345/abcdef012345/launch-abcdef012345-development',
            debugEnabled: true,
          },
        });
      },
      () => {
        connector.stopAndStartNewSession({
          friendlyName: 'New Session',
        });
        connector.updateMetadata({
          custom1: 'value1',
          custom2: 'value2',
        });
        connector.setCustomIdentityMap({
          EMAIL: [
            {
              id: 'user@example.com',
              authenticatedState: 'authenticated',
              primary: false,
            },
          ],
        });
      },
      () => {
        connector.destroy();
      },
    );
  });
}
