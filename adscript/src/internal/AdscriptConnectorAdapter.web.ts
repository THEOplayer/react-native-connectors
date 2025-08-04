import type { THEOplayer } from 'react-native-theoplayer';
import { AdscriptMetadata } from '../api/AdscriptMetadata';

export class AdscriptConnectorAdapter {
  constructor(
    private player: THEOplayer,
    implementationId: string,
    contentMetadata: AdscriptMetadata,
    debug?: boolean,
  ) {
    throw new Error('Adscript connector is not supported for Web.');
  }

  updateMetadata(metadata: AdscriptMetadata) {}

  destroy() {}
}
