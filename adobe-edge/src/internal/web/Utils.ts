import type { Ad, AdBreak, TextTrackCue } from 'react-native-theoplayer';
import type { AdobeAdvertisingDetails, AdobeAdvertisingPodDetails, AdobeChapterDetails } from '@theoplayer/react-native-analytics-adobe-edge';

export function sanitisePlayhead(playheadInMsec?: number): number {
  if (!playheadInMsec) {
    return 0;
  }
  if (playheadInMsec === Infinity) {
    // If content is live, the playhead must be the current second of the day.
    const date = new Date();
    return date.getSeconds() + 60 * (date.getMinutes() + 60 * date.getHours());
  }
  return Math.trunc(playheadInMsec / 1000);
}

/**
 * Sanitise the current media length in seconds.
 *
 * - In case of a live stream, set it to 24h.
 */
export function sanitiseContentLength(mediaLengthMsec: number): number {
  return mediaLengthMsec === Infinity ? 86400 : Math.trunc(1e-3 * mediaLengthMsec);
}

export function calculateAdvertisingPodDetails(adBreak: AdBreak, lastPodIndex: number): AdobeAdvertisingPodDetails {
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
    index: podIndex ?? 0,
    offset: Math.trunc(currentAdBreakTimeOffset),
  };
}

export function calculateAdvertisingDetails(ad: Ad, podPosition: number): AdobeAdvertisingDetails {
  return {
    podPosition,
    length: ad.duration ? Math.trunc(ad.duration) : 0,
    name: 'NA', // TODO
    playerName: 'THEOplayer',
  };
}

export function calculateChapterDetails(cue: TextTrackCue): AdobeChapterDetails {
  const id = Number(cue.id);
  const index = isNaN(id) ? 0 : id;
  return {
    length: Math.trunc((cue.endTime - cue.startTime) / 1000),
    offset: Math.trunc(cue.startTime / 1000),
    index,
  };
}
