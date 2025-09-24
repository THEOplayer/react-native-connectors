import type { NativeHandleType, THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import type { MuxOptions } from '../api/MuxOptions';
import type { MuxData } from '../api/MuxData';
import type { MuxPresentation } from '../api/MuxConnector';

export class MuxConnectorAdapter {
  private readonly nativeHandle: NativeHandleType;

  constructor(
    private player: THEOplayer,
    options: MuxOptions,
  ) {
    this.nativeHandle = player.nativeHandle || -1;
    NativeModules.MuxModule.initialize(this.nativeHandle, options);
  }

  changeVideo(data: MuxData) {
    NativeModules.MuxModule.changeVideo(this.nativeHandle, data);
  }

  changeProgram(data: MuxData) {
    NativeModules.MuxModule.changeProgram(this.nativeHandle, data);
  }

  changePresentation(presentation: MuxPresentation) {
    NativeModules.MuxModule.changePresentation(this.nativeHandle, presentation);
  }

  notifyError(code: number, message: string, context: string) {
    NativeModules.MuxModule.notifyError(this.nativeHandle, code, message, context);
  }

  destroy(): void {
    NativeModules.MuxModule.destroy(this.nativeHandle);
  }
}
