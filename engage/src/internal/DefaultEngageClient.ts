import {
  Cluster,
  ClusterType,
  EngageClient,
  EngageConfiguration,
  SignIn
} from "@theoplayer/react-native-engage";
import { NativeEventEmitter, NativeModules } from "react-native";
import { DefaultEventDispatcher } from "./event/DefaultEventDispatcher";
import { EngageErrorEvent, EngageEventMap } from "../api/EngageEvent";
import { readCluster, removeCluster, storeCluster } from "./storage/Storage";

interface NativeErrorEvent {
  message: string;
}

interface NativeReadyEvent {
  continuation: string;
  featured: string;
  recommendation: string;
}

const TAG = "EngageClient";

export class DefaultEngageClient extends DefaultEventDispatcher<EngageEventMap> implements EngageClient {
  private _emitter: NativeEventEmitter;
  private _configuration: EngageConfiguration;
  private _eventDispatcher: DefaultEventDispatcher<EngageEventMap>;
  private _clusters: Map<ClusterType, Cluster> = new Map();
  private readonly _onReady: (client: EngageClient) => void;

  constructor(configuration: EngageConfiguration, onReady: (client: EngageClient) => void) {
    super();
    if (configuration.debug) {
      console.debug(TAG, 'Creating Engage client');
    }
    this._onReady = onReady;
    this._configuration = configuration;
    this._emitter = new NativeEventEmitter(NativeModules.EngageModule);
    this._emitter.addListener('onEngageReady', this.onEngageReady);
    this._emitter.addListener('onEngageError', this.onError);
    NativeModules.EngageModule.initialize(configuration);
  }

  getCluster(type:ClusterType): Cluster {
    return this._clusters.get(type);
  }

  setSignInEntity(entity?: SignIn) {
    if (entity) {
      if (this._configuration.debug) {
        console.debug(TAG, `Setting SignIn entity ${JSON.stringify(entity, null, 2)}`);
      }
      NativeModules.EngageModule.publishSignInEntity(entity);
    } else {
      if (this._configuration.debug) {
        console.debug(TAG, `Removing SignIn entity`);
      }
      NativeModules.EngageModule.unpublishSignInEntity();
    }
  }

  unpublishCluster(type: ClusterType) {
    this._clusters.get(type)?.unpublish();
  }

  /**
   * Request to publish the given cluster.
   *
   * @param cluster either a "Continuation" (or "Continue Watching"), "Featured", or "Recommendation" cluster.
   *
   * @remarks
   * <br/> - Any previously set list is replaced, there is no need to remove the old list first.
   * <br/> - The content can be unpersonalized if 'guest' sessions are supported.
   */
  publish(cluster: Cluster) {
    if (this._configuration.debug) {
      console.debug(TAG, `Requesting to publish cluster "${cluster.type}}" with ${cluster.entities.length} entities`);
    }
    // Publish
    NativeModules.EngageModule.publishCluster(Object.freeze({
        ...cluster,
        // Don't pass the client
        engageClient: undefined
      }
    ));
    // Persistently store
    void storeCluster(cluster);
  }

  unpublish(cluster: Cluster) {
    if (this._configuration.debug) {
      console.debug(TAG, `Unpublish cluster "${cluster.type}"`);
    }
    // Unpublish
    NativeModules.EngageModule.unpublishCluster(cluster.type);

    // Clear stored data
    void removeCluster(cluster.type);
  }

  private onEngageReady = async (event: NativeReadyEvent) => {
    const clusterPromises = Object.keys(ClusterType).map(async key => {
      const type = ClusterType[key];
      const cluster = await readCluster(this, type);
      this._clusters.set(type, cluster);
    });
    await Promise.all(clusterPromises);
    if (this._configuration.debug) {
      console.debug(TAG, 'Engage ready');
    }
    this._onReady(this);
  }

  private onError = (event: NativeErrorEvent) => {
    if (this._configuration.debug) {
      console.error(TAG, event.message);
    }
    this._eventDispatcher.dispatchEvent(new EngageErrorEvent(event.message));
  }

  destroy(): void {
    this._emitter.removeAllListeners('onError');
    NativeModules.EngageModule.destroy();
  }
}
