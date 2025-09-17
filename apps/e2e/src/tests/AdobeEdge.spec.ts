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
        connector = new AdobeConnector(player, 'https://edge.adobedc.net/ee-pre-prd/va/v1', 'dataStreamId', undefined, true);
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
