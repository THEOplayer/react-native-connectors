import { NativeModules } from 'react-native';
import { AdobeConnectorAdapterNative } from '../AdobeConnectorAdapterNative';
import type { THEOplayer } from 'react-native-theoplayer';

jest.mock('react-native', () => ({
  NativeModules: {
    AdobeEdgeModule: {
      initialize: jest.fn(),
      stopAndStartNewSession: jest.fn(),
      destroy: jest.fn(),
    },
  },
}));

test('restarts without optional metadata using an object, never an array', async () => {
  const player = { nativeHandle: 42 } as THEOplayer;
  const adapter = new AdobeConnectorAdapterNative(player, {});
  expect(NativeModules.AdobeEdgeModule.initialize).toHaveBeenCalledWith(42, {}, undefined);
  await adapter.stopAndStartNewSession();
  expect(NativeModules.AdobeEdgeModule.stopAndStartNewSession).toHaveBeenCalledWith(42, {});
  await adapter.destroy();
  expect(NativeModules.AdobeEdgeModule.destroy).toHaveBeenCalledWith(42);
});
