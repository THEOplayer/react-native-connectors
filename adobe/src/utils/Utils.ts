import type { Ad, AdBreak } from "react-native-theoplayer";
import type { AdobeEventRequestBody } from "../internal/Types";

export function calculateAdBreakBeginMetadata(adBreak: AdBreak, lastPodIndex: number): AdobeEventRequestBody {
  const currentAdBreakTimeOffset = adBreak.timeOffset;
  let podIndex: number;
  if (currentAdBreakTimeOffset === 0) {
    podIndex = 0;
  } else if (currentAdBreakTimeOffset < 0) {
    podIndex = -1;
  } else {
    podIndex = lastPodIndex++;
  }

  return {
    params: {
      'media.ad.podIndex': podIndex,
      'media.ad.podSecond': adBreak.maxDuration
    }
  };
}

export function calculateAdBeginMetadata(ad: Ad, adPodPosition: number): AdobeEventRequestBody {
  return {
    params: {
      'media.ad.podPosition': adPodPosition,
      'media.ad.id': ad.id,
      'media.ad.length': ad.duration,
      'media.ad.playerName': 'THEOplayer'
    }
  }
}
