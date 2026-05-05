import type { CertificateRequest, ContentProtectionIntegration, LicenseRequest, MaybeAsync } from 'react-native-theoplayer';
import { BufferSource } from 'react-native-theoplayer';
import type { MediaKindDrmConfiguration } from './MediaKindDrmConfiguration';
import { getPlayReadyLicenseAcquisitionURL } from '../utils/drmUtils';

export class MediaKindDrmPlayReadyContentProtectionIntegration implements ContentProtectionIntegration {
  static readonly DEFAULT_CERTIFICATE_URL = 'insert default certificate url here';
  static readonly DEFAULT_LICENSE_URL = 'insert default license url here';

  private readonly contentProtectionConfiguration: MediaKindDrmConfiguration;

  constructor(configuration: MediaKindDrmConfiguration) {
    this.contentProtectionConfiguration = configuration;
  }

  onCertificateRequest(request: CertificateRequest): MaybeAsync<Partial<CertificateRequest> | BufferSource> {
    request.url = getPlayReadyLicenseAcquisitionURL(
      this.contentProtectionConfiguration,
      MediaKindDrmPlayReadyContentProtectionIntegration.DEFAULT_CERTIFICATE_URL,
    );
    return request;
  }

  onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
    request.url = getPlayReadyLicenseAcquisitionURL(
      this.contentProtectionConfiguration,
      MediaKindDrmPlayReadyContentProtectionIntegration.DEFAULT_LICENSE_URL,
    );
    return request;
  }
}
