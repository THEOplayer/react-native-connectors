/**
 * Chapter details information.
 *
 * https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/chapterdetails.schema.md
 */
export interface AdobeChapterDetails {
  // The ID of the ad break.
  ID?: string;

  // The friendly name of the Ad Break.
  friendlyName?: string;

  // The position (index, integer) of the chapter inside the content.
  index: number;

  // Chapter is completed.
  isCompleted?: boolean;

  // Chapter is started.
  isStarted?: boolean;

  // The length of the chapter, in seconds.
  length: number;

  // The offset of the chapter inside the content (in seconds) from the start.
  offset: number;

  // The time spent on the chapter, in seconds.
  timePlayed?: number;
}
