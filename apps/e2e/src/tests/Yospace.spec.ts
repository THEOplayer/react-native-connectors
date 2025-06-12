import { TestScope } from 'cavy';
import { YospaceConnector } from '@theoplayer/react-native-yospace';
import { testConnector } from './ConnectorUtils';
import { THEOplayer } from 'react-native-theoplayer';

export default function (spec: TestScope) {
  spec.describe(`Setup Yospace connector`, function () {
    let connector: YospaceConnector;
    testConnector(
      spec,
      (player: THEOplayer) => {
        connector = new YospaceConnector(player);
      },
      () => {},
      () => {
        connector.destroy();
      },
    );
  });
}
