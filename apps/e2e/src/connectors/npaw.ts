import { LogLevel, NpawConnectorConfig, useNpaw } from '@theoplayer/react-native-analytics-npaw';
import Config from 'react-native-config';

export const npawConfig: NpawConnectorConfig = {
  accountCode: Config.NPAW_ACCOUNT_CODE,
  analytics: {
    'content.title': 'THEOplayer E2E',
  },
  logLevel: LogLevel.DEBUG,
};

export function useNpawConnector() {
  const [, initNpaw] = useNpaw(npawConfig);
  return { initNpaw };
}
