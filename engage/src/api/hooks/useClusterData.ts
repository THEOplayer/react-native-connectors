import { ClusterType, EngageConnector, Entity } from "@theoplayer/react-native-engage";
import { useCallback, useEffect, useState } from "react";

export function useClusterData(engageConnector: React.MutableRefObject<EngageConnector>, clusterType: ClusterType)
  : [Entity[], (entity: Entity) => void, (entity: Entity) => void] {
  const [data, setData] = useState<Entity[]>([]);

  useEffect(() => {
    // Update initial data once on creation
    engageConnector.current?.updateClusterEntities(clusterType);
  }, []);

  useEffect(() => {
    const provideClusterData = () => {
      return data;
    };
    engageConnector.current?.setClusterDataProvider(clusterType, provideClusterData);
  }, [data]);

  const addToData = useCallback((entity: Entity) => {
    // Update local storage, avoid duplicates
    setData(list => [...new Set([...list, entity])]);

    // Notify Engage
    engageConnector.current?.updateClusterEntities(clusterType);
  }, []);

  const removeFromData = useCallback((entity: Entity) => {
    // Update local storage
    setData(list => list.filter(e => e.id !== entity.id));

    // Notify Engage
    engageConnector.current?.updateClusterEntities(clusterType);
  }, []);

  return [data, addToData, removeFromData];
}
