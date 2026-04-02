import {
  SsaiApi as BitmovinSsaiApi,
  AdPosition as BitmovinAdPosition,
  CustomDataValues as BitmovinCustomDataValues,
  SsaiAdQuartile as BitmovinSsaiAdQuartile,
} from 'bitmovin-analytics';
import { SsaiAdBreakMetadata, SsaiAdMetadata, SsaiAdQuartile, SsaiAdQuartileMetadata, SsaiApi } from '../../api/SsaiApi';

export class BitmovinSsaiAdapterWeb implements SsaiApi {
  constructor(private readonly _ssai: BitmovinSsaiApi) {}

  adBreakStart(adBreakMetadata?: SsaiAdBreakMetadata): void {
    this._ssai.adBreakStart({
      adPosition: adBreakMetadata?.adPosition as BitmovinAdPosition,
    });
  }

  adStart(adMetadata?: SsaiAdMetadata): void {
    this._ssai.adStart({
      adId: adMetadata?.adId,
      adSystem: adMetadata?.adSystem,
      customData: adMetadata?.customData as BitmovinCustomDataValues,
    });
  }

  adQuartileFinished(adQuartile: SsaiAdQuartile, adQuartileMetadata?: SsaiAdQuartileMetadata): void {
    this._ssai.adQuartileFinished(adQuartile as BitmovinSsaiAdQuartile, {
      failedBeaconUrl: adQuartileMetadata?.failedBeaconUrl,
    });
  }

  adBreakEnd(): void {
    this._ssai.adBreakEnd();
  }
}
