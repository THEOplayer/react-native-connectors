import { EngageConfiguration, EngageErrorEvent, Entity } from "@theoplayer/react-native-engage";
import { NativeEventEmitter, NativeModules } from "react-native";
import { ClusterType, ClusterDataProvider } from "../api/types";
import { DefaultEventDispatcher } from "./event/DefaultEventDispatcher";
import { EngageEventMap } from "../api/EngageEvent";

interface UpdateClusterEvent {
  type: ClusterType;
}

interface ErrorEvent {
  message: string;
}

const TAG = "EngageClient";

export class EngageClient {
  private emitter: NativeEventEmitter;
  private clusterDataProvider: Map<ClusterType, ClusterDataProvider> = new Map();
  private configuration: EngageConfiguration;
  private eventDispatcher: DefaultEventDispatcher<EngageEventMap>;

  constructor(configuration: EngageConfiguration, eventDispatcher: DefaultEventDispatcher<EngageEventMap>) {
    if (configuration.debug) {
      console.debug(TAG, 'Creating Engage client');
    }
    this.eventDispatcher = eventDispatcher;
    this.configuration = configuration;
    NativeModules.EngageModule.initialize(configuration);
    this.emitter = new NativeEventEmitter(NativeModules.EngageModule);
    this.emitter.addListener('onUpdateCluster', this.onUpdateCluster);
    this.emitter.addListener('onError', this.onError);
  }

  updateClusterEntities(clusterType: ClusterType) {
    if (this.configuration.debug) {
      console.debug(TAG, `Requesting update for cluster "${clusterType}}"`);
    }
    NativeModules.EngageModule.updateClusterEntities(clusterType);
  }

  setClusterDataProvider(clusterType: ClusterType, cb: ClusterDataProvider | undefined) {
    this.clusterDataProvider[clusterType] = cb;
  }

  removeClusterEntities(cluster: ClusterType) {
    NativeModules.EngageModule.removeClusterEntities(cluster);
  }

  removeAllClusterEntities() {
    NativeModules.EngageModule.removeAllClusterEntities();
  }

  private onUpdateCluster = (event: UpdateClusterEvent) => {
    const newEntities: Entity[] = this.clusterDataProvider[event.type]?.()
    if (newEntities) {
      if (this.configuration.debug) {
        console.debug(TAG, `Updating cluster "${event.type}" with ${newEntities.length} entities`);
      }
      NativeModules.EngageModule.setClusterEntities(event.type, newEntities, false);
    } else {
      if (this.configuration.debug) {
        console.debug(TAG, `No entities for cluster "${event.type}"`);
      }
    }
  }

  private onError = (event: ErrorEvent) => {
    if (this.configuration.debug) {
      console.error(TAG, event.message);
    }
    this.eventDispatcher.dispatchEvent(new EngageErrorEvent(event.message));
  }

  destroy(): void {
    this.emitter.removeAllListeners('onUpdateCluster');
    this.emitter.removeAllListeners('onError');
    NativeModules.EngageModule.destroy();
  }
}
