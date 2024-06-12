import { DetectionRegexpMap, DetectionWindow, getUserAgent } from './DetectionUtils';
import { isAndroid, isIos } from './AnalyticsOsDetection';

declare global {
  interface Window {
    chrome?: any;
    ActiveXObject?: any;
    DocumentTouch?: any;
  }
}

export enum DetectableBrowser {
  CHROME_ = 'Chrome',
  CHROME_MOBILE_ = 'Chrome Mobile',
  CHROME_IOS_ = 'Chrome iOS',
  CHROMIUM_ = 'Chromium',
  FIREFOX_ = 'Firefox',
  SEAMONKEY_ = 'Seamonkey',
  FIREFOX_IOS_ = 'Firefox iOS',
  FIREFOX_MOBILE_ = 'Firefox Mobile',
  SAFARI_ = 'Safari',
  SAFARI_MOBILE_ = 'Safari Mobile',
  EDGE_ = 'Edge',
  EDGE_CHROMIUM_ = 'Edge Chromium',
  EDGE_MOBILE_ = 'Edge Mobile',
  IE_ = 'IE',
  OPERA_ = 'Opera',
  OPERA_MOBILE_ = 'Opera Mobile',
  VIVALDI_ = 'Vivaldi',
  HEADLESS_CHROME_ = 'HeadlessChrome',
  ANDROID_STOCK_ = 'Android Browser',
}

/*
 * Browser name identification
 */

const browserNameRegexpMap: DetectionRegexpMap = {
  [DetectableBrowser.CHROME_]: /Chrome/i,
  [DetectableBrowser.CHROME_MOBILE_]: undefined,
  [DetectableBrowser.CHROME_IOS_]: /CriOS/i,
  [DetectableBrowser.CHROMIUM_]: /Chromium/i,
  [DetectableBrowser.HEADLESS_CHROME_]: /HeadlessChrome/i,
  [DetectableBrowser.FIREFOX_]: /Firefox/i,
  [DetectableBrowser.SEAMONKEY_]: /Seamonkey/i,
  [DetectableBrowser.FIREFOX_IOS_]: /FxiOS/i,
  [DetectableBrowser.SAFARI_]: /Safari/i,
  [DetectableBrowser.EDGE_]: /Edge\/\d+/i,
  [DetectableBrowser.EDGE_CHROMIUM_]: /Edg\/\d+/i,
  [DetectableBrowser.IE_]: /Trident/i,
  [DetectableBrowser.OPERA_]: /Opera|OPR/i,
  [DetectableBrowser.VIVALDI_]: /Vivaldi/i,
  [DetectableBrowser.ANDROID_STOCK_]: undefined,
};

function matchBrowserName(bdWindow: DetectionWindow, browser: DetectableBrowser): boolean {
  const browserNameRegexp = browserNameRegexpMap[browser];
  if (!browserNameRegexp) {
    return false;
  }
  return Boolean(getUserAgent(bdWindow).match(browserNameRegexp));
}

function isMobile(bdWindow: DetectionWindow): boolean {
  return Boolean(getUserAgent(bdWindow).match(/Mobi/i));
}

function isChrome(bdWindow: DetectionWindow): boolean {
  return (
    Boolean(bdWindow.chrome && bdWindow.navigator && bdWindow.navigator.vendor && /google/i.test(bdWindow.navigator.vendor)) || isChromeIOS(bdWindow)
  );
}

function isChromeIOS(bdWindow: DetectionWindow): boolean {
  return matchBrowserName(bdWindow, DetectableBrowser.CHROME_IOS_);
}

function isChromium(bdWindow: DetectionWindow): boolean {
  return matchBrowserName(bdWindow, DetectableBrowser.CHROMIUM_);
}

function isHeadlessChrome(bdWindow: DetectionWindow): boolean {
  return matchBrowserName(bdWindow, DetectableBrowser.HEADLESS_CHROME_);
}

function isFirefox(bdWindow: DetectionWindow): boolean {
  return matchBrowserName(bdWindow, DetectableBrowser.FIREFOX_) && !isSeamonkey(bdWindow);
}

function isFirefoxMobile(bdWindow: DetectionWindow): boolean {
  return matchBrowserName(bdWindow, DetectableBrowser.FIREFOX_MOBILE_) && !isSeamonkey(bdWindow) && isMobile(bdWindow);
}

function isSeamonkey(bdWindow: DetectionWindow): boolean {
  return matchBrowserName(bdWindow, DetectableBrowser.SEAMONKEY_);
}

function isFirefoxIOS(bdWindow: DetectionWindow): boolean {
  return matchBrowserName(bdWindow, DetectableBrowser.FIREFOX_IOS_) && !isSeamonkey(bdWindow);
}

function isSafari(bdWindow: DetectionWindow): boolean {
  return matchBrowserName(bdWindow, DetectableBrowser.SAFARI_) && !matchBrowserName(bdWindow, DetectableBrowser.CHROME_);
}

function isSafariMobile(bdWindow: DetectionWindow): boolean {
  return isSafari(bdWindow) && isMobile(bdWindow);
}

function isOpera(bdWindow: DetectionWindow): boolean {
  return Boolean(operaVersionMatch(bdWindow));
}

function isEdge(bdWindow: DetectionWindow): boolean {
  return matchBrowserName(bdWindow, DetectableBrowser.EDGE_);
}

function isEdgeChromium(bdWindow: DetectionWindow): boolean {
  return matchBrowserName(bdWindow, DetectableBrowser.EDGE_CHROMIUM_);
}

function isInternetExplorer(bdWindow: DetectionWindow): boolean {
  return matchBrowserName(bdWindow, DetectableBrowser.IE_);
}

function isVivaldi(bdWindow: DetectionWindow): boolean {
  return matchBrowserName(bdWindow, DetectableBrowser.VIVALDI_);
}

/*
 * Browser version identification
 */

const CHROME_VERSION_REGEX = /chrome\/([0-9]+)\.([0-9]+)\.([0-9]+)\.([0-9]+)/i;
const browserVersionRegexpMap: DetectionRegexpMap = {
  [DetectableBrowser.CHROME_]: CHROME_VERSION_REGEX,
  [DetectableBrowser.CHROME_MOBILE_]: CHROME_VERSION_REGEX,
  [DetectableBrowser.CHROME_IOS_]: /CriOS\/([0-9]+)\.([0-9]+)\.([0-9]+)\.([0-9]+)/i,
  [DetectableBrowser.CHROMIUM_]: CHROME_VERSION_REGEX,
  [DetectableBrowser.HEADLESS_CHROME_]: CHROME_VERSION_REGEX,
  [DetectableBrowser.FIREFOX_]: /Firefox\/([0-9.]+)/i,
  [DetectableBrowser.FIREFOX_IOS_]: /FxiOS\/([0-9.]+)/i,
  [DetectableBrowser.SAFARI_]: /(Version)\/((\d+)\.(\d+)(?:\.(\d+))?).*Safari/,
  [DetectableBrowser.SAFARI_MOBILE_]: undefined,
  [DetectableBrowser.EDGE_]: /Edge\/(\d+)/i,
  [DetectableBrowser.EDGE_CHROMIUM_]: /Edg\/(\d+)/i,
  [DetectableBrowser.EDGE_MOBILE_]: undefined,
  [DetectableBrowser.IE_]: /(MSIE |Trident.*?rv:)(\d+)/i,
  [DetectableBrowser.OPERA_]: /(OPR\/(\d+\.\d+))|(Opera(?=.*Version\/((\d+)\.(\d+))))/i,
  [DetectableBrowser.OPERA_MOBILE_]: undefined,
  [DetectableBrowser.VIVALDI_]: /Vivaldi\/((\d+)\.(\d+)\.(\d+)(?:\.(\d+))?)/i,
  [DetectableBrowser.ANDROID_STOCK_]: undefined,
};

/*
 * TODO: The structure below with separate version matches and major version functions is a remnant of
 *  the old browser detection. It should be refactored to resemble AnalyticsOsDetection where there is one version
 *  array function per browser and functions to extract major, minor and patch versions from these arrays.
 */

function matchBrowserVersion(bdWindow: DetectionWindow, browser: DetectableBrowser): RegExpMatchArray | null {
  const browserVersionRegexp = browserVersionRegexpMap[browser];
  if (!browserVersionRegexp) {
    return null;
  }
  return getUserAgent(bdWindow).match(browserVersionRegexp);
}

// Detectable version matches
function chromeVersionMatch(bdWindow: DetectionWindow): string[] {
  const chromeVersionRegex = browserVersionRegexpMap[DetectableBrowser.CHROME_];
  return (chromeVersionRegex && chromeVersionRegex.exec(getUserAgent(bdWindow))) || [];
}

function chromeIOSVersionMatch(bdWindow: DetectionWindow): string[] {
  const chromeIOSVersionRegex = browserVersionRegexpMap[DetectableBrowser.CHROME_IOS_];
  return (chromeIOSVersionRegex && chromeIOSVersionRegex.exec(getUserAgent(bdWindow))) || [];
}

function firefoxVersionMatch(bdWindow: DetectionWindow): RegExpMatchArray | null {
  return matchBrowserVersion(bdWindow, DetectableBrowser.FIREFOX_);
}

function firefoxIOSVersionMatch(bdWindow: DetectionWindow): RegExpMatchArray | null {
  return matchBrowserVersion(bdWindow, DetectableBrowser.FIREFOX_IOS_);
}

function safariVersionMatch(bdWindow: DetectionWindow): RegExpMatchArray | null {
  return matchBrowserVersion(bdWindow, DetectableBrowser.SAFARI_);
}

function operaVersionMatch(bdWindow: DetectionWindow): RegExpMatchArray | null {
  return matchBrowserVersion(bdWindow, DetectableBrowser.OPERA_);
}

function edgeVersionMatch(bdWindow: DetectionWindow): RegExpMatchArray | null {
  return matchBrowserVersion(bdWindow, DetectableBrowser.EDGE_);
}

function edgeChromiumVersionMatch(bdWindow: DetectionWindow): RegExpMatchArray | null {
  return matchBrowserVersion(bdWindow, DetectableBrowser.EDGE_CHROMIUM_);
}

function ieVersionMatch(bdWindow: DetectionWindow): RegExpMatchArray | null {
  return matchBrowserVersion(bdWindow, DetectableBrowser.IE_);
}

function vivaldiVersionMatch(bdWindow: DetectionWindow): RegExpMatchArray | null {
  return matchBrowserVersion(bdWindow, DetectableBrowser.VIVALDI_);
}

// Major version retrieval
function firefoxVersion(bdWindow: DetectionWindow): number {
  const versionMatch = firefoxVersionMatch(bdWindow);
  return versionMatch ? parseFloat(versionMatch[1]) : 0;
}

function firefoxIOSVersion(bdWindow: DetectionWindow): number {
  const versionMatch = firefoxIOSVersionMatch(bdWindow);
  return versionMatch ? parseFloat(versionMatch[1].split('.')[0]) : 0;
}

function safariVersion(bdWindow: DetectionWindow): number {
  const versionMatch = safariVersionMatch(bdWindow);
  return versionMatch ? parseFloat(versionMatch[2].split('.')[0]) : 0;
}

function operaVersion(bdWindow: DetectionWindow): number {
  const versionMatch = operaVersionMatch(bdWindow);
  if (versionMatch && versionMatch[0].indexOf('Opera') > -1) {
    return parseFloat(versionMatch[5]);
  }
  return versionMatch ? parseFloat(versionMatch[2].split('.')[0]) : 0;
}

function edgeVersion(bdWindow: DetectionWindow): number {
  const versionMatch = edgeVersionMatch(bdWindow);
  return versionMatch ? parseFloat(versionMatch[1]) : 0;
}

function edgeChromiumVersion(bdWindow: DetectionWindow): number {
  const versionMatch = edgeChromiumVersionMatch(bdWindow);
  return versionMatch ? parseFloat(versionMatch[1]) : 0;
}

function ieVersion(bdWindow: DetectionWindow): number {
  const versionMatch = ieVersionMatch(bdWindow);
  return versionMatch ? parseFloat(versionMatch[2]) : 0;
}

function vivaldiVersion(bdWindow: DetectionWindow): number {
  const versionMatch = vivaldiVersionMatch(bdWindow);
  return versionMatch ? parseFloat(versionMatch[1]) : 0;
}

export function isKnownBrowser(bdWindow: DetectionWindow): boolean {
  return Boolean(getBrowserName(bdWindow));
}

/*
 * General browser info retrieval
 */

// eslint-disable-next-line complexity
export function getBrowserName(bdWindow: DetectionWindow): string | undefined {
  if (isAndroid(bdWindow)) {
    if (isChrome(bdWindow)) {
      return DetectableBrowser.CHROME_MOBILE_;
    } else if (isFirefox(bdWindow) || isFirefoxMobile(bdWindow)) {
      return DetectableBrowser.FIREFOX_MOBILE_;
    } else if (isEdge(bdWindow)) {
      return DetectableBrowser.EDGE_MOBILE_;
    } else if (isOpera(bdWindow)) {
      return DetectableBrowser.OPERA_MOBILE_;
    } else {
      return DetectableBrowser.ANDROID_STOCK_;
    }
  } else if (isIos(bdWindow)) {
    if (isChrome(bdWindow) || isChromeIOS(bdWindow)) {
      return DetectableBrowser.CHROME_IOS_;
    } else if (isFirefox(bdWindow) || isFirefoxIOS(bdWindow)) {
      return DetectableBrowser.FIREFOX_IOS_;
    } else if (isEdge(bdWindow)) {
      return DetectableBrowser.EDGE_MOBILE_;
    } else if (isSafari(bdWindow) || isSafariMobile(bdWindow)) {
      return DetectableBrowser.SAFARI_MOBILE_;
    } else if (isOpera(bdWindow)) {
      return DetectableBrowser.OPERA_MOBILE_;
    }
  }
  if (isChromium(bdWindow)) {
    return DetectableBrowser.CHROMIUM_;
  } else if (isHeadlessChrome(bdWindow)) {
    return DetectableBrowser.HEADLESS_CHROME_;
  } else if (isChrome(bdWindow)) {
    return DetectableBrowser.CHROME_;
  } else if (isFirefox(bdWindow)) {
    return DetectableBrowser.FIREFOX_;
  } else if (isSafari(bdWindow)) {
    return DetectableBrowser.SAFARI_;
  } else if (isEdge(bdWindow)) {
    return DetectableBrowser.EDGE_;
  } else if (isEdgeChromium(bdWindow)) {
    return DetectableBrowser.EDGE_CHROMIUM_;
  } else if (isInternetExplorer(bdWindow)) {
    return DetectableBrowser.IE_;
  } else if (isOpera(bdWindow)) {
    return DetectableBrowser.OPERA_;
  } else if (isVivaldi(bdWindow)) {
    return DetectableBrowser.VIVALDI_;
  }
  return undefined;
}

export function getBrowserMajorVersion(bdWindow: DetectionWindow): number | undefined {
  if (isVivaldi(bdWindow)) {
    return vivaldiVersion(bdWindow);
  } else if (isChromeIOS(bdWindow)) {
    return Number(chromeIOSVersionMatch(bdWindow)[1]);
  } else if (isChrome(bdWindow)) {
    return Number(chromeVersionMatch(bdWindow)[1]);
  } else if (isFirefox(bdWindow)) {
    return firefoxVersion(bdWindow);
  } else if (isFirefoxMobile(bdWindow)) {
    return firefoxVersion(bdWindow);
  } else if (isFirefoxIOS(bdWindow)) {
    return firefoxIOSVersion(bdWindow);
  } else if (isSafari(bdWindow)) {
    return safariVersion(bdWindow);
  } else if (isEdge(bdWindow)) {
    return edgeVersion(bdWindow);
  } else if (isEdgeChromium(bdWindow)) {
    return edgeChromiumVersion(bdWindow);
  } else if (isInternetExplorer(bdWindow)) {
    return ieVersion(bdWindow);
  } else if (isOpera(bdWindow)) {
    return operaVersion(bdWindow);
  }
  return undefined;
}
