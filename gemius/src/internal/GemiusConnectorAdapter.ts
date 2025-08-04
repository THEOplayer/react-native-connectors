import type { THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import { GemiusConfiguration } from '../api/GemiusConfiguration';
import { ProgramData } from '../api/ProgramData';

export class GemiusConnectorAdapter {
  constructor(
    private player: THEOplayer,
    configuration: GemiusConfiguration,
  ) {
    NativeModules.GemiusModule.initialize(this.player.nativeHandle, configuration);
  }

  update(programId: string, programData: ProgramData) {
    NativeModules.GemiusModule.update(programId, programData);
  }

  destroy(): void {
    NativeModules.GemiusModule.destroy(this.player.nativeHandle || -1);
  }
}
