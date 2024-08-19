import {
  Cluster,
  ClusterType,
} from "@theoplayer/react-native-engage";
import { DefaultEngageClient } from "../DefaultEngageClient";
import { MMKV } from 'react-native-mmkv'
import { DefaultCluster } from "../cluster/DefaultCluster";

const TAG: string = 'EngageStorage';

const storage = new MMKV({
  id: 'engage-storage'
});

export async function readCluster(client: DefaultEngageClient, clusterType: ClusterType): Promise<Cluster> {
  console.log(TAG, 'read', clusterType);
  try {
    return createCluster(client, clusterType, storage.getString(storageKeyForCluster(clusterType)));
  } catch (e) {
    console.warn(TAG, `Failed to retrieve cluster data from storage: ${e}`);
  }
  return createCluster(client, clusterType);
}

function createCluster(client: DefaultEngageClient, clusterType: ClusterType, json?: string): Cluster {
  if (json) {
    try {
      const cluster = JSON.parse(json) as Cluster;
      return new DefaultCluster(client, clusterType, cluster.entities);
    } catch (e) {
      console.warn(TAG, `Failed to retrieve cluster data from storage: ${e}`);
    }
  }
  return new DefaultCluster(client, clusterType);
}

export async function storeCluster(cluster: Cluster): Promise<boolean> {
  const key = storageKeyForCluster(cluster.type);
  try {
    const json = JSON.stringify({
      ...cluster,
      engageClient: undefined,
    });
    storage.set(key, json);
    return true;
  } catch (e) {
    console.warn(TAG, `Failed to store cluster data ${key}: ${e}`);
    return false;
  }
}

export async function removeCluster(type: ClusterType) {
  storage.delete(storageKeyForCluster(type));
}

function storageKeyForCluster(type: ClusterType): string {
  return `engage/cluster/${type}`
}
