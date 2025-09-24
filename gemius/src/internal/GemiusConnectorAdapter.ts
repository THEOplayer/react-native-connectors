import type { NativeHandleType, THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import { GemiusConfiguration } from '../api/GemiusConfiguration';
import { ProgramData } from '../api/ProgramData';

const TAG = 'GemiusConnector';
const ERROR_MSG = 'GemiusConnectorAdapter Error';

export class GemiusConnectorAdapter {
  private readonly nativeHandle: NativeHandleType;

  constructor(player: THEOplayer, configuration: GemiusConfiguration) {
    try {
      this.nativeHandle = player.nativeHandle || -1;
      NativeModules.GemiusModule.initialize(this.nativeHandle, configuration);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  update(programId: string, programData: ProgramData) {
    try {
      NativeModules.GemiusModule.update(this.nativeHandle, programId, programData);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  destroy(): void {
    try {
      NativeModules.GemiusModule.destroy(this.nativeHandle);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }
}
