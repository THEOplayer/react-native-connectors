import type { AgamaConfiguration, AgamaLogLevelType } from '../api/AgamaConfiguration';
import type { Agama, AgamaAbrSessionSourceConfiguration } from './Agama';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AnalyticsDescription, TypedSource } from 'react-native-theoplayer';
import { isString } from './utils/TypeUtils';
import uuid from 'react-native-uuid';
import { isHLSSourceType_ } from './utils/SourceDescriptionUtils';
import type { NetInfoCellularGeneration } from '@react-native-community/netinfo';
import * as manifest from '../static/manifest.json';
import type { AgamaServiceName, AgamaSourceConfiguration, AgamaStreamType } from '../api/AgamaSourceConfiguration';
import type { AgamaAnalyticsIntegrationID } from '../api/AgamaSourceConfiguration';

export const AGAMA_ANALYTICS_INTEGRATION_ID: AgamaAnalyticsIntegrationID = 'agama';
export const EMPCLIENT_INTEGRATION_VERSION = manifest.integrationVersion;
// Should be in format YYYY-MM-DD HH:MM:SS
// e.g. 2019-06-17 17:34:00
export const EMPCLIENT_INTEGRATION_BUILDDATE = manifest.buildDate;

function isAgamaConfiguration(sourceConfiguration: AnalyticsDescription): sourceConfiguration is AgamaSourceConfiguration {
  return sourceConfiguration && sourceConfiguration.integration === AGAMA_ANALYTICS_INTEGRATION_ID;
}

export function isAgamaLogLevelType(logLevel: any): logLevel is AgamaLogLevelType {
  if (!isString(logLevel)) {
    return false;
  }
  return logLevel === 'info' || logLevel === 'debug' || logLevel === 'warning' || logLevel === 'error' || logLevel === 'fatal';
}

export function isAgamaStreamType(streamType: any): streamType is AgamaStreamType {
  if (!isString(streamType)) {
    return false;
  }
  return streamType === 'live' || streamType === 'vod';
}

export function isAgamaServiceName(serviceName: any): serviceName is AgamaServiceName {
  if (!isString(serviceName)) {
    return false;
  }
  return (
    serviceName === 'live' ||
    serviceName === 'svod' ||
    serviceName === 'nvod' ||
    serviceName === 'tvod' ||
    serviceName === 'avod' ||
    serviceName === 'catchuptv'
  );
}

function sanitiseAgamaSourceConfiguration(configuration: AgamaSourceConfiguration): AgamaSourceConfiguration {
  // Mandatory fields
  if (!isString(configuration.asset)) {
    throw new TypeError(`Agama source configuration: expected 'asset' to be a string`);
  }
  if (!isAgamaStreamType(configuration.streamType)) {
    throw new TypeError(`Agama source configuration: expected 'streamType' to be 'live' or 'vod'`);
  }

  // Optional fields
  if (configuration.serviceName !== undefined && !isAgamaServiceName(configuration.serviceName)) {
    throw new TypeError(`Agama source configuration: expected 'serviceName' to be 'live', 'svod', 'nvod',` + `'tvod', 'avod' or 'catchuptv'`);
  }
  if (configuration.cdn !== undefined && !isString(configuration.cdn)) {
    throw new TypeError(`Agama source configuration: expected 'cdn' to be a string`);
  }
  if (configuration.contentTitle !== undefined && !isString(configuration.contentTitle)) {
    throw new TypeError(`Agama source configuration: expected 'contentTitle' to be a string`);
  }
  if (configuration.contentType !== undefined && !isString(configuration.contentType)) {
    throw new TypeError(`Agama source configuration: expected 'contentType' to be a string`);
  }
  if (configuration.contentDescription !== undefined && !isString(configuration.contentDescription)) {
    throw new TypeError(`Agama source configuration: expected 'contentDescription' to be a string`);
  }
  return configuration;
}

function sanitiseAgamaPlayerConfiguration(configuration: AgamaConfiguration): AgamaConfiguration {
  // Mandatory fields
  if (!isString(configuration.config)) {
    throw new TypeError(`Agama player configuration: expected 'config' to be a string`);
  }

  // Optional fields
  if (configuration.logLevel !== undefined && !isAgamaLogLevelType(configuration.logLevel)) {
    throw new TypeError(`Agama player configuration: expected 'logLevel' to be 'info', 'debug', 'warning',` + `'error' or 'fatal'`);
  }
  if (configuration.application !== undefined && !isString(configuration.application)) {
    throw new TypeError(`Agama player configuration: expected 'application' to be a string`);
  }
  if (configuration.applicationVersion !== undefined && !isString(configuration.applicationVersion)) {
    throw new TypeError(`Agama player configuration: expected 'applicationVersion' to be a string`);
  }
  if (configuration.userAccountID !== undefined && !isString(configuration.userAccountID)) {
    throw new TypeError(`Agama player configuration: expected 'userAccountID' to be a string`);
  }
  if (configuration.deviceID !== undefined && !isString(configuration.deviceID)) {
    throw new TypeError(`Agama player configuration: expected 'deviceID' to be a string`);
  }
  return configuration;
}

export function getAgamaSourceConfiguration(analytics: AnalyticsDescription[] = []): AgamaSourceConfiguration | undefined {
  for (const analyticsConfiguration of analytics) {
    if (isAgamaConfiguration(analyticsConfiguration)) {
      return sanitiseAgamaSourceConfiguration(analyticsConfiguration as AgamaSourceConfiguration);
    }
  }
  return undefined;
}

export function getAgamaPlayerConfiguration(analytics: AgamaConfiguration): AgamaConfiguration | undefined {
  return sanitiseAgamaPlayerConfiguration(analytics as AgamaConfiguration);
}

function generateDeviceId(): string {
  return uuid.v4().toString();
}

let deviceId: string | null = null;

export async function getAgamaDeviceId(): Promise<string> {
  // Cached in memory
  if (deviceId) {
    return deviceId;
  }
  // Stored
  try {
    deviceId = await AsyncStorage.getItem('agamaDeviceId');
    if (deviceId) {
      if (__DEBUG__) {
        console.log(`[AGAMA] Retrieved deviceId from local storage: ${deviceId}`);
      }
      return deviceId;
    }
  } catch (_error) {
    console.error('Failed to retrieve deviceId from local storage.');
  }
  // Generate & store
  deviceId = generateDeviceId();
  try {
    await AsyncStorage.setItem('agamaDeviceId', deviceId);
    if (__DEBUG__) {
      console.log(`[AGAMA] Persistently stored deviceId to local storage: ${deviceId}`);
    }
  } catch (error) {
    console.error('Failed to persistently store deviceId.');
  }
  return deviceId;
}

export function generateAgamaAbrConfiguration(
  agama: typeof Agama,
  agamaSource: TypedSource,
  agamaSourceConfiguration: AgamaSourceConfiguration,
): AgamaAbrSessionSourceConfiguration {
  const source: TypedSource = agamaSource;
  const protocolType = mapAgamaProtocolType(agama, source.type);
  const playlistType = mapAgamaSourceConfiguration(agama, agamaSourceConfiguration.streamType);
  return {
    asset: agamaSourceConfiguration.asset,
    playlistType,
    protocol: protocolType,
    uri: source.src,
  } as AgamaAbrSessionSourceConfiguration;
}

export function mapAgamaProtocolType(agama: typeof Agama, type: string | undefined): Agama.DsProtocol {
  if (isHLSSourceType_(type)) {
    return agama.DsProtocol.APPLE_HLS;
  } else {
    return agama.DsProtocol.MPEG_DASH;
  }
}

export function mapAgamaSourceConfiguration(agama: typeof Agama, type: string | undefined): Agama.DsPlaylistType {
  let playListType = agama.DsPlaylistType.VOD;

  if (type === 'live') {
    playListType = agama.DsPlaylistType.LIVE;
  }

  return playListType;
}

export function mapAgamaLogLevel(agama: typeof Agama, type: AgamaLogLevelType | undefined): Agama.LogLevel {
  switch (type) {
    case 'info':
      return agama.LogLevel.INFO;
    case 'debug':
      return agama.LogLevel.DEBUG;
    case 'warning':
      return agama.LogLevel.WARNING;
    case 'error':
      return agama.LogLevel.ERROR;
    default:
      return agama.LogLevel.FATAL;
  }
}

export function mapAgamaMobileConnectionType(type: NetInfoCellularGeneration | null): string | undefined {
  switch (type) {
    case '3g':
      return 'mobile/3G';
    case '4g':
      return 'mobile/4G';
    case '5g':
      return 'mobile/5G';
    default:
      return undefined;
  }
}
