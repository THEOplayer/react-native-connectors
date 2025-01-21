import { TestScope } from 'cavy';
import hls from '../res/hls.json';
import { getTestPlayer } from '../components/TestableTHEOplayerView';
import { PlayerEventType, THEOplayer } from 'react-native-theoplayer';
import { waitForPlayerEventTypes } from '../utils/Actions';

type PlayerFn = (player: THEOplayer) => Promise<void> | void;
const NoOpPlayerFn: PlayerFn = (_player: THEOplayer) => {};

export function testConnector(spec: TestScope, onCreate: PlayerFn, onUseAPI: PlayerFn, onDestroy: PlayerFn) {
  spec.it('successfully creates the connector, connects to the player, uses API, and cleans up and destroys.', async function () {
    const player = await getTestPlayer();

    // Create connector.
    await onCreate(player);
    const eventsPromise = waitForPlayerEventTypes(player, [PlayerEventType.SOURCE_CHANGE, PlayerEventType.PLAY, PlayerEventType.PLAYING]);

    // Start autoplay
    player.autoplay = true;
    player.source = hls[0];

    // Expect events.
    await eventsPromise;

    // Use connector API
    if (onUseAPI !== NoOpPlayerFn) {
      await onUseAPI(player);
      console.debug(`[testConnector] Successfully used the connector API.`);
    }

    // Clean-up and destroy connector.
    await onDestroy(player);
    console.debug(`[testConnector] Successfully destroyed to the connector.`);
  });
}
