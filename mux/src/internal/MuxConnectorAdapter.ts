import type { THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import type { MuxOptions } from '../api/MuxOptions';
import type { MuxData } from '../api/MuxData';
import type { MuxPresentation } from '../api/MuxConnector';

export class MuxConnectorAdapter {
  constructor(
    private player: THEOplayer,
    options: MuxOptions,
  ) {
    NativeModules.MuxModule.initialize(this.player.nativeHandle, options);
  }

  changeVideo(data: MuxData) {
    NativeModules.MuxModule.changeVideo(this.player.nativeHandle, data);
  }

  changeProgram(data: MuxData) {
    NativeModules.MuxModule.changeProgram(this.player.nativeHandle, data);
  }

  changePresentation(presentation: MuxPresentation) {
    NativeModules.MuxModule.changePresentation(this.player.nativeHandle, presentation);
  }

  notifyError(code: number, message: string, context: string) {
    NativeModules.MuxModule.notifyError(this.player.nativeHandle, code, message, context);
  }

  destroy(): void {
    NativeModules.MuxModule.destroy(this.player.nativeHandle || -1);
  }
}
