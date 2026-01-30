import { ConvivaConfiguration } from "@theoplayer/react-native-analytics-conviva";
import Config from 'react-native-config';

export const convivaConfig: ConvivaConfiguration = {
  customerKey: Config.CONVIVA_CUSTOMER_KEY,
  debug: Config.CONVIVA_DEBUG === 'true',
  gatewayUrl: Config.CONVIVA_TOUCHSTONE_SERVICE_URL,
};
