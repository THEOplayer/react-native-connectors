import { TestScope } from 'cavy';
import { BitmovinConnector } from '@theoplayer/react-native-analytics-bitmovin';
import { testConnector } from './ConnectorUtils';
import { THEOplayer } from 'react-native-theoplayer';

export default function (spec: TestScope) {
  spec.describe(`Setup Bitmovin connector`, function () {
    let connector: BitmovinConnector;
    testConnector(
      spec,
      (player: THEOplayer) => {
        connector = new BitmovinConnector(
          player,
          {
            licenseKey: 'license-key-here',
            logLevel: 'DEBUG',
          },
          {
            cdnProvider: 'akamai',
            customUserId: 'custom-user-id-1234',
            customData: {
              customData1: 'value1',
              customData2: 'value2',
            },
          },
        );
        connector.updateSourceMetadata({
          title: 'Sample Video',
          videoId: 'video-1234',
          cdnProvider: 'akamai',
          path: '/home/videos/sample-video',
          isLive: false,
          customData: {
            customData10: 'value10',
            customData11: 'value11',
          },
        });
      },
      () => {
        connector.updateCustomData({
          customData0: 'newValue0',
          customData1: 'newValue1',
        });
        connector.programChange({
          title: 'New Live Program',
          videoId: 'live-program-5678',
          customData: {
            customData10: 'newValue10',
          },
        });
      },
      () => {
        connector.destroy();
      },
    );
  });
}
