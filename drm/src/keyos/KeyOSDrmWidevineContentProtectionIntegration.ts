import { ContentProtectionIntegration, LicenseRequest, MaybeAsync, BufferSource } from 'react-native-theoplayer';
import { KeyOSDrmConfiguration } from './KeyOSDrmConfiguration';
import { isKeyOSDrmDRMConfiguration } from './KeyOSDrmUtils';

export class KeyOSDrmWidevineContentProtectionIntegration implements ContentProtectionIntegration {
  private readonly contentProtectionConfiguration: KeyOSDrmConfiguration;

  constructor(configuration: KeyOSDrmConfiguration) {
    if (!isKeyOSDrmDRMConfiguration(configuration)) {
      throw new Error('Invalid KeyOSDrmConfiguration.');
    }
    this.contentProtectionConfiguration = configuration;
  }

  onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
    if (!this.contentProtectionConfiguration.widevine?.licenseAcquisitionURL) {
      throw new Error('The Widevine KeyOS license url has not been correctly configured.');
    }
    request.url = this.contentProtectionConfiguration.widevine?.licenseAcquisitionURL;
    const authorization = this.contentProtectionConfiguration.integrationParameters?.['x-keyos-authorization'];
    if (authorization !== undefined) {
      request.headers = {
        ...request.headers,
        'x-keyos-authorization': authorization,
      };
    }
    return request;
  }
}
