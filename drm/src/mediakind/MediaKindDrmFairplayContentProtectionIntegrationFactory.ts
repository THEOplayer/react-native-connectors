import type { ContentProtectionIntegration, ContentProtectionIntegrationFactory } from 'react-native-theoplayer';
import type { MediaKindDrmConfiguration } from './MediaKindDrmConfiguration';
import { MediaKindDrmFairplayContentProtectionIntegration } from './MediaKindDrmFairplayContentProtectionIntegration';

export class MediaKindDrmFairplayContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
  build(configuration: MediaKindDrmConfiguration): ContentProtectionIntegration {
    return new MediaKindDrmFairplayContentProtectionIntegration(configuration);
  }
}
