import type { THEOplayer } from 'react-native-theoplayer';
import { GemiusConfiguration } from './GemiusConfiguration';
import { GemiusConnectorAdapter } from '../internal/GemiusConnectorAdapter';
import { ProgramData } from './ProgramData';

export class GemiusConnector {
  private connectorAdapter: GemiusConnectorAdapter;

  /**
   * Create GemiusConnector
   *
   * @param player A React Native THEOplayer instance.
   * @param configuration The connector configuration
   *
   * @public
   */
  constructor(player: THEOplayer, configuration: GemiusConfiguration) {
    this.connectorAdapter = new GemiusConnectorAdapter(player, configuration);
  }

  /**
   * Update the current program data.
   */
  update(programId: string, programData: ProgramData) {
    this.connectorAdapter.update(programId, programData);
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
