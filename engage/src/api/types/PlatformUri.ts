export enum PlatformType {
  unspecified,
  AndroidTV,
  AndroidMobile,
  iOS,
}

export interface PlatformUri {
  playbackUri?: string;
  platformType?: PlatformType;
}
