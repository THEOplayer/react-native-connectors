import type { ContentProtectionIntegration, ContentProtectionIntegrationFactory } from 'react-native-theoplayer';
import type { MediaKindDrmConfiguration } from './MediaKindDrmConfiguration';
import { MediaKindDrmPlayReadyContentProtectionIntegration } from './MediaKindDrmPlayReadyContentProtectionIntegration';

export class MediaKindDrmPlayReadyContentProtectionIntegrationFactory implements ContentProtectionIntegrationFactory {
  build(configuration: MediaKindDrmConfiguration): ContentProtectionIntegration {
    return new MediaKindDrmPlayReadyContentProtectionIntegration(configuration);
  }
}
