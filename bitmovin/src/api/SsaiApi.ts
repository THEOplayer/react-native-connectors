import { CustomData } from './CustomData';

export type SsaiAdQuartile = 'first' | 'midpoint' | 'third' | 'completed';

export type SsaiAdQuartileMetadata = {
  failedBeaconUrl?: string;
};

export type SsaiAdMetadata = {
  adId?: string;
  adSystem?: string;
  customData?: CustomData;
};

export type AdPosition = 'preroll' | 'midroll' | 'postroll';

export interface SsaiAdBreakMetadata {
  adPosition?: AdPosition;
}

/**
 * Interface for Server-Side Ad Insertion (SSAI) related API methods.
 */
export interface SsaiApi {
  /**
   * Notify the connector that an adBreak has started.
   *
   * @param adBreakMetadata
   */
  adBreakStart(adBreakMetadata?: SsaiAdBreakMetadata): void;

  /**
   * Notify the connector that an ad has started.
   *
   * @param adMetadata
   */
  adStart(adMetadata?: SsaiAdMetadata): void;

  /**
   * Notify the connector that a specific ad quartile has been reached.
   *
   * @param adQuartile
   * @param adQuartileMetadata
   */
  adQuartileFinished(adQuartile: SsaiAdQuartile, adQuartileMetadata?: SsaiAdQuartileMetadata): void;

  /**
   * Notify the connector that an adBreak has ended.
   */
  adBreakEnd(): void;
}
