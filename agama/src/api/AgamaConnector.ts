import type { THEOplayer } from 'react-native-theoplayer';
import type { AgamaClient } from '../internal/AgamaClient';
import { AgamaExtensionHandler } from '../internal/handlers/AgamaExtensionHandler';
import { AgamaReactNativeClient } from '../internal/AgamaReactNativeClient';
import type { AgamaConfiguration } from './AgamaConfiguration';
import { Platform } from 'react-native';
import { AgamaPolyfills } from './polyfills/AgamaPolyfills';

export class AgamaConnector {
  private readonly _agamaClient?: AgamaClient;
  private readonly _agamaHandler?: AgamaExtensionHandler;

  constructor(player: THEOplayer, configuration: AgamaConfiguration) {
    if (isValidConfiguration()) {
      this._agamaClient = new AgamaReactNativeClient({
        name: 'THEOplayer',
        version: player.version.version,
      });
      this._agamaHandler = new AgamaExtensionHandler(player, this._agamaClient, configuration);
    }
  }

  /**
   * Stops video and ad analytics and closes all sessions.
   */
  destroy(): void {
    this._agamaHandler?.unload_();
  }
}

function isValidConfiguration(): boolean {
  if (!isAgamaLoaded()) {
    throw new Error(`Agama library was not loaded.`);
  }
  if (!AgamaPolyfills.isInstalled()) {
    throw new Error('Agama polyfills were not installed. Include `AgamaPolyfills.install()` in your code.');
  }
  if (!(Platform.OS === 'android')) {
    console.warn(`AgamaConnector is not support on ${Platform.OS}`);
    return false;
  }
  return true;
}

function isAgamaLoaded(): boolean {
  return window.Agama !== undefined;
}
