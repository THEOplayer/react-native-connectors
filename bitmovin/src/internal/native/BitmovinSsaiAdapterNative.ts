import { SsaiAdBreakMetadata, SsaiAdMetadata, SsaiAdQuartile, SsaiAdQuartileMetadata, SsaiApi } from '../../api/SsaiApi';
import type { NativeHandleType } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';

const TAG = 'BitmovinSsaiAdapter';
const ERROR_MSG = 'BitmovinSsaiAdapter Error';

export class BitmovinSsaiAdapter implements SsaiApi {
  constructor(private readonly nativeHandle: NativeHandleType) {}

  adBreakStart(adBreakMetadata?: SsaiAdBreakMetadata): void {
    try {
      NativeModules.BitmovinModule.adBreakStart(this.nativeHandle, adBreakMetadata);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  adStart(adMetadata?: SsaiAdMetadata): void {
    try {
      NativeModules.BitmovinModule.adStart(this.nativeHandle, adMetadata);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  adQuartileFinished(adQuartile: SsaiAdQuartile, adQuartileMetadata?: SsaiAdQuartileMetadata): void {
    try {
      NativeModules.BitmovinModule.adQuartileFinished(this.nativeHandle, adQuartile, adQuartileMetadata);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  adBreakEnd(): void {
    try {
      NativeModules.BitmovinModule.adBreakEnd(this.nativeHandle);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }
}
