import type { DRMConfiguration } from 'react-native-theoplayer';

/**
 * The identifier of the MediaKind integration.
 */
export type MediaKindIntegrationID = 'mediakind';

/**
 * Describes the configuration of the MediaKind DRM integration.
 *
 * ```
 * const drmConfiguration = {
 *      integration : 'mediakind',
 *      fairplay: {
 *          certificateURL: 'yourMediaKindCertificateUrl',
 *          licenseAcquisitionURL: 'yourMediaKindLicenseAcquisitionURL'
 *      }
 * }
 * ```
 */
export interface MediaKindDrmConfiguration extends DRMConfiguration {
  /**
   * The identifier of the DRM integration.
   */
  integration: MediaKindIntegrationID;
}
