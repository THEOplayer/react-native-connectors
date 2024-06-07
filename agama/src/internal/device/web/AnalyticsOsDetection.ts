import { DetectionRegexpMap, DetectionWindow, getUserAgent } from './DetectionUtils';

export enum DetectableOs {
  WINDOWS_10_ = 'Windows 10',
  WINDOWS_8_1_ = 'Windows 8.1',
  WINDOWS_8_ = 'Windows 8',
  WINDOWS_7_ = 'Windows 7',
  WINDOWS_VISTA_ = 'Windows Vista',
  WINDOWS_SERVER_2003_ = 'Windows Server 2003',
  WINDOWS_XP_ = 'Windows XP',
  WINDOWS_PHONE_ = 'Windows Phone',
  MAC_OS_X_ = 'Mac OS X',
  MAC_OS_ = 'Mac OS',
  ANDROID_ = 'Android',
  IOS_ = 'iOS',
  UBUNTU_ = 'Ubuntu',
  LINUX_ = 'Linux',
  CHROME_OS_ = 'Chrome OS',
}

/*
 * OS name identification
 */
const osNameRegexpMap: DetectionRegexpMap = {
  [DetectableOs.WINDOWS_10_]: /(Windows 10.0|Windows NT 10.0)/i,
  [DetectableOs.WINDOWS_8_1_]: /(Windows 8.1|Windows NT 6.3)/i,
  [DetectableOs.WINDOWS_8_]: /(Windows 8|Windows NT 6.2)/i,
  [DetectableOs.WINDOWS_7_]: /(Windows 7|Windows NT 6.1)/i,
  [DetectableOs.WINDOWS_VISTA_]: /Windows NT 6.0/i,
  [DetectableOs.WINDOWS_SERVER_2003_]: /Windows NT 5.2/i,
  [DetectableOs.WINDOWS_XP_]: /(Windows NT 5.1|Windows XP)/i,
  [DetectableOs.WINDOWS_PHONE_]: /Windows Phone/i,
  [DetectableOs.ANDROID_]: /Android/i,
  [DetectableOs.LINUX_]: /(Linux(?!.*Ubuntu)|X11)/,
  [DetectableOs.UBUNTU_]: /Ubuntu/i,
  [DetectableOs.IOS_]: /(iPhone|iPad|iPod)/i,
  [DetectableOs.MAC_OS_X_]: /Mac OS X/i,
  [DetectableOs.MAC_OS_]: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/i,
  [DetectableOs.CHROME_OS_]: /CrOS/i,
};

function matchOsName(odWindow: DetectionWindow, os: DetectableOs): boolean {
  const osNameRegexp = osNameRegexpMap[os];
  if (!osNameRegexp) {
    return false;
  }
  return Boolean(getUserAgent(odWindow).match(osNameRegexp));
}

export function isAndroid(odWindow: DetectionWindow): boolean {
  return matchOsName(odWindow, DetectableOs.ANDROID_);
}

function isWindowsPhone(odWindow: DetectionWindow): boolean {
  return matchOsName(odWindow, DetectableOs.WINDOWS_PHONE_);
}

export function isIos(odWindow: DetectionWindow): boolean {
  return matchOsName(odWindow, DetectableOs.IOS_) && !isWindowsPhone(odWindow);
}

export function isWindows(odWindow: DetectionWindow): boolean {
  return Boolean(getUserAgent(odWindow).match(/Windows/i));
}

function isWindows10(odWindow: DetectionWindow): boolean {
  return matchOsName(odWindow, DetectableOs.WINDOWS_10_);
}

function isWindows8_1(odWindow: DetectionWindow): boolean {
  return matchOsName(odWindow, DetectableOs.WINDOWS_8_1_);
}

function isWindows8(odWindow: DetectionWindow): boolean {
  return matchOsName(odWindow, DetectableOs.WINDOWS_8_);
}

function isWindows7(odWindow: DetectionWindow): boolean {
  return matchOsName(odWindow, DetectableOs.WINDOWS_7_);
}

function isWindowsVista(odWindow: DetectionWindow): boolean {
  return matchOsName(odWindow, DetectableOs.WINDOWS_VISTA_);
}

function isWindowsServer2003(odWindow: DetectionWindow): boolean {
  return matchOsName(odWindow, DetectableOs.WINDOWS_SERVER_2003_);
}

function isWindowsXP(odWindow: DetectionWindow): boolean {
  return matchOsName(odWindow, DetectableOs.WINDOWS_XP_);
}

function isLinux(odWindow: DetectionWindow): boolean {
  return matchOsName(odWindow, DetectableOs.LINUX_) && !isUbuntu(odWindow);
}

function isUbuntu(odWindow: DetectionWindow): boolean {
  return matchOsName(odWindow, DetectableOs.UBUNTU_);
}

function isMacOSX(odWindow: DetectionWindow): boolean {
  return matchOsName(odWindow, DetectableOs.MAC_OS_X_);
}

function isMacOS(odWindow: DetectionWindow): boolean {
  return matchOsName(odWindow, DetectableOs.MAC_OS_);
}

function isChromeOS(odWindow: DetectionWindow): boolean {
  return matchOsName(odWindow, DetectableOs.CHROME_OS_);
}

/*
 * OS version identification
 */

const WINDOWS_VERSION_REGEXP = /Windows (NT|Phone) ([0-9.]+)/i;
const MAC_VERSION_REGEXP = /Mac.*?(OS |OS X )(\d+(([_.])\d+)?(([_.])\d+)?)/i;
const osVersionRegexpMap: DetectionRegexpMap = {
  [DetectableOs.WINDOWS_10_]: WINDOWS_VERSION_REGEXP,
  [DetectableOs.WINDOWS_8_1_]: WINDOWS_VERSION_REGEXP,
  [DetectableOs.WINDOWS_8_]: WINDOWS_VERSION_REGEXP,
  [DetectableOs.WINDOWS_7_]: WINDOWS_VERSION_REGEXP,
  [DetectableOs.WINDOWS_VISTA_]: WINDOWS_VERSION_REGEXP,
  [DetectableOs.WINDOWS_SERVER_2003_]: WINDOWS_VERSION_REGEXP,
  [DetectableOs.WINDOWS_XP_]: WINDOWS_VERSION_REGEXP,
  [DetectableOs.WINDOWS_PHONE_]: /Windows Phone ([0-9.]+)/i,
  [DetectableOs.ANDROID_]: /Android (\d+(([_.])\d+)?(([_.])\d+)?)/i,
  [DetectableOs.LINUX_]: undefined,
  [DetectableOs.UBUNTU_]: undefined,
  [DetectableOs.IOS_]: /(iPad|iPhone|iPod).*?(OS |os |OS_)(\d+(([_.])\d+)?(([_.])\d+)?)/i,
  [DetectableOs.MAC_OS_X_]: MAC_VERSION_REGEXP,
  [DetectableOs.MAC_OS_]: MAC_VERSION_REGEXP,
  [DetectableOs.CHROME_OS_]: undefined,
};

function matchOsVersion(odWindow: DetectionWindow, os: DetectableOs): RegExpMatchArray | null {
  const osVersionRegexp = osVersionRegexpMap[os];
  if (!osVersionRegexp) {
    return null;
  }
  return getUserAgent(odWindow).match(osVersionRegexp);
}

function splitVersionArray(version: string): number[] {
  return version.split(/[_.]/).map((str: string) => {
    return parseInt(str, 10);
  });
}

// Detectable version matches in major.minor.patch
function androidVersionArray(odWindow: DetectionWindow): number[] | undefined {
  const androidVersion = matchOsVersion(odWindow, DetectableOs.ANDROID_);
  return androidVersion && androidVersion.length > 1 ? splitVersionArray(androidVersion[1]) : undefined;
}

function iosVersionArray(odWindow: DetectionWindow): number[] | undefined {
  const iosVersion = matchOsVersion(odWindow, DetectableOs.IOS_);
  return iosVersion && iosVersion.length > 3 ? splitVersionArray(iosVersion[3]) : undefined;
}

function windowsVersionArray(odWindow: DetectionWindow): number[] | undefined {
  const windowsVersion = matchOsVersion(odWindow, DetectableOs.WINDOWS_10_); // The same for all version of windows
  return windowsVersion && windowsVersion.length > 2 ? splitVersionArray(windowsVersion[2]) : undefined;
}

function macVersionArray(odWindow: DetectionWindow): number[] | undefined {
  const macVersion = matchOsVersion(odWindow, DetectableOs.MAC_OS_X_);
  return macVersion && macVersion.length > 2 ? splitVersionArray(macVersion[2]) : undefined;
}

function chromeOSVersionArray(odWindow: DetectionWindow): number[] | undefined {
  const chromeOSVersion = matchOsVersion(odWindow, DetectableOs.CHROME_OS_);
  return chromeOSVersion && chromeOSVersion.length > 0 ? splitVersionArray(chromeOSVersion[0]) : undefined;
}

/*
 * General os info retrieval
 */

export function getOsName(bdWindow: DetectionWindow): string | undefined {
  if (isWindows(bdWindow)) {
    if (isWindows10(bdWindow)) {
      return DetectableOs.WINDOWS_10_;
    } else if (isWindowsPhone(bdWindow)) {
      return DetectableOs.WINDOWS_PHONE_;
    } else if (isWindows8_1(bdWindow)) {
      return DetectableOs.WINDOWS_8_1_;
    } else if (isWindows8(bdWindow)) {
      return DetectableOs.WINDOWS_8_;
    } else if (isWindows7(bdWindow)) {
      return DetectableOs.WINDOWS_7_;
    } else if (isWindowsVista(bdWindow)) {
      return DetectableOs.WINDOWS_VISTA_;
    } else if (isWindowsServer2003(bdWindow)) {
      return DetectableOs.WINDOWS_SERVER_2003_;
    } else if (isWindowsXP(bdWindow)) {
      return DetectableOs.WINDOWS_XP_;
    }
  } else if (isAndroid(bdWindow)) {
    return DetectableOs.ANDROID_;
  } else if (isIos(bdWindow)) {
    return DetectableOs.IOS_;
  } else if (isMacOSX(bdWindow)) {
    return DetectableOs.MAC_OS_X_;
  } else if (isMacOS(bdWindow)) {
    return DetectableOs.MAC_OS_;
  } else if (isUbuntu(bdWindow)) {
    return DetectableOs.UBUNTU_;
  } else if (isChromeOS(bdWindow)) {
    return DetectableOs.CHROME_OS_;
  } else if (isLinux(bdWindow)) {
    return DetectableOs.LINUX_;
  }
  return undefined;
}

export function getOsVersionEntry(odWindow: DetectionWindow, entry: number): number | undefined {
  const windowsVersionArr = windowsVersionArray(odWindow);
  const macVersionArr = macVersionArray(odWindow);
  const androidVersionArr = androidVersionArray(odWindow);
  const iosVersionArr = iosVersionArray(odWindow);
  const chromeOSVersionArr = chromeOSVersionArray(odWindow);

  if (windowsVersionArr) {
    return windowsVersionArr.length > entry ? windowsVersionArr[entry] : undefined;
  }
  if (macVersionArr) {
    return macVersionArr.length > entry ? macVersionArr[entry] : undefined;
  }
  if (androidVersionArr) {
    return androidVersionArr.length > entry ? androidVersionArr[entry] : undefined;
  }
  if (iosVersionArr) {
    return iosVersionArr.length > entry ? iosVersionArr[entry] : undefined;
  }
  if (chromeOSVersionArr) {
    return chromeOSVersionArr.length > entry ? chromeOSVersionArr[entry] : undefined;
  }
  return undefined;
}

export function getOsMajorVersion(odWindow: DetectionWindow): number | undefined {
  return getOsVersionEntry(odWindow, 0);
}

export function getOsMinorVersion(odWindow: DetectionWindow): number | undefined {
  return getOsVersionEntry(odWindow, 1);
}

export function getOsPatchVersion(odWindow: DetectionWindow): number | undefined {
  return getOsVersionEntry(odWindow, 2);
}

export function getOsFullVersion(odWindow: DetectionWindow): string | undefined {
  const major = getOsMajorVersion(odWindow);
  const minor = getOsMinorVersion(odWindow);
  const patch = getOsPatchVersion(odWindow);
  if (major === undefined) {
    return undefined;
  } else if (minor === undefined) {
    return `${major}`;
  } else if (patch === undefined) {
    return `${major}.${minor}`;
  }
  return `${major}.${minor}.${patch}`;
}
