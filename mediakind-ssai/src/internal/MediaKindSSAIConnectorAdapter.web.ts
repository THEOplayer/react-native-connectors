import type { THEOplayer } from 'react-native-theoplayer';
import { AdBreakInit, AdInit } from 'theoplayer';

export class MediaKindSSAIConnectorAdapter {
  constructor(player: THEOplayer) {
    console.log('MediaKindSSAIConnectorAdapter constructor called');
  }

  createAdBreak(adBreakId: string, adBreakInit: AdBreakInit): void {
    console.log('MediaKindSSAIConnectorAdapter createAdBreak called for adBreakId:', adBreakId, 'with adBreakInit:', adBreakInit);
  }

  createAd(adId: string, adInit: AdInit): void {
    console.log('MediaKindSSAIConnectorAdapter createAd called for adId:', adId, 'with adInit:', adInit);
  }

  beginAd(adId: string): void {
    console.log('MediaKindSSAIConnectorAdapter beginAd called for adId:', adId);
  }

  endAd(adId: string): void {
    console.log('MediaKindSSAIConnectorAdapter endAd called for adId:', adId);
  }

  removeAd(adId: string): void {
    console.log('MediaKindSSAIConnectorAdapter removeAd called for adId:', adId);
  }

  removeAdBreak(adBreakId: string): void {
    console.log('MediaKindSSAIConnectorAdapter removeAdBreak called for adBreakId:', adBreakId);
  }

  destroy() {
    console.log('MediaKindSSAIConnectorAdapter destroy called');
  }
}
