import type {
  DRMConfiguration,
  FairPlayKeySystemConfiguration,
  WidevineKeySystemConfiguration,
  PlayReadyKeySystemConfiguration,
  KeySystemConfiguration,
} from 'react-native-theoplayer';

/**
 * Appends query parameters to a URL, merging global DRM-level params with key-system-specific params.
 * Key-system-specific params take precedence over global params; no duplicate keys are added.
 *
 * @param url - The base URL to append query parameters to.
 * @param config - The top-level DRMConfiguration containing optional global `queryParameters`.
 * @param keySystemConfig - The key-system-specific configuration containing optional `queryParameters`.
 * @returns The URL with merged query parameters appended.
 */
function appendQueryParameters(url: string, config: DRMConfiguration, keySystemConfig: KeySystemConfiguration | undefined): string {
  const merged: { [key: string]: any } = {
    ...config.queryParameters,
    ...keySystemConfig?.queryParameters,
  };

  const entries = Object.entries(merged);
  if (entries.length === 0) {
    return url;
  }

  const separator = url.includes('?') ? '&' : '?';
  const queryString = entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
  return `${url}${separator}${queryString}`;
}

/**
 * Returns the FairPlay certificate URL from the DRM configuration with query parameters appended.
 *
 * @param config - The DRM configuration.
 * @param defaultUrl - Fallback URL if no certificateURL is set on the fairplay config.
 * @returns The resolved certificate URL with merged query parameters.
 */
export function getFairplayCertificateURL(config: DRMConfiguration & { fairplay?: FairPlayKeySystemConfiguration }, defaultUrl: string): string {
  const baseUrl = config.fairplay?.certificateURL ?? defaultUrl;
  return appendQueryParameters(baseUrl, config, config.fairplay);
}

/**
 * Returns the FairPlay license acquisition URL from the DRM configuration with query parameters appended.
 *
 * @param config - The DRM configuration.
 * @param defaultUrl - Fallback URL if no licenseAcquisitionURL is set on the fairplay config.
 * @returns The resolved license acquisition URL with merged query parameters.
 */
export function getFairplayLicenseAcquisitionURL(
  config: DRMConfiguration & { fairplay?: FairPlayKeySystemConfiguration },
  defaultUrl: string,
): string {
  const baseUrl = config.fairplay?.licenseAcquisitionURL ?? defaultUrl;
  return appendQueryParameters(baseUrl, config, config.fairplay);
}

/**
 * Returns the Widevine license acquisition URL from the DRM configuration with query parameters appended.
 *
 * @param config - The DRM configuration.
 * @param defaultUrl - Fallback URL if no licenseAcquisitionURL is set on the widevine config.
 * @returns The resolved license acquisition URL with merged query parameters.
 */
export function getWidevineLicenseAcquisitionURL(
  config: DRMConfiguration & { widevine?: WidevineKeySystemConfiguration },
  defaultUrl: string,
): string {
  const baseUrl = config.widevine?.licenseAcquisitionURL ?? defaultUrl;
  return appendQueryParameters(baseUrl, config, config.widevine);
}

/**
 * Returns the PlayReady license acquisition URL from the DRM configuration with query parameters appended.
 *
 * @param config - The DRM configuration.
 * @param defaultUrl - Fallback URL if no licenseAcquisitionURL is set on the playready config.
 * @returns The resolved license acquisition URL with merged query parameters.
 */
export function getPlayReadyLicenseAcquisitionURL(
  config: DRMConfiguration & { playready?: PlayReadyKeySystemConfiguration },
  defaultUrl: string,
): string {
  const baseUrl = config.playready?.licenseAcquisitionURL ?? defaultUrl;
  return appendQueryParameters(baseUrl, config, config.playready);
}
