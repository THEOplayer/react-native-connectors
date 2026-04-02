import type { NativeHandleType, THEOplayer } from 'react-native-theoplayer';
import { NativeModules } from 'react-native';

const TAG = 'ClientsideAdBeaconingConnector';
const ERROR_MSG = 'ClientsideAdBeaconingConnectorAdapter Error';

export class ClientsideAdBeaconingConnectorAdapter {
  private readonly nativeHandle: NativeHandleType;

  constructor(player: THEOplayer) {
    try {
      this.nativeHandle = player.nativeHandle || -1;
      NativeModules.ClientsideAdBeaconingModule.initialize(this.nativeHandle);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  destroy(): void {
    try {
      NativeModules.ClientsideAdBeaconingModule.destroy(this.nativeHandle);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }
}
