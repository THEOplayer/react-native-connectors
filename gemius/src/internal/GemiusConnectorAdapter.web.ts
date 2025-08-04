import type { THEOplayer } from 'react-native-theoplayer';
import { GemiusConfiguration } from '../api/GemiusConfiguration';
import { ProgramData } from '../api/ProgramData';

export class GemiusConnectorAdapter {
  constructor(
    private player: THEOplayer,
    configuration: GemiusConfiguration,
  ) {
    throw new Error('Gemius connector is not supported for Web.');
  }

  update(programId: string, programData: ProgramData) {}

  destroy() {}
}
