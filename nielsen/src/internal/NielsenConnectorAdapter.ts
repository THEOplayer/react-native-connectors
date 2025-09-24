import type { NativeHandleType, THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';
import { NielsenOptions } from '@theoplayer/react-native-analytics-nielsen';

const TAG = 'NielsenConnector';
const ERROR_MSG = 'NielsenConnectorAdapter Error';

export class NielsenConnectorAdapter {
  private readonly nativeHandle: NativeHandleType;

  constructor(player: THEOplayer, appId: string, instanceName: string, nielsenOptions: NielsenOptions) {
    try {
      this.nativeHandle = player.nativeHandle || -1;
      NativeModules.NielsenModule.initialize(this.nativeHandle, appId, instanceName, nielsenOptions);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  updateMetadata(metadata: { [key: string]: string }): void {
    try {
      NativeModules.NielsenModule.updateMetadata(this.nativeHandle, metadata);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  destroy(): void {
    try {
      NativeModules.NielsenModule.destroy(this.nativeHandle);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }
}
