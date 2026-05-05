import type {
  CertificateRequest,
  CertificateResponse,
  ContentProtectionIntegration,
  LicenseRequest,
  LicenseResponse,
  MaybeAsync,
} from 'react-native-theoplayer';
import {
  fromUint8ArrayToString,
  fromBase64StringToUint8Array,
  fromStringToUint8Array,
  fromUint8ArrayToBase64String,
  BufferSource,
} from 'react-native-theoplayer';
import type { MediaKindDrmConfiguration } from './MediaKindDrmConfiguration';
import { getFairplayCertificateURL, getFairplayLicenseAcquisitionURL } from '../utils/drmUtils';

export class MediaKindDrmFairplayContentProtectionIntegration implements ContentProtectionIntegration {
  static readonly DEFAULT_CERTIFICATE_URL = 'insert default certificate url here';
  static readonly DEFAULT_LICENSE_URL = 'insert default license url here';

  private readonly contentProtectionConfiguration: MediaKindDrmConfiguration;
  private contentId: string | undefined = undefined;

  constructor(configuration: MediaKindDrmConfiguration) {
    this.contentProtectionConfiguration = configuration;
  }

  onCertificateRequest(request: CertificateRequest): MaybeAsync<Partial<CertificateRequest> | BufferSource> {
    request.url = getFairplayCertificateURL(
      this.contentProtectionConfiguration,
      MediaKindDrmFairplayContentProtectionIntegration.DEFAULT_CERTIFICATE_URL,
    );
    return request;
  }

  onCertificateResponse(response: CertificateResponse): MaybeAsync<BufferSource> {
    let certificate = fromUint8ArrayToString(response.body);
    const match = certificate.match(/<cert>([\s\S]*?)<\/cert>/);
    if (match) {
      certificate = match[1].replace(/\s/g, '');
    }
    return fromBase64StringToUint8Array(certificate);
  }

  onLicenseRequest(request: LicenseRequest): MaybeAsync<Partial<LicenseRequest> | BufferSource> {
    request.url = getFairplayLicenseAcquisitionURL(
      this.contentProtectionConfiguration,
      MediaKindDrmFairplayContentProtectionIntegration.DEFAULT_LICENSE_URL,
    );
    if (request.body !== null) {
      let spc = fromUint8ArrayToBase64String(request.body);
      request.body = fromStringToUint8Array(spc);
    }
    return request;
  }

  onLicenseResponse(response: LicenseResponse): MaybeAsync<BufferSource> {
    let license = fromUint8ArrayToString(response.body);
    const match = license.match(/<ckc>([\s\S]*?)<\/ckc>/);
    if (match) {
      license = match[1].replace(/\s/g, '');
    }
    return fromBase64StringToUint8Array(license);
  }

  extractFairplayContentId(skdUrl: string): string {
    // skdUrl without the "skd://" scheme
    this.contentId = skdUrl.substring(6);
    return this.contentId;
  }
}
