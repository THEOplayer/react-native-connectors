// This interface represents all properties required on window.navigator to perform browser, OS and device detection.
export interface DetectionNavigator {
  userAgent?: string;
  vendor?: string;
  msMaxTouchPoints?: number;
  maxTouchPoints?: number;
}

// This interface represents all properties required on window to perform browser, OS and device detection.
export interface DetectionWindow {
  navigator?: DetectionNavigator;
  chrome?: any;
  ActiveXObject?: any;
  DocumentTouch?: any;
  ontouchstart?: any;
  screenX?: number;
}

export function getUserAgent(bdWindow: DetectionWindow): string {
  return (bdWindow.navigator && bdWindow.navigator.userAgent) || '';
}

export interface DetectionRegexpMap {
  [detectableProperty: string]: RegExp | undefined;
}
