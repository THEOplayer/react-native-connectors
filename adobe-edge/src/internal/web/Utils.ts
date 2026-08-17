import type { AdobeEdgeWebConfig } from '@theoplayer/react-native-analytics-adobe-edge';

const PROP_NA = 'NA';

/**
 * The Adobe VA Edge API only accepts playhead values in the range [0, 86400] seconds.
 * Values outside this range are rejected with a 400 Bad Request.
 */
const MAX_PLAYHEAD_SEC = 86400;

/**
 * Clamp a playhead value to the range accepted by the Adobe VA Edge API.
 */
function clampPlayhead(playheadSec: number): number {
  return Math.min(MAX_PLAYHEAD_SEC, Math.max(0, playheadSec));
}

/**
 * Sanitise the current media length.
 *
 * - In case of a live stream, set it to 24h.
 */
export function sanitiseContentLength(mediaLengthSec: number): number {
  return mediaLengthSec === Infinity ? 86400 : Math.trunc(mediaLengthSec);
}

/**
 * Sanitise the current playhead in seconds. Adobe expects an integer value in the range [0, 86400].
 *
 * - If undefined or NaN, set it to 0.
 * - If infinite (live stream), set it to the current second of the day.
 * - Otherwise clamp it to the range [0, 86400] accepted by the Adobe VA Edge API. Some platforms
 *   (e.g. Samsung Tizen) report the playhead of a live stream as an absolute presentation
 *   timestamp, which far exceeds the accepted range.
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
    return clampPlayhead(date.getSeconds() + 60 * (date.getMinutes() + 60 * date.getHours()));
  }
  return clampPlayhead(Math.trunc(playheadInSec));
}

export function sanitiseNumber(v?: number): number {
  if (v === undefined || v === null || Number.isNaN(v)) {
    return 0;
  }
  return Math.trunc(v);
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
