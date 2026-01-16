import type { AdobeEdgeWebConfig } from '@theoplayer/react-native-analytics-adobe-edge';

const PROP_NA = 'NA';

/**
 * Sanitise the current media length.
 *
 * - In case of a live stream, set it to 24h.
 */
export function sanitiseContentLength(mediaLengthSec: number): number {
  return mediaLengthSec === Infinity ? 86400 : Math.trunc(mediaLengthSec);
}

/**
 * Sanitise the current playhead in seconds. Adobe expects an integer value.
 *
 * - If undefined or NaN, set it to 0.
 * - If infinite (live stream), set it to the current second of the day.
 *
 * @param playheadInSec
 * @param mediaLengthSec
 */
export function sanitisePlayhead(playheadInSec?: number, mediaLengthSec?: number): number {
  if (!playheadInSec || isNaN(playheadInSec) || !mediaLengthSec) {
    return 0;
  }
  if (mediaLengthSec === Infinity) {
    // If content is live, the playhead must be the current second of the day.
    const date = new Date();
    return date.getSeconds() + 60 * (date.getMinutes() + 60 * date.getHours());
  }
  return Math.trunc(playheadInSec);
}

export function isValidDuration(v: number | undefined): boolean {
  return v !== undefined && !Number.isNaN(v);
}

export function sanitiseChapterId(id?: string): string {
  if (!id || id.trim().length === 0) {
    return PROP_NA;
  }
  return id;
}

export function idToInt(id?: string, otherwise: number = 0): number {
  const intId = Number(id);
  return isNaN(intId) ? otherwise : intId;
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
