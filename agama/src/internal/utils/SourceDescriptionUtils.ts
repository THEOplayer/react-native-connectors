import { DASHSourceType, HLSSourceType, KnownSourceType, SourceType } from './SourceUtils';
import { stringContains_, stringStartsWith } from './StringUtils';
import type { SourceDescription, TypedSource } from 'react-native-theoplayer';
import { isArray } from './TypeUtils';

export function isM3U8SourceString_(source: string): boolean {
  if (!source) {
    return false;
  }
  return stringContains_(source, 'm3u8');
}

export function isDASHSourceString_(source: string): boolean {
  if (!source) {
    return false;
  }
  return stringContains_(source, 'mpd');
}

export function isDASHSourceType_(type: SourceType | undefined): type is DASHSourceType {
  if (!type) {
    return false;
  }
  const localType = type.toLowerCase();
  return stringStartsWith(localType, KnownSourceType.DASH_);
}

export function isHLSSourceType_(type: SourceType | undefined): type is HLSSourceType {
  if (!type) {
    return false;
  }
  const lowerCaseType = type.toLowerCase();
  return stringStartsWith(lowerCaseType, KnownSourceType.HLS_) || stringStartsWith(lowerCaseType, KnownSourceType.HLSX_);
}

export function currentSource(source: SourceDescription | undefined): TypedSource | undefined {
  if (source?.sources) {
    return isArray(source.sources) ? source.sources[0] : source.sources;
  }
  return undefined;
}
