import { useBitmovin } from '@theoplayer/react-native-analytics-bitmovin';
import { AnalyticsConfig, DefaultMetadata } from '@theoplayer/react-native-analytics-bitmovin';
import Config from 'react-native-config';

export const bitmovinConfig: AnalyticsConfig = {
  licenseKey: Config.BITMOVIN_LICENSE_KEY,
  logLevel: Config.BITMOVIN_LOG_LEVEL as 'DEBUG' | 'ERROR',
};

export const bitmovinDefaultMetadata: DefaultMetadata = {
  cdnProvider: Config.BITMOVIN_CDN_PROVIDER,
  customUserId: Config.BITMOVIN_CUSTOM_USER_ID,
};

export function useBitmovinConnector() {
  const [bitmovin, initBitmovin] = useBitmovin(bitmovinConfig);

  const onProgramChange = () => {
    bitmovin.current?.programChange({
      title: 'New title',
    });
  };

  const onUpdateCustomData = () => {
    bitmovin.current?.updateCustomData({
      customData1: 'updated customData1 value',
      customData2: 'updated customData2 value',
    });
  };

  return { bitmovin, initBitmovin, onProgramChange, onUpdateCustomData };
}

