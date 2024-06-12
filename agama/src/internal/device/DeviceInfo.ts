import { DetectableDeviceType, getDeviceType } from './AnalyticsDeviceTypeDetection';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

type AgamaDeviceType =
  | DetectableDeviceType.PC_
  | DetectableDeviceType.MOBILE_
  | DetectableDeviceType.TABLET_
  | DetectableDeviceType.SEARCH_BOT_
  | 'game-console'
  | 'tv'
  | 'media-streamer';

export async function getDeviceManufacturer(): Promise<string> {
  return DeviceInfo.getManufacturer();
}

export async function getDeviceModel(): Promise<string> {
  return DeviceInfo.getModel();
}

export function getAgamaDeviceType(): AgamaDeviceType | undefined {
  return Platform.OS === 'web' ? getAgamaDeviceTypeWeb() : getAgamaDeviceTypeNative();
}

function getAgamaDeviceTypeNative(): AgamaDeviceType | undefined {
  return Platform.isTV ? 'tv' : DetectableDeviceType.MOBILE_;
}

function getAgamaDeviceTypeWeb(): AgamaDeviceType | undefined {
  const deviceType = getDeviceType(self);
  switch (deviceType) {
    case DetectableDeviceType.CONSOLE_:
      return 'game-console';
    case DetectableDeviceType.SMARTTV_:
      return 'tv';
    case DetectableDeviceType.SETTOP_:
      return 'media-streamer';
    default:
      return deviceType;
  }
}
