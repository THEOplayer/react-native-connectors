import { EngageClient, EngageConfiguration, EngageConnector } from '@theoplayer/react-native-engage';
import { useEffect, useState } from 'react';

/**
 * useEngage is a convenience hook managing an Engage client.
 *
 * @param config
 */
export function useEngage(config: EngageConfiguration) {
  const [engageClient, setEngageClient] = useState<EngageClient | undefined>(undefined);
  useEffect(() => {
    EngageConnector.createClient(config).then((client) => {
      setEngageClient(client);
    });
    return () => engageClient?.destroy();
  }, []);
  return engageClient;
}
