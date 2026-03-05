// jest.mock is hoisted by babel-jest before any imports are evaluated.
jest.mock('@adobe/alloy', () => ({
  createInstance: jest.fn(() => mockAlloyClient),
}));

import { AdobeEdgeHandler } from '../AdobeEdgeHandler';
import { AdobeEdgeWebConfig } from '../../../api/AdobeEdgeWebConfig';
import { mockAlloyClient, mockCreateQoEObject, setupAlloyMocks } from './mocks/alloy';
import { makePlayer } from './mocks/player';

// ---------------------------------------------------------------------------
// Shared config
// ---------------------------------------------------------------------------
const config: AdobeEdgeWebConfig = {
  datastreamId: 'test-datastream',
  edgeBasePath: 'ee-pre-prd',
  orgId: 'test-org',
  streamingMedia: { channel: 'test', playerName: 'THEOplayer' },
};

/** Flush all pending micro-tasks (e.g. getMediaAnalyticsTracker promise). */
function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve));
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('AdobeEdgeHandler – handleQualityChanged', () => {
  let player: any;
  let videoTrack: any;
  let videoTracks: any;

  beforeEach(async () => {
    setupAlloyMocks();
    // noinspection JSConstantReassignment
    global.window = { addEventListener: jest.fn(), removeEventListener: jest.fn() } as any;

    ({ player, videoTrack, videoTracks } = makePlayer());

    new AdobeEdgeHandler(player, config);

    // Simulate addtrack so the handler attaches to the video track.
    videoTracks.emit('addtrack', { track: videoTrack });

    // Let the getMediaAnalyticsTracker promise resolve so _tracker is set.
    await flushPromises();
  });

  function emitQualityChanged(bandwidth: number, frameRate: number) {
    videoTrack.emit('activequalitychanged', {
      quality: { bandwidth, frameRate } as any,
    });
  }

  it('passes integer bandwidth to createQoEObject', () => {
    emitQualityChanged(4500000.9, 25);
    expect(mockCreateQoEObject).toHaveBeenCalled();
    const [bitrate] = mockCreateQoEObject.mock.calls[0];
    expect(Number.isInteger(bitrate)).toBe(true);
    expect(bitrate).toBe(4500000);
  });

  it('passes integer frameRate to createQoEObject', () => {
    emitQualityChanged(2000000, 29.97);
    expect(mockCreateQoEObject).toHaveBeenCalled();
    const [, , fps] = mockCreateQoEObject.mock.calls[0];
    expect(Number.isInteger(fps)).toBe(true);
    expect(fps).toBe(29);
  });

  it('passes integer values for both bandwidth and frameRate', () => {
    emitQualityChanged(8000000.5, 59.94);
    const [bitrate, , fps] = mockCreateQoEObject.mock.calls[0];
    expect(Number.isInteger(bitrate)).toBe(true);
    expect(Number.isInteger(fps)).toBe(true);
    expect(bitrate).toBe(8000000);
    expect(fps).toBe(59);
  });

  it('maps undefined bandwidth to 0', () => {
    emitQualityChanged(undefined as any, 30);
    const [bitrate] = mockCreateQoEObject.mock.calls[0];
    expect(bitrate).toBe(0);
  });

  it('maps undefined frameRate to 0', () => {
    emitQualityChanged(2000000, undefined as any);
    const [, , fps] = mockCreateQoEObject.mock.calls[0];
    expect(fps).toBe(0);
  });

  it('maps NaN bandwidth to 0', () => {
    emitQualityChanged(NaN, 30);
    const [bitrate] = mockCreateQoEObject.mock.calls[0];
    expect(bitrate).toBe(0);
  });

  it('maps NaN frameRate to 0', () => {
    emitQualityChanged(2000000, NaN);
    const [, , fps] = mockCreateQoEObject.mock.calls[0];
    expect(fps).toBe(0);
  });

  it('builds a QoE object with qoeDataDetails wrapping the result of createQoEObject', () => {
    emitQualityChanged(5000000, 30);
    expect(mockCreateQoEObject).toHaveBeenCalledWith(5000000, 0, 30, 0);
    const qoeObject = mockCreateQoEObject.mock.results[0].value;
    expect(qoeObject).toEqual({ bitrate: 5000000, droppedFrames: 0, framesPerSecond: 30, timeToStart: 0 });
  });
});
