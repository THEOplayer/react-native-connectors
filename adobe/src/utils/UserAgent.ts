import { I18nManager, Platform, Settings } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const USER_AGENT_PREFIX = 'Mozilla/5.0';
const UNKNOWN = 'unknown';

function nonEmptyOrUnknown(str?: string): string {
  return str && str !== '' ? str : UNKNOWN;
}

export function buildUserAgent(): string {
  if (Platform.OS === 'android') {
    const { Release, Model: deviceName } = Platform.constants;
    const localeString = nonEmptyOrUnknown(I18nManager?.getConstants()?.localeIdentifier?.replace('_', '-'));
    const operatingSystem = `Android ${Release}`;
    const deviceBuildId = nonEmptyOrUnknown(DeviceInfo.getBuildIdSync());
    // operatingSystem: `Android Build.VERSION.RELEASE`
    // deviceName: Build.MODEL
    // Example: Mozilla/5.0 (Linux; U; Android 7.1.2; en-US; AFTN Build/NS6296)
    return `${USER_AGENT_PREFIX} (Linux; U; ${operatingSystem}; ${localeString}; ${deviceName} Build/${deviceBuildId})`;
  } else if (Platform.OS === 'ios') {
    const localeString = Settings.get('AppleLocale') || Settings.get('AppleLanguages')[0];
    const model = DeviceInfo.getModel();
    const osVersion = DeviceInfo.getSystemVersion().replace('.', '_');
    return `${USER_AGENT_PREFIX} (${model}; CPU OS ${osVersion} like Mac OS X; ${localeString})`;
  } else if (Platform.OS === 'web') {
    return navigator.userAgent;
  } /* if (Platform.OS === 'windows' || Platform.OS === 'macos') */ else {
    // Custom User-Agent for Windows and macOS not supported
    return 'Unknown';
  }
}
