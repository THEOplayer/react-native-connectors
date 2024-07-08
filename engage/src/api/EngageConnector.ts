import { DefaultEngageClient } from '../internal/DefaultEngageClient';
import { Platform } from 'react-native';
import { EngageConfiguration } from "./EngageConfiguration";
import { EngageClient } from "./EngageClient";

export class EngageConnector {

  private static client: EngageClient | undefined = undefined;

  /**
   * Create an Engage client.
   *
   * @param configuration
   */
  static createClient(configuration: EngageConfiguration): Promise<EngageClient> {
    return new Promise((resolve, reject) => {
      if (this.client) {
        // Keep a singleton client
        resolve(this.client);
      } else if (isValidConfiguration()) {
        this.client = new DefaultEngageClient(configuration, (client: EngageClient) => {
          resolve(client);
        });
      } else {
        reject(`EngageConnector is not support on ${Platform.OS}`);
      }
    });
  }
}

function isValidConfiguration(): boolean {
  return Platform.OS === 'android';
}
