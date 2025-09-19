import { THEOplayer } from 'react-native-theoplayer';
import { RefObject } from 'react';
import { AdobeConnector } from '../AdobeConnector';
import { useAdobe } from './useAdobe';

export function useAdobeNative(
  baseUrl: string,
  dataStreamId: string,
  userAgent?: string,
  useDebug?: boolean,
  debugSessionId?: string,
): [RefObject<AdobeConnector | undefined>, (player: THEOplayer | undefined) => void] {
  return useAdobe(baseUrl, dataStreamId, userAgent, useDebug, debugSessionId, true);
}
