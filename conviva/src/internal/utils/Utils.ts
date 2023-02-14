import {
  Constants,
  ConvivaDeviceMetadata,
  ConvivaMetadata,
  ConvivaOptions,
  ConvivaPlayerInfo
} from '@convivainc/conviva-js-coresdk';
import type { Ad, AdBreak, GoogleImaAd, SourceDescription } from 'react-native-theoplayer';
import type { THEOplayer } from "react-native-theoplayer";
import type { ConvivaConfiguration } from "@theoplayer/react-native-conviva";
import * as ReactNativeTHEOplayerPackage from "react-native-theoplayer/package.json";
import { Platform } from "react-native";

export function collectDeviceMetadata(): ConvivaDeviceMetadata {
  return {
    [Constants.DeviceMetadata.CATEGORY]: Platform.select({
      ios: Constants.DeviceCategory.APPLE_DEVICE,
      web: Constants.DeviceCategory.WEB,
      android: Constants.DeviceCategory.ANDROID_DEVICE,
    })
  };
}

type AdBreakPosition = 'preroll' | 'midroll' | 'postroll';
let adBreakCounter = 1;

export function calculateCurrentAdBreakInfo(adBreak: AdBreak): object | undefined {
  const currentAdBreakTimeOffset = adBreak.timeOffset;
  let currentAdBreakPosition: AdBreakPosition;
  if (currentAdBreakTimeOffset === 0) {
    currentAdBreakPosition = 'preroll';
  } else if (currentAdBreakTimeOffset < 0) {
    currentAdBreakPosition = 'postroll';
  } else {
    currentAdBreakPosition = 'midroll';
  }
  const currentAdBreakIndex = adBreakCounter++;
  // TODO improve types
  return {
    [Constants.POD_POSITION]: currentAdBreakPosition,
    [Constants.POD_DURATION]: adBreak.maxDuration,
    [Constants.POD_INDEX]: currentAdBreakIndex
  };
}

export function calculateConvivaOptions(config: ConvivaConfiguration): ConvivaOptions {
  const options: ConvivaOptions = {};
  if (config.debug) {
    options[Constants.GATEWAY_URL] = config.gatewayUrl;
    options[Constants.LOG_LEVEL] = Constants.LogLevel.DEBUG;
  } else {
    // No need to set GATEWAY_URL and LOG_LEVEL settings for your production release.
    // The Conviva SDK provides the default values for production
  }
  return options;
}

export function collectPlayerInfo(): ConvivaPlayerInfo {
  return {
    [Constants.FRAMEWORK_NAME]: `THEOplayer ReactNative ${Platform.OS}`,
    [Constants.FRAMEWORK_VERSION]: ReactNativeTHEOplayerPackage.version
  };
}

function srcFromSourceDescription(sourceDescription?: SourceDescription) {
  if (!sourceDescription || !sourceDescription.sources) {
    return;
  }
  return srcFromSources(sourceDescription.sources);
}

function isString(parameter: unknown) {
  return typeof parameter === 'string';
}

function isObject(x: unknown) {
  return typeof x === 'object' && x !== null;
}

function isNumber(x: unknown) {
  return typeof x === 'number';
}

function isArrayLike(parameter: any) {
  return isObject(parameter) && {}.hasOwnProperty.call(parameter, 'length') && isNumber(parameter.length);
}

function isTypedSource(parameter: any) {
  return Boolean(isObject(parameter) && isString(parameter.src));
}

function srcFromSources(sources: any): string | undefined {
  if (isString(sources)) {
    return sources;
  }
  if (isTypedSource(sources)) {
    return sources.src;
  }
  if (isArrayLike(sources) && sources.length > 0) {
    return srcFromSources(sources[0]);
  }
  return undefined;
}

export function collectContentMetadata(
  player: THEOplayer,
  configuredContentMetadata: ConvivaMetadata
): ConvivaMetadata {

  // @ts-ignore
  return {
    ...configuredContentMetadata,
    [Constants.STREAM_URL]: srcFromSourceDescription(player.source),
    [Constants.PLAYER_NAME]: 'THEOplayer',
    [Constants.DURATION]: player.duration
  };
}

export function collectAdMetadata(ad: Ad, metadata: ConvivaMetadata): ConvivaMetadata {
  const adMetadata: ConvivaMetadata = {
    [Constants.PLAYER_NAME]: 'THEOplayer',
    [Constants.DURATION]: ad.duration as any,
    [Constants.IS_LIVE]: Constants.StreamType.VOD,
    [Constants.VIEWER_ID]: metadata[Constants.VIEWER_ID]!
  };
  const streamUrl = (ad as GoogleImaAd).mediaUrl || ad.resourceURI;
  if (streamUrl) {
    adMetadata[Constants.STREAM_URL] = streamUrl;
  }
  const assetName = (ad as GoogleImaAd).title || ad.id;
  if (assetName) {
    adMetadata[Constants.ASSET_NAME] = assetName;
  }

  return adMetadata;
}

export function calculateBufferLength(player: THEOplayer): number {
  const buffered = player.buffered;
  if (buffered === undefined) {
    return 0;
  }
  let bufferLength = 0;
  buffered.forEach(range => {
    const start = range.start;
    const end = range.end;
    if (start <= player.currentTime && player.currentTime < end) {
      bufferLength += end - player.currentTime;
    }
  });
  return bufferLength * 1000;
}
