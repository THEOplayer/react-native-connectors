import type { THEOplayer } from 'react-native-theoplayer';
import type NpawPluginOptions from 'npaw-plugin-react-native/dist/src/core/NpawPluginOptions';
import { LogLevel } from './LogLevel';
import { NpawConnectorAdapter } from '../internal/NpawConnectorAdapter';

export type NpawAnalyticsOptions = { [key: string]: unknown };

export interface NpawConnectorConfig {
  /** NPAW account code. */
  accountCode: string;
  /** Per-video analytics options (e.g. 'content.title', 'content.isLive', ...). */
  analytics?: NpawAnalyticsOptions;
  /** NpawPlugin options (host, sessionRecovery, ...). */
  plugin?: NpawPluginOptions;
  /** Initial log level. */
  logLevel?: LogLevel;
}

export class NpawConnector {
  private connectorAdapter: NpawConnectorAdapter;

  /**
   * Create an NPAW connector.
   *
   * @public
   */
  constructor(player: THEOplayer, config: NpawConnectorConfig) {
    this.connectorAdapter = new NpawConnectorAdapter(player, config);
  }

  /**
   * Change log level.
   * @param level
   */
  setLogLevel(level: LogLevel) {
    this.connectorAdapter.setLogLevel(level);
  }

  /**
   * Sets or updates NPAW analytics options for the current video.
   *
   * @param options Analytics options, such as `content.title` or `content.metadata`.
   * @param videoKey Optional NPAW video key.
   */
  setVideoOptions(options: NpawAnalyticsOptions, videoKey?: string): void {
    this.connectorAdapter.setVideoOptions(options, videoKey);
  }

  /**
   * Sets or updates global NPAW analytics options.
   *
   * @param options Global analytics options.
   */
  setAnalyticsOptions(options: NpawAnalyticsOptions): void {
    this.connectorAdapter.setAnalyticsOptions(options);
  }

  /**
   * Stops video and ad analytics and closes all sessions.
   *
   * @public
   */
  destroy(): void {
    this.connectorAdapter.destroy();
  }
}
