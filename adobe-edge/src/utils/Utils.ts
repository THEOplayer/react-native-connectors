import type { Ad, AdBreak, TextTrackCue } from 'react-native-theoplayer';
import { NativeModules, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import type { AdobeAdvertisingDetails, AdobeAdvertisingPodDetails, AdobeChapterDetails } from '@theoplayer/react-native-analytics-adobe-edge';

export function sanitisePlayhead(playheadInMsec?: number): number {
  if (!playheadInMsec) {
    return 0;
  }
  if (playheadInMsec === Infinity) {
    // If content is live, the playhead must be the current second of the day.
    const date = new Date();
    return date.getSeconds() + 60 * (date.getMinutes() + 60 * date.getHours());
  }
  return Math.trunc(playheadInMsec / 1000);
}

/**
 * Sanitise the current media length in seconds.
 *
 * - In case of a live stream, set it to 24h.
 */
export function sanitiseContentLength(mediaLengthMsec: number): number {
  return mediaLengthMsec === Infinity ? 86400 : Math.trunc(1e-3 * mediaLengthMsec);
}

export function calculateAdvertisingPodDetails(adBreak: AdBreak, lastPodIndex: number): AdobeAdvertisingPodDetails {
  const currentAdBreakTimeOffset = adBreak.timeOffset;
  let podIndex: number;
  if (currentAdBreakTimeOffset === 0) {
    podIndex = 0;
  } else if (currentAdBreakTimeOffset < 0) {
    podIndex = -1;
  } else {
    podIndex = lastPodIndex++;
  }
  return {
    index: podIndex ?? 0,
    offset: Math.trunc(currentAdBreakTimeOffset),
  };
}

export function calculateAdvertisingDetails(ad: Ad, podPosition: number): AdobeAdvertisingDetails {
  return {
    podPosition,
    length: ad.duration ? Math.trunc(ad.duration) : 0,
    name: 'NA', // TODO
    playerName: 'THEOplayer',
  };
}

export function calculateChapterDetails(cue: TextTrackCue): AdobeChapterDetails {
  const id = Number(cue.id);
  const index = isNaN(id) ? 0 : id;
  return {
    length: Math.trunc((cue.endTime - cue.startTime) / 1000),
    offset: Math.trunc(cue.startTime / 1000),
    index,
  };
}

const USER_AGENT_PREFIX = 'Mozilla/5.0';
const UNKNOWN = 'unknown';

function nonEmptyOrUnknown(str?: string): string {
  return str && str !== '' ? str : UNKNOWN;
}

export function buildUserAgent(): string {
  if (Platform.OS === 'android') {
    const { Release, Model: deviceName } = Platform.constants;
    const localeString = nonEmptyOrUnknown(NativeModules.I18nManager?.localeIdentifier?.replace('_', '-'));
    const operatingSystem = `Android ${Release}`;
    const deviceBuildId = nonEmptyOrUnknown(DeviceInfo.getBuildIdSync());
    // operatingSystem: `Android Build.VERSION.RELEASE`
    // deviceName: Build.MODEL
    // Example: Mozilla/5.0 (Linux; U; Android 7.1.2; en-US; AFTN Build/NS6296)
    return `${USER_AGENT_PREFIX} (Linux; U; ${operatingSystem}; ${localeString}; ${deviceName} Build/${deviceBuildId})`;
  } else if (Platform.OS === 'ios') {
    const localeString = NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0];
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
