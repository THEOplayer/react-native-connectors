export enum KnownSourceType {
  DASH_ = 'application/dash+xml',
  HLS_ = 'application/vnd.apple.mpegurl',
  HLSX_ = 'application/x-mpegurl',
  MP4_ = 'video/mp4',
}

export type HLSSourceType = KnownSourceType.HLS_ | KnownSourceType.HLSX_;
export type DASHSourceType = KnownSourceType.DASH_;
export type SourceType = KnownSourceType | string;
