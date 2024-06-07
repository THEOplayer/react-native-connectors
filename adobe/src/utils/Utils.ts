import type { Ad, AdBreak, TextTrackCue } from 'react-native-theoplayer';
import type { AdobeMetaData } from '../internal/Types';

export function calculateAdBreakBeginMetadata(adBreak: AdBreak, lastPodIndex: number): AdobeMetaData {
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
      'media.ad.podSecond': adBreak.maxDuration,
    },
  };
}

export function calculateAdBeginMetadata(ad: Ad, adPodPosition: number): AdobeMetaData {
  return {
    params: {
      'media.ad.podPosition': adPodPosition,
      'media.ad.id': ad.id,
      'media.ad.length': ad.duration,
      'media.ad.playerName': 'THEOplayer',
    },
  };
}

export function calculateChapterStartMetadata(cue: TextTrackCue): AdobeMetaData {
  const id = Number(cue.id);
  const index = isNaN(id) ? 0 : id;
  return {
    params: {
      'media.chapter.length': (cue.endTime - cue.startTime) / 1000,
      'media.chapter.offset': cue.startTime / 1000,
      'media.chapter.index': index,
    },
  };
}
