import type { AdobeMetaData } from './Types';

export interface AdobeConnectorAdapter {
  setDebug(debug: boolean): void;

  updateMetadata(metadata: AdobeMetaData): void;

  setError(metadata: AdobeMetaData): void;

  stopAndStartNewSession(metadata?: AdobeMetaData): Promise<void>;

  destroy(): Promise<void>;
}
