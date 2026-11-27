import { NativeModules } from 'react-native';
import { AdobeConnectorAdapterNative } from '../AdobeConnectorAdapterNative';
import { AdobeConnector } from '../../api/AdobeConnector';
import type { THEOplayer } from 'react-native-theoplayer';

jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
  NativeModules: {
    AdobeEdgeModule: {
      initialize: jest.fn(),
      stopAndStartNewSession: jest.fn(),
      destroy: jest.fn(),
    },
  },
}));

jest.mock('../AdobeConnectorAdapterWeb', () => ({
  AdobeConnectorAdapterWeb: jest.fn(),
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

test('the public connector permits restarting without metadata', () => {
  const connector = new AdobeConnector({ nativeHandle: 43 } as THEOplayer, { mobile: {} });
  connector.stopAndStartNewSession();
  expect(NativeModules.AdobeEdgeModule.stopAndStartNewSession).toHaveBeenCalledWith(43, {});
  connector.destroy();
});
