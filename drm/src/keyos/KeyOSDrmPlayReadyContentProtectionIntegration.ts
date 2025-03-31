import { ContentProtectionIntegration, LicenseRequest, MaybeAsync, BufferSource } from 'react-native-theoplayer';
import { KeyOSDrmConfiguration } from './KeyOSDrmConfiguration';
import { isKeyOSDrmDRMConfiguration } from './KeyOSDrmUtils';

export class KeyOSDrmPlayReadyContentProtectionIntegration implements ContentProtectionIntegration {
  private readonly contentProtectionConfiguration: KeyOSDrmConfiguration;

  constructor(configuration: KeyOSDrmConfiguration) {
    if (!isKeyOSDrmDRMConfiguration(configuration)) {
      throw new Error('Invalid KeyOSDrmConfiguration.');
    }
    this.contentProtectionConfiguration = configuration;
  }

  onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
    if (!this.contentProtectionConfiguration.playready?.licenseAcquisitionURL) {
      throw new Error('The PlayReady KeyOS license url has not been correctly configured.');
    }
    request.url = this.contentProtectionConfiguration.playready?.licenseAcquisitionURL;
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
