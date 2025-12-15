import type { Ad, AdBreak, TextTrackCue } from 'react-native-theoplayer';
import type {
  AdobeAdvertisingDetails,
  AdobeAdvertisingPodDetails,
  AdobeChapterDetails,
  AdobeEdgeWebConfig,
} from '@theoplayer/react-native-analytics-adobe-edge';

/**
 * Sanitise the current playhead in seconds. Adobe expects an integer value.
 *
 * - If undefined or NaN, set it to 0.
 * - If infinite (live stream), set it to the current second of the day.
 *
 * @param playheadInSec
 */
export function sanitisePlayhead(playheadInSec?: number): number {
  if (!playheadInSec || isNaN(playheadInSec)) {
    return 0;
  }
  if (playheadInSec === Infinity) {
    // If content is live, the playhead must be the current second of the day.
    const date = new Date();
    return date.getSeconds() + 60 * (date.getMinutes() + 60 * date.getHours());
  }
  return Math.trunc(playheadInSec);
}

/**
 * Sanitise the current media length.
 *
 * - In case of a live stream, set it to 24h.
 */
export function sanitiseContentLength(mediaLengthSec: number): number {
  return mediaLengthSec === Infinity ? 86400 : Math.trunc(mediaLengthSec);
}

export function sanitiseConfig(config: AdobeEdgeWebConfig): AdobeEdgeWebConfig {
  return {
    ...config,
    streamingMedia: {
      ...config.streamingMedia,
      channel: config.streamingMedia?.channel || 'defaultChannel',
      playerName: config.streamingMedia?.playerName || 'THEOplayer',
    },
  };
}

export function isValidDuration(v: number | undefined): boolean {
  return v !== undefined && !Number.isNaN(v);
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
    name: 'NA',
    playerName: 'THEOplayer',
  };
}

export function calculateChapterDetails(cue: TextTrackCue): AdobeChapterDetails {
  const id = Number(cue.id);
  const index = isNaN(id) ? 0 : id;
  return {
    length: Math.trunc(cue.endTime - cue.startTime),
    offset: Math.trunc(cue.startTime),
    index,
  };
}
