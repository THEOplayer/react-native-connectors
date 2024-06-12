import { DetectionWindow, getUserAgent } from './web/DetectionUtils';
import { isKnownBrowser } from './web/AnalyticsBrowserDetection';

export enum DetectableDeviceType {
  PC_ = 'pc',
  CONSOLE_ = 'console',
  SETTOP_ = 'settop',
  MOBILE_ = 'mobile',
  TABLET_ = 'tablet',
  SMARTTV_ = 'smarttv',
  SEARCH_BOT_ = 'searchbot',
}

// Device regexes partly based on https://github.com/rguerreiro/device/blob/master/lib/device.js
export function getDeviceType(deviceDetectionWindow: DetectionWindow): DetectableDeviceType | undefined {
  const userAgent = getUserAgent(deviceDetectionWindow);
  if (userAgent.match(/CrKey|Roku|AFTS|AppleTV|Nexus Player/i)) {
    return DetectableDeviceType.SETTOP_;
  } else if (userAgent.match(/Xbox|Playstation|Wii|Nintendo/i)) {
    return DetectableDeviceType.CONSOLE_;
  } else if (/(iPad|Tablet|(Android(?!.*Mobi))|(Windows(?!.*Phone)(.*Touch))|Kindle|Playbook|Silk|(Puffin(?!.*(IP|AP|WP))))/i.test(userAgent)) {
    return DetectableDeviceType.TABLET_;
  } else if (/Mobi/.test(userAgent)) {
    return DetectableDeviceType.MOBILE_;
  } else if (userAgent.match(/GoogleTV|SmartTV|SMART-TV|Internet TV|NetCast|NETTV|boxee|Kylo|DLNADOC|hbbtv|CE-HTML/i)) {
    return DetectableDeviceType.SMARTTV_;
  } else if (userAgent.match(/(nuhk|Googlebot|bingbot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/i)) {
    return DetectableDeviceType.SEARCH_BOT_;
  } else if (isKnownBrowser(deviceDetectionWindow)) {
    return DetectableDeviceType.PC_;
  }
  return undefined;
}
