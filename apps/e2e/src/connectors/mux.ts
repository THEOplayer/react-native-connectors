import { MuxOptions, useMux } from '@theoplayer/react-native-analytics-mux';
import Config from 'react-native-config';

export const muxOptions: MuxOptions = {
  data: {
    env_key: Config.MUX_ENV_KEY
  },
  debug: true,
}

export function useMuxConnector() {
  const [, initMux] = useMux();
  return { initMux };
}
