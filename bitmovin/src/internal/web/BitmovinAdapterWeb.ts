import { AnalyticsConfig, DefaultMetadata, SourceMetadata } from '@theoplayer/react-native-analytics-bitmovin';
import { AnalyticsConfig as WebAnalyticsConfig, CollectorConfig, CustomDataValues } from 'bitmovin-analytics';

export function buildWebConfigFromDefaultMetadata(config: AnalyticsConfig, defaultMetadata?: DefaultMetadata): WebAnalyticsConfig {
  return {
    config: {
      backendUrl: config.backendUrl,
      enabled: config.enabled,
      cookiesEnabled: config.cookiesEnabled,
      cookiesDomain: config.cookiesDomain,
      cookiesMaxAge: config.cookiesMaxAge,
      origin: config.origin,
      ssaiEngagementTrackingEnabled: config.ssaiEngagementTrackingEnabled,
    } as CollectorConfig,
    debug: config.logLevel === 'DEBUG',
    key: config.licenseKey,
    deviceType: config.deviceType,
    deviceClass: config.deviceClass,
    player: config.player,
    userId: config.userId,
    customUserId: defaultMetadata.customUserId,
    cdnProvider: defaultMetadata.cdnProvider,
    videoId: config.sourceMetadata?.videoId,
    title: config?.sourceMetadata?.title,
    isLive: config?.sourceMetadata?.isLive,
    ...config?.sourceMetadata?.customData,
  } as WebAnalyticsConfig;
}

export function buildWebConfigFromSourceMetadata(sourceMetadata: SourceMetadata): WebAnalyticsConfig {
  return {
    title: sourceMetadata.title,
    videoId: sourceMetadata.videoId,
    cdnProvider: sourceMetadata.cdnProvider,
    // path: sourceMetadata.path, // Not supported in web SDK
    isLive: sourceMetadata.isLive,
    ...sourceMetadata.customData,
  } as WebAnalyticsConfig;
}

export function buildWebSourceMetadata(sourceMetadata: SourceMetadata): any {
  return {
    ...sourceMetadata,
    customData: {
      ...sourceMetadata.customData,
    } as CustomDataValues,
  };
}
