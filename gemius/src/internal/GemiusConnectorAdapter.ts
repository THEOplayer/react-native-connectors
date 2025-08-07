import type { THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import { GemiusConfiguration } from '../api/GemiusConfiguration';
import { ProgramData } from '../api/ProgramData';

const TAG = 'GemiusConnector';
const ERROR_MSG = 'GemiusConnectorAdapter Error';

export class GemiusConnectorAdapter {
  constructor(
    private player: THEOplayer,
    configuration: GemiusConfiguration,
  ) {
    try {
      NativeModules.GemiusModule.initialize(this.player.nativeHandle || -1, configuration);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  update(programId: string, programData: ProgramData) {
    try {
      NativeModules.GemiusModule.update(this.player.nativeHandle || -1, programId, programData);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  destroy(): void {
    try {
      NativeModules.GemiusModule.destroy(this.player.nativeHandle || -1);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }
}
