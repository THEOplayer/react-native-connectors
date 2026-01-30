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
