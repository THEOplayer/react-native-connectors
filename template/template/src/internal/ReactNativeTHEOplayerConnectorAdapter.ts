import type { THEOplayer } from 'react-native-theoplayer';
import type { ReactNativeTHEOplayerConnectorConfiguration } from '../api/ReactNativeTHEOplayerConnectorConfiguration';
import { NativeModules } from 'react-native';

export class ReactNativeTHEOplayerConnectorAdapter {

  constructor (private player: THEOplayer, config: ReactNativeTHEOplayerConnectorConfiguration) {
    NativeModules.ReactNativeTHEOplayerConnectorModule.initialize(this.player.nativeHandle, config);
  }

  destroy(): void {
    NativeModules.ReactNativeTHEOplayerConnectorModule.destroy(this.player.nativeHandle || -1);
  }
}
