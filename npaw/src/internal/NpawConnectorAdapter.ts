import type { THEOplayer } from 'react-native-theoplayer';
import NpawPlugin from 'npaw-plugin-react-native';
import type { NpawAnalyticsOptions } from '../api/NpawConnector';
import type { NpawConnectorConfig } from '../api/NpawConnector';
import type { LogLevel } from '../api/LogLevel';
import { TheoplayerAdsAdapter } from './TheoplayerAdsAdapter';
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
      this.plugin.registerAdsAdapterFromClass(player, TheoplayerAdsAdapter, config.analytics);
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

  setVideoOptions(options: NpawAnalyticsOptions, videoKey?: string): void {
    try {
      this.plugin?.setVideoOptions(options, videoKey);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  setAnalyticsOptions(options: NpawAnalyticsOptions): void {
    try {
      this.plugin?.setAnalyticsOptions(options);
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
  }

  destroy(): void {
    try {
      this.plugin?.removeAdapter();
      this.plugin?.removeAdsAdapter();
      this.plugin?.destroy();
    } catch (error: unknown) {
      console.error(TAG, `${ERROR_MSG}: ${error}`);
    }
    this.plugin = undefined;
  }
}
