import type { NativeHandleType, THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import type { MuxOptions } from '../api/MuxOptions';
import type { MuxData } from '../api/MuxData';
import type { MuxPresentation } from '../api/MuxConnector';

const TAG = 'MuxConnector';
const ERROR_MSG = 'MuxConnectorAdapter Error';

export class MuxConnectorAdapter {
  private readonly nativeHandle: NativeHandleType;

  constructor(player: THEOplayer, options: MuxOptions) {
    try {
      this.nativeHandle = player.nativeHandle || -1;
      NativeModules.MuxModule.initialize(this.nativeHandle, options);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  changeVideo(data: MuxData) {
    try {
      NativeModules.MuxModule.changeVideo(this.nativeHandle, data);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  changeProgram(data: MuxData) {
    try {
      NativeModules.MuxModule.changeProgram(this.nativeHandle, data);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  changePresentation(presentation: MuxPresentation) {
    try {
      NativeModules.MuxModule.changePresentation(this.nativeHandle, presentation);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  notifyError(code: number, message: string, context: string) {
    try {
      NativeModules.MuxModule.notifyError(this.nativeHandle, code, message, context);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  destroy(): void {
    try {
      NativeModules.MuxModule.destroy(this.nativeHandle);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }
}
