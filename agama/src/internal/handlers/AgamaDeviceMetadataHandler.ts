import type { Agama } from '../Agama';
import { EMPCLIENT_INTEGRATION_BUILDDATE, EMPCLIENT_INTEGRATION_VERSION, getAgamaDeviceId, mapAgamaMobileConnectionType } from '../AgamaUtils';
import type { AgamaConfiguration } from '../../api/AgamaConfiguration';
import NetInfo, { NetInfoState, NetInfoStateType, NetInfoSubscription } from '@react-native-community/netinfo';
import { getAgamaDeviceType, getDeviceManufacturer, getDeviceModel } from '../device/DeviceInfo';
import { getBrowserMajorVersion, getBrowserName } from '../device/web/AnalyticsBrowserDetection';
import { Platform } from 'react-native';
import { getOsFullVersion, getOsName } from '../device/web/AnalyticsOsDetection';
import DeviceInfo from 'react-native-device-info';
import type { AgamaPlayerDescription } from '../AgamaClient';

/**
 * AgamaDeviceMetadataHandler reports device-related metadata.
 */
export class AgamaDeviceMetadataHandler {
  private netInfoSubscription: NetInfoSubscription | undefined;

  constructor(
    private readonly empClient: Agama.EMPClient,
    private readonly agama: typeof Agama,
  ) {}

  async signalDeviceMetadata_(agamaPlayerConfig: AgamaConfiguration, agamaPlayerDescription: AgamaPlayerDescription): Promise<void> {
    this.empClient.setDeviceMetadata(this.agama.DeviceMetadata.DEVICE_ID, agamaPlayerConfig.deviceID || (await getAgamaDeviceId()));
    this.empClient.setDeviceMetadata(this.agama.DeviceMetadata.PLAYER, agamaPlayerDescription.name);
    this.empClient.setDeviceMetadata(this.agama.DeviceMetadata.PLAYER_VERSION, agamaPlayerDescription.version);
    await this.reportDeviceInfo_(agamaPlayerConfig);
    this.reportBrowserInfo_();
    this.reportOsInfo_();
    this.empClient.setDeviceMetadata(this.agama.DeviceMetadata.EMPCLIENT_INTEGRATION_VERSION, EMPCLIENT_INTEGRATION_VERSION);
    this.empClient.setDeviceMetadata(this.agama.DeviceMetadata.EMPCLIENT_INTEGRATION_BUILDDATE, EMPCLIENT_INTEGRATION_BUILDDATE);
    if (agamaPlayerConfig.application) {
      this.empClient.setDeviceMetadata(this.agama.DeviceMetadata.APPLICATION, agamaPlayerConfig.application);
    }
    if (agamaPlayerConfig.applicationVersion) {
      this.empClient.setDeviceMetadata(this.agama.DeviceMetadata.APPLICATION_VERSION, agamaPlayerConfig.applicationVersion);
    }
    if (agamaPlayerConfig.userAccountID) {
      this.empClient.setDeviceMetadata(this.agama.DeviceMetadata.USER_ACCOUNT_ID, agamaPlayerConfig.userAccountID);
    }
    this.reportConnectionTypeAsync_();
    this.netInfoSubscription = NetInfo.addEventListener((state) => {
      this.reportConnectionType_(state);
    });
  }

  private async reportDeviceInfo_(configuration: AgamaConfiguration): Promise<void> {
    this.reportDeviceType_(configuration);
    const manufacturer = configuration.deviceManufacturer || (await getDeviceManufacturer());
    if (manufacturer) {
      if (__DEBUG__) {
        console.log(`[AGAMA] Device manufacturer: ${manufacturer}`);
      }
      this.empClient.setDeviceMetadata(this.agama.DeviceMetadata.DEVICE_MANUFACTURER, manufacturer);
    } else {
      console.warn(`[AGAMA] Device manufacturer unavailable.`);
    }
    const model = configuration.deviceModel || (await getDeviceModel());
    if (model) {
      if (__DEBUG__) {
        console.log(`[AGAMA] Device model: ${model}`);
      }
      this.empClient.setDeviceMetadata(this.agama.DeviceMetadata.DEVICE_MODEL, model);
    } else {
      console.warn(`[AGAMA] Device model unavailable.`);
    }
  }

  private reportDeviceType_(configuration: AgamaConfiguration): void {
    const agamaDeviceType = configuration.deviceType || getAgamaDeviceType();
    if (agamaDeviceType) {
      if (__DEBUG__) {
        console.log(`[AGAMA] Device type: ${agamaDeviceType}`);
      }
      this.empClient.setDeviceMetadata(this.agama.DeviceMetadata.DEVICE_TYPE, agamaDeviceType);
    }
  }

  private reportBrowserInfo_(): void {
    if (Platform.OS !== 'web') {
      // Nothing to report
      return;
    }
    const browserName = getBrowserName(self);
    if (browserName) {
      this.empClient.setDeviceMetadata(this.agama.DeviceMetadata.DEVICE_BROWSER, browserName);
    }
    const browserMajorVersion = getBrowserMajorVersion(self);
    if (browserMajorVersion !== undefined) {
      this.empClient.setDeviceMetadata(this.agama.DeviceMetadata.DEVICE_BROWSER_VERSION, browserMajorVersion.toString());
    }
  }

  private reportOsInfo_(): void {
    let osName, osVersion;
    if (Platform.OS === 'web') {
      osName = getOsName(self);
      osVersion = getOsFullVersion(self);
    } else {
      osName = DeviceInfo.getBaseOsSync();
      osVersion = DeviceInfo.getSystemVersion();
    }
    if (osName) {
      this.empClient.setDeviceMetadata(this.agama.DeviceMetadata.DEVICE_OS, osName);
    }
    if (osVersion) {
      this.empClient.setDeviceMetadata(this.agama.DeviceMetadata.DEVICE_OS_VERSION, osVersion.toString());
    }
  }

  private readonly reportConnectionTypeAsync_ = (): void => {
    NetInfo.fetch().then((state) => {
      this.reportConnectionType_(state);
    });
  };

  private readonly reportConnectionType_ = (state: NetInfoState): void => {
    if (__DEBUG__) {
      console.log(`[AGAMA] Connection: ${state.type}; connected: ${state.isConnected}`);
    }
    const connectionType = state.type;
    switch (connectionType) {
      case NetInfoStateType.wifi:
        this.empClient.setDeviceMetadata(this.agama.DeviceMetadata.DATA_CONNECTION_TYPE, 'wlan');
        break;
      case NetInfoStateType.ethernet:
        this.empClient.setDeviceMetadata(this.agama.DeviceMetadata.DATA_CONNECTION_TYPE, connectionType);
        break;
      case NetInfoStateType.cellular: {
        const mobileConnectionType = mapAgamaMobileConnectionType(state.details?.cellularGeneration);
        if (mobileConnectionType) {
          this.empClient.setDeviceMetadata(this.agama.DeviceMetadata.DATA_CONNECTION_TYPE, mobileConnectionType);
        }
        break;
      }
      default:
        // Don't report DATA_CONNECTION_TYPE if no accepted types were detected
        break;
    }
  };

  unload_(): void {
    if (this.netInfoSubscription) {
      this.netInfoSubscription();
    }
  }
}
