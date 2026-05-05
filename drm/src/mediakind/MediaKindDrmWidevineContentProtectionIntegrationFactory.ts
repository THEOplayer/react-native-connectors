import type { ContentProtectionIntegration, ContentProtectionIntegrationFactory } from 'react-native-theoplayer';
import type { MediaKindDrmConfiguration } from './MediaKindDrmConfiguration';
import { MediaKindDrmWidevineContentProtectionIntegration } from './MediaKindDrmWidevineContentProtectionIntegration';

export class MediaKindDrmWidevineContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
  build(configuration: MediaKindDrmConfiguration): ContentProtectionIntegration {
    return new MediaKindDrmWidevineContentProtectionIntegration(configuration);
  }
}
