import type { THEOplayer } from 'react-native-theoplayer';
import { AdBreakInit, AdInit } from 'theoplayer';

export class ClientsideAdBeaconingConnectorAdapter {
  constructor(player: THEOplayer) {
    console.log('ClientsideAdBeaconingConnectorAdapter constructor called');
  }

  createAdBreak(adBreakId: string, adBreakInit: AdBreakInit): void {
    console.log('ClientsideAdBeaconingConnectorAdapter createAdBreak called for adBreakId:', adBreakId, 'with adBreakInit:', adBreakInit);
  }

  createAd(adId: string, adInit: AdInit): void {
    console.log('ClientsideAdBeaconingConnectorAdapter createAd called for adId:', adId, 'with adInit:', adInit);
  }

  beginAd(adId: string): void {
    console.log('ClientsideAdBeaconingConnectorAdapter beginAd called for adId:', adId);
  }

  endAd(adId: string): void {
    console.log('ClientsideAdBeaconingConnectorAdapter endAd called for adId:', adId);
  }

  removeAd(adId: string): void {
    console.log('ClientsideAdBeaconingConnectorAdapter removeAd called for adId:', adId);
  }

  removeAdBreak(adBreakId: string): void {
    console.log('ClientsideAdBeaconingConnectorAdapter removeAdBreak called for adBreakId:', adBreakId);
  }

  destroy() {
    console.log('ClientsideAdBeaconingConnectorAdapter destroy called');
  }
}
