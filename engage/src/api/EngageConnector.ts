import { EngageClient } from '../internal/EngageClient';
import { Platform } from 'react-native';
import { EngageConfiguration } from "./EngageConfiguration";
import { ClusterType, ClusterDataProvider } from "./types";
import { DefaultEventDispatcher } from "../internal/event/DefaultEventDispatcher";
import { EngageEventMap } from "./EngageEvent";

export class EngageConnector extends DefaultEventDispatcher<EngageEventMap> {
  private readonly _engageClient?: EngageClient;

  constructor(configuration: EngageConfiguration) {
    super();
    if (isValidConfiguration()) {
      this._engageClient = new EngageClient(configuration, this);
    }
  }

  /**
   * Request an update for the current list entities for a given cluster,
   *
   * @param clusterType either "Continuation" (or "Continue Watching"), "Featured", or "Recommendation".
   *
   * @remarks
   * <br/> - Any previously set list is replaced, there is no need to remove the old list first.
   * <br/> - The content can be unpersonalized if 'guest' sessions are supported.
   */
  updateClusterEntities(clusterType: ClusterType) {
    this._engageClient?.updateClusterEntities(clusterType);
  }

  /**
   * Set a callback to provide a list of cluster entities when requested from the OS.
   *
   * @param clusterType either "Continuation" (or "Continue Watching"), "Featured", or "Recommendation".
   * @param cb cluster entity provider callback.
   */
  setClusterDataProvider(clusterType: ClusterType, cb: ClusterDataProvider | undefined) {
    this._engageClient?.setClusterDataProvider(clusterType, cb);
  }

  /**
   * Clear all entities for a given cluster type.
   */
  removeClusterEntities(clusterType: ClusterType) {
    this._engageClient?.removeClusterEntities(clusterType);
  }

  /**
   * Remove all entities for all cluster types.
   */
  removeAllClusterEntities() {
    this._engageClient?.removeAllClusterEntities();
  }

  /**
   * Destroy the connector.
   */
  destroy(): void {
    this._engageClient?.destroy();
  }
}

function isValidConfiguration(): boolean {
  if (!(Platform.OS === 'android')) {
    console.warn(`EngageConnector is not support on ${Platform.OS}`);
    return false;
  }
  return true;
}
