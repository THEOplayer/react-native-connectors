export interface AdobeRequestBody {
  events?: {
    xdm: {
      mediaCollection: {
        playhead: number;
        sessionDetails: {
          adLoad?: string;
          /** @description The SDK version used by the player. This could have any custom value that makes sense for your player */
          appVersion?: string;
          artist?: string;
          /** @description Rating as defined by TV Parental Guidelines */
          rating?: string;
          /** @description Program/Series Name. Program Name is required only if the show is part of a series. */
          show?: string;
          /** @description Distribution Station/Channels or where the content is played. Any string value is accepted here */
          channel: string;
          /** @description The number of the episode */
          episode?: string;
          /** @description Creator of the content */
          originator?: string;
          /** @description The date when the content first aired on television. Any date format is acceptable, but Adobe recommends: YYYY-MM-DD */
          firstAirDate?: string;
          /**
           * @description Identifies the stream type
           * @enum {string}
           */
          streamType?: 'audio' | 'video';
          /** @description The user has been authorized via Adobe authentication */
          authorized?: string;
          hasResume?: boolean;
          /** @description Format of the stream (HD, SD) */
          streamFormat?: string;
          /** @description Name / ID of the radio station */
          station?: string;
          /** @description Type or grouping of content as defined by content producer. Values should be comma delimited in variable implementation. In reporting, the list eVar will split each value into a line item, with each line item receiving equal metrics weight */
          genre?: string;
          /** @description The season number the show belongs to. Season Series is required only if the show is part of a series */
          season?: string;
          showType?: string;
          /** @description Available values per Stream Type: Audio - "song", "podcast", "audiobook", "radio"; Video: "VoD", "Live", "Linear", "UGC", "DVoD" Customers can provide custom values for this parameter */
          contentType: string;
          /** @description This is the "friendly" (human-readable) name of the content */
          friendlyName?: string;
          /** @description Name of the player */
          playerName: string;
          /** @description Name of the author (of an audiobook) */
          author?: string;
          album?: string;
          /** @description Clip Length/Runtime - This is the maximum length (or duration) of the content being consumed (in seconds) */
          length: number;
          /** @description A property that defines the time of the day when the content was broadcast or played. This could have any value set as necessary by customers */
          dayPart?: string;
          /** @description Name of the record label */
          label?: string;
          /** @description MVPD provided via Adobe authentication. */
          mvpd?: string;
          /** @description Type of feed */
          feed?: string;
          /** @description This is the unique identifier for the content of the media asset, such as the TV series episode identifier, movie asset identifier, or live event identifier. Typically these IDs are derived from metadata authorities such as EIDR, TMS/Gracenote, or Rovi. These identifiers can also be from other proprietary or in-house systems. */
          assetID?: string;
          /** @description Content ID of the content, which can be used to tie back to other industry / CMS IDs */
          name: string;
          /** @description Name of the audio content publisher */
          publisher?: string;
          /** @description The date when the content first aired on any digital channel or platform. Any date format is acceptable but Adobe recommends: YYYY-MM-DD */
          firstDigitalDate?: string;
          /** @description The network/channel name */
          network?: string;
          /** @description Set to true when the hit is generated due to playing a downloaded content media session. Not present when downloaded content is not played. */
          isDownloaded?: boolean;
        };
        customMetadata?: {
          name?: string;
          value?: string;
        }[];
        qoeDataDetails?: {
          /** Format: int32 */
          bitrate?: number;
          /** Format: int32 */
          droppedFrames?: number;
          /** Format: int32 */
          framesPerSecond?: number;
          /** Format: int32 */
          timeToStart?: number;
        };
      };
      implementationDetails?: {
        version?: string;
      };
      identityMap?: {
        FPID?: {
          id?: string;
          /**
           * @default ambiguous
           * @enum {string}
           */
          authenticatedState?: 'ambiguous' | 'authenticated' | 'loggedOut';
          primary?: boolean;
        }[];
      };
      /** @default media.sessionStart */
      eventType: string;
      /** Format: date-time */
      timestamp: string;
    };
  }[];
}
