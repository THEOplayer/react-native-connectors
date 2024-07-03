import { ClusterType, EngageConnector, Entity } from "@theoplayer/react-native-engage";
import { useClusterData } from "./useClusterData";
import React from "react";

export function useContinuation(engageConnector: React.MutableRefObject<EngageConnector>)
  : [Entity[], (entity: Entity) => void, (entity: Entity) => void] {
  return useClusterData(engageConnector, ClusterType.Continuation);
}
