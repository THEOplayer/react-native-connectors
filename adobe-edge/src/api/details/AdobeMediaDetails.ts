import type { AdobeSessionDetails } from './AdobeSessionDetails';
import type { AdobeQoeDataDetails } from './AdobeQoeDataDetails';
import type { AdobeCustomMetadataDetails } from './AdobeCustomMetadataDetails';
import type { AdobeAdvertisingDetails } from './AdobeAdvertisingDetails';
import type { AdobeAdvertisingPodDetails } from './AdobeAdvertisingPodDetails';
import type { AdobeChapterDetails } from './AdobeChapterDetails';
import type { AdobeErrorDetails } from './AdobeErrorDetails';
import type { AdobePlayerStateData } from './AdobePlayerStateData';

/**
 * Media details information.
 *
 * https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/mediadetails.schema.md
 */
export interface AdobeMediaDetails {
  // If the content is live, the playhead must be the current second of the day, 0 <= playhead < 86400.
  // If the content is recorded, the playhead must be the current second of content, 0 <= playhead < content length.
  playhead?: number;

  // Identifies an instance of a content stream unique to an individual playback.
  sessionID?: string;

  // Session details information related to the experience event.
  sessionDetails?: AdobeSessionDetails;

  // Advertising details information related to the experience event.
  advertisingDetails?: AdobeAdvertisingDetails;

  // Advertising Pod details information
  advertisingPodDetails?: AdobeAdvertisingPodDetails;

  // Chapter details information related to the experience event.
  chapterDetails?: AdobeChapterDetails;

  // Error details information related to the experience event.
  errorDetails?: AdobeErrorDetails;

  // Qoe data details information related to the experience event.
  qoeDataDetails?: AdobeQoeDataDetails;

  // The list of states start.
  statesStart?: AdobePlayerStateData[];

  // The list of states end.
  statesEnd?: AdobePlayerStateData[];

  // The list of states.
  states?: AdobePlayerStateData[];

  // The list of custom metadata.
  customMetadata?: AdobeCustomMetadataDetails[];
}
