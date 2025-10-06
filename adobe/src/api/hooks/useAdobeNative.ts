import { THEOplayer } from 'react-native-theoplayer';
import { RefObject } from 'react';
import { AdobeConnector } from '../AdobeConnector';
import type { AdobeMetaData } from '../../internal/Types';
import { useAdobe } from './useAdobe';

export function useAdobeNative(
  uri: string,
  ecid: string,
  sid: string,
  trackingUrl: string,
  metadata?: AdobeMetaData,
  userAgent?: string,
  useDebug?: boolean,
): [RefObject<AdobeConnector | undefined>, (player: THEOplayer | undefined) => void] {
  return useAdobe(uri, ecid, sid, trackingUrl, metadata, userAgent, useDebug, true);
}
