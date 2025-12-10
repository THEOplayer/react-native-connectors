import { AdobeEdgeMobileConfig } from './AdobeEdgeMobileConfig';
import { AdobeEdgeWebConfig } from './AdobeEdgeWebConfig';

export interface AdobeEdgeConfig {
  /**
   */
  mobileConfig?: AdobeEdgeMobileConfig;

  /**
   *
   */
  webConfig?: AdobeEdgeWebConfig;
}
