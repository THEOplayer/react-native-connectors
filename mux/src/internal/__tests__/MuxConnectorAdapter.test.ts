import { NativeModules, Platform } from 'react-native';
import type { THEOplayer } from 'react-native-theoplayer';
import { MuxConnectorAdapter } from '../MuxConnectorAdapter';
import { MuxPresentation } from '../../api/MuxConnector';

jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
  NativeModules: {
    MuxModule: {
      initialize: jest.fn(),
      changePresentation: jest.fn(),
    },
  },
}));

afterEach(() => jest.restoreAllMocks());

test('Apple warns instead of invoking an absent native presentation method', () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const adapter = new MuxConnectorAdapter({ nativeHandle: 42 } as THEOplayer, { data: {} });
  adapter.changePresentation(MuxPresentation.FULLSCREEN);
  expect(NativeModules.MuxModule.changePresentation).not.toHaveBeenCalled();
  expect(warn).toHaveBeenCalledWith(expect.any(String), expect.stringContaining('not supported on Apple'));
});

test('Android still forwards manual presentation changes', () => {
  jest.replaceProperty(Platform, 'OS', 'android');
  const adapter = new MuxConnectorAdapter({ nativeHandle: 43 } as THEOplayer, { data: {} });
  adapter.changePresentation(MuxPresentation.FULLSCREEN);
  expect(NativeModules.MuxModule.changePresentation).toHaveBeenCalledWith(43, MuxPresentation.FULLSCREEN);
});
