import { jest } from '@jest/globals';

jest.mock('react-native', () => {
  return {
    StyleSheet: {
      create: () => ({}),
    },
    NativeModules: {
      THEORCTAdsModule: {},
      RNDeviceInfo: {},
      THEORCTCacheModule: {
        getInitialState: async () =>
          Promise.resolve({
            status: undefined,
            tasks: [],
          }),
      },
    },
    Dimensions: {
      get: () => ({ width: 1024, height: 768 }),
    },
    Platform: {
      OS: 'android', // or 'ios'
      select: () => null
    },
    UIManager: {
      getViewManagerConfig: () => null
    },
    NativeEventEmitter: jest.fn( (props) => ({
      addListener: (name: string, value: any) => null
    })),
  };
});
