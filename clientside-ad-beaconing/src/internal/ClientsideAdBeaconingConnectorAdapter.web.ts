import type { THEOplayer } from 'react-native-theoplayer';

const CSAB_ANALYTICS_AUGMENTED_MARKER = '__clientsideadBeaconingHasBeenSetup';

export class ClientsideAdBeaconingConnectorAdapter {
  constructor(player: THEOplayer) {
    console.log('ClientsideAdBeaconingConnectorAdapter constructor called');
  }

  destroy() {
    console.log('ClientsideAdBeaconingConnectorAdapter destroy called');
    const container = document.querySelector('.theoplayer-container');
    if (container) {
      container[CSAB_ANALYTICS_AUGMENTED_MARKER] = false;
    }
  }
}
