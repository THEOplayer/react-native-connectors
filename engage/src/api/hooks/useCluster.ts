import {
  Cluster, ClusterConfig,
  ClusterType,
  EngageClient,
  EngageClusterEventType,
  Entity
} from "@theoplayer/react-native-engage";
import { useEffect, useState } from "react";

/**
 * useCluster is a convenience hook that listens for changes in the cluster instance, triggering a state update.
 *
 * @param engage
 * @param type
 */
export function useCluster(engage?: EngageClient, type?: ClusterType, config?: ClusterConfig) {
  const [, setEntities] = useState<Entity[]>([]);
  const [cluster, setCluster] = useState<Cluster | undefined>();

  useEffect(() => {
    if (engage) {
      const cluster = engage.getCluster(type);
      // Apply config
      cluster.config = config;
      setCluster(cluster);
      // Set initial entities list
      setEntities(cluster?.entities);
    }
  }, [engage]);

  useEffect(() => {
    const onEntitiesChanged = () => {
      if (cluster) {
        // Update new entities list
        setEntities(cluster?.entities);
      }
    };
    cluster?.addEventListener(EngageClusterEventType.EntitiesChanged, onEntitiesChanged);
    return () => {
      cluster?.removeEventListener(EngageClusterEventType.EntitiesChanged, onEntitiesChanged);
    }
  }, [cluster]);

  return cluster;
}
