import type { THEOplayer } from 'react-native-theoplayer';
import { AdScriptMetadata } from '../api/AdScriptMetadata';

export class AdScriptConnectorAdapter {
  constructor(
    private player: THEOplayer,
    implementationId: string,
    contentMetadata: AdScriptMetadata,
    debug?: boolean,
  ) {
    throw new Error('AdScript connector is not supported for Web.');
  }

  updateMetadata(metadata: AdScriptMetadata) {}

  destroy() {}
}
