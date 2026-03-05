/**
 * Jest mocks for @adobe/alloy and the Media Analytics tracker.
 *
 * Import this module in a test file and call `setupAlloyMocks()` inside
 * `beforeEach` to reset all mock state between tests.
 */

// ---------------------------------------------------------------------------
// Mock @adobe/alloy
// ---------------------------------------------------------------------------
export const mockCreateQoEObject = jest.fn((bitrate: number, droppedFrames: number, fps: number, startupTime: number) => ({
  bitrate,
  droppedFrames,
  framesPerSecond: fps,
  timeToStart: startupTime,
}));

export const mockTrackEvent = jest.fn();
export const mockUpdatePlayhead = jest.fn();

export const mockTracker = {
  trackSessionStart: jest.fn(),
  trackPlay: jest.fn(),
  trackPause: jest.fn(),
  trackSessionEnd: jest.fn(),
  trackComplete: jest.fn(),
  trackError: jest.fn(),
  trackEvent: mockTrackEvent,
  updatePlayhead: mockUpdatePlayhead,
  updateQoEObject: jest.fn(),
  destroy: jest.fn(),
};

export const mockMedia = {
  getInstance: jest.fn(() => mockTracker),
  createMediaObject: jest.fn(),
  createAdBreakObject: jest.fn(),
  createAdObject: jest.fn(),
  createChapterObject: jest.fn(),
  createStateObject: jest.fn(),
  createQoEObject: mockCreateQoEObject,
  StreamType: {
    VOD: 'vod',
    Live: 'live',
    Linear: 'linear',
    Podcast: 'podcast',
    Audiobook: 'audiobook',
    AOD: 'aod',
  },
  MediaType: { Video: 'video', Audio: 'audio' },
};

export const mockAlloyClient = jest.fn((command: string, _options?: any) => {
  if (command === 'getMediaAnalyticsTracker') {
    return Promise.resolve(mockMedia);
  }
  return Promise.resolve();
});

/**
 * Reset all mock functions.  Call inside `beforeEach`.
 */
export function setupAlloyMocks() {
  jest.clearAllMocks();
  // Re-apply return values that clearAllMocks wipes out.
  mockAlloyClient.mockImplementation((command: string) => {
    if (command === 'getMediaAnalyticsTracker') return Promise.resolve(mockMedia);
    return Promise.resolve();
  });
  mockCreateQoEObject.mockImplementation((bitrate: number, droppedFrames: number, fps: number, startupTime: number) => ({
    bitrate,
    droppedFrames,
    framesPerSecond: fps,
    timeToStart: startupTime,
  }));
  mockMedia.getInstance.mockReturnValue(mockTracker);
}
