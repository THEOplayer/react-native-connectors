/**
 * Error details information.
 *
 * https://github.com/adobe/xdm/blob/master/docs/reference/datatypes/errordetails.schema.md
 */
export interface AdobeErrorDetails {
  // The error ID.
  name: string;

  // The error source.
  source: ErrorSource;
}

export enum ErrorSource {
  PLAYER = 'player',
  EXTERNAL = 'external',
}
