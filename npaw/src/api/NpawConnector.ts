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
   * Stops video and ad analytics and closes all sessions.
   *
   * @public
   */
  destroy(): void {
    this.connectorAdapter.destroy();
  }
}
