import { AdobeEdgeMobileConfig } from './AdobeEdgeMobileConfig';
import { AdobeEdgeWebConfig } from './AdobeEdgeWebConfig';

export interface AdobeEdgeConfig {
  /**
   * Configuration for Adobe Edge on mobile platforms.
   */
  mobile?: AdobeEdgeMobileConfig;

  /**
   * Configuration for Adobe Edge on web platforms.
   */
  web?: AdobeEdgeWebConfig;
}
