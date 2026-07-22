import type { THEOplayer } from 'react-native-theoplayer';
import NpawPlugin from 'npaw-plugin-react-native';
import type { NpawConnectorConfig } from '../api/NpawConnector';
import type { LogLevel } from '../api/LogLevel';
import { TheoplayerAdapter } from './TheoplayerAdapter';

const TAG = 'NpawConnector';
const ERROR_MSG = 'NpawConnectorAdapter Error';

export class NpawConnectorAdapter {
  private plugin?: NpawPlugin;

  constructor(player: THEOplayer, config: NpawConnectorConfig) {
    try {
      this.plugin = new NpawPlugin(config.accountCode, config.plugin);
      if (config.logLevel != null) this.plugin.setLogLevel(config.logLevel);
      this.plugin.registerAdapterFromClass(player, TheoplayerAdapter, config.analytics);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  setLogLevel(level: LogLevel) {
    try {
      this.plugin?.setLogLevel(level);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  destroy(): void {
    try {
      this.plugin?.removeAdapter();
      this.plugin?.destroy();
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
    this.plugin = undefined;
  }
}
