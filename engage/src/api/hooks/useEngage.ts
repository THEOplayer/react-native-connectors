import { EngageConfiguration, EngageConnector } from "@theoplayer/react-native-engage";
import { useEffect, useRef } from "react";

export function useEngage(config: EngageConfiguration) {
  const engageConnector = useRef<EngageConnector | undefined>();
  useEffect(() => {
    engageConnector.current = new EngageConnector(config);
    return () => engageConnector.current?.destroy();
  }, []);
  return engageConnector;
}
