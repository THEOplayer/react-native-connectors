// jest.mock is hoisted by babel-jest before any imports are evaluated.
jest.mock('@adobe/alloy', () => ({
  createInstance: jest.fn(() => mockAlloyClient),
}));

import { AdobeEdgeHandler } from '../AdobeEdgeHandler';
import { AdobeEdgeWebConfig } from '../../../api/AdobeEdgeWebConfig';
import { mockAlloyClient, mockMedia, mockTracker, mockTrackEvent, mockTrackSessionStart, setupAlloyMocks } from './mocks/alloy';
import { makePlayer } from './mocks/player';

// ---------------------------------------------------------------------------
// Shared config & helpers
// ---------------------------------------------------------------------------
const config: AdobeEdgeWebConfig = {
  datastreamId: 'test-datastream',
  edgeBasePath: 'ee-pre-prd',
  orgId: 'test-org',
  streamingMedia: { channel: 'test', playerName: 'THEOplayer' },
};

/** Flush pending micro-tasks. Works with both real and fake timers. */
function flushMicrotasks() {
  return new Promise<void>((resolve) => {
    const { port1, port2 } = new MessageChannel();
    port1.onmessage = () => {
      port1.close();
      port2.close();
      resolve();
    };
    port2.postMessage(null);
  });
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

/** Create a player mock with a valid source & duration so a session can start. */
function makeLoadedPlayer() {
  const { player, videoTrack, videoTracks } = makePlayer();
  player.source = { metadata: { title: 'Test Title' } };
  player.duration = 3600;
  return { player, videoTrack, videoTracks };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('AdobeEdgeHandler – session start', () => {
  let player: any;
  let videoTrack: any;
  let videoTracks: any;

  beforeEach(() => {
    setupAlloyMocks();
    // noinspection JSConstantReassignment
    global.window = { addEventListener: jest.fn(), removeEventListener: jest.fn() } as any;
    ({ player, videoTrack, videoTracks } = makeLoadedPlayer());
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function createHandler() {
    const handler = new AdobeEdgeHandler(player, config);
    videoTracks.emit('addtrack', { track: videoTrack });
    return handler;
  }

  function emitQualityChanged(bandwidth = 4_500_000) {
    videoTrack.emit('activequalitychanged', { quality: { bandwidth, frameRate: 25 } as any });
  }

  it('queues events until the session is confirmed, then flushes them', async () => {
    const start = deferred<{ sessionId?: string }>();
    mockTrackSessionStart.mockReturnValue(start.promise);
    createHandler();
    await flushMicrotasks();

    player.emit('loadedmetadata');
    expect(mockTrackSessionStart).toHaveBeenCalledTimes(1);

    // Emitted while the session start is in flight: must be queued, not sent.
    emitQualityChanged();
    expect(mockTrackEvent).not.toHaveBeenCalled();

    start.resolve({ sessionId: 'session-1' });
    await flushMicrotasks();
    expect(mockTrackEvent).toHaveBeenCalledTimes(1);
    expect(mockTrackEvent.mock.calls[0][0]).toBe('bitrateChange');
  });

  it('retries when the session start resolves without a sessionId, then gives up', async () => {
    jest.useFakeTimers();
    mockTrackSessionStart.mockResolvedValue({});
    createHandler();
    await flushMicrotasks();

    player.emit('loadedmetadata');
    await flushMicrotasks();
    expect(mockTrackSessionStart).toHaveBeenCalledTimes(1);

    await jest.advanceTimersByTimeAsync(1000);
    expect(mockTrackSessionStart).toHaveBeenCalledTimes(2);

    await jest.advanceTimersByTimeAsync(2000);
    expect(mockTrackSessionStart).toHaveBeenCalledTimes(3);

    // No further retries after the maximum number of attempts.
    await jest.advanceTimersByTimeAsync(10_000);
    expect(mockTrackSessionStart).toHaveBeenCalledTimes(3);

    // Events after a failed session start are not dispatched to the tracker.
    emitQualityChanged();
    await flushMicrotasks();
    expect(mockTrackEvent).not.toHaveBeenCalled();
  });

  it('recovers when a session start retry succeeds', async () => {
    jest.useFakeTimers();
    mockTrackSessionStart.mockResolvedValueOnce({}).mockResolvedValue({ sessionId: 'session-2' });
    createHandler();
    await flushMicrotasks();

    player.emit('loadedmetadata');
    emitQualityChanged();
    await flushMicrotasks();
    expect(mockTrackEvent).not.toHaveBeenCalled();

    await jest.advanceTimersByTimeAsync(1000);
    expect(mockTrackSessionStart).toHaveBeenCalledTimes(2);
    expect(mockTrackEvent).toHaveBeenCalledTimes(1);
  });

  it('retries when the session start promise rejects', async () => {
    jest.useFakeTimers();
    mockTrackSessionStart.mockRejectedValueOnce(new Error('network error')).mockResolvedValue({ sessionId: 'session-3' });
    createHandler();
    await flushMicrotasks();

    player.emit('loadedmetadata');
    await flushMicrotasks();
    expect(mockTrackSessionStart).toHaveBeenCalledTimes(1);

    await jest.advanceTimersByTimeAsync(1000);
    expect(mockTrackSessionStart).toHaveBeenCalledTimes(2);
  });

  it('starts the session once the media tracker becomes available after loadedmetadata', async () => {
    const trackerDeferred = deferred<any>();
    mockAlloyClient.mockImplementation((command: string) => {
      if (command === 'getMediaAnalyticsTracker') return trackerDeferred.promise;
      return Promise.resolve();
    });
    createHandler();

    // loadedmetadata arrives before the tracker promise resolves.
    player.emit('loadedmetadata');
    await flushMicrotasks();
    expect(mockTrackSessionStart).not.toHaveBeenCalled();

    trackerDeferred.resolve(mockMedia);
    await flushMicrotasks();
    expect(mockTrackSessionStart).toHaveBeenCalledTimes(1);
  });

  it('catches tracker event rejections instead of causing unhandled rejections', async () => {
    const onUnhandled = jest.fn();
    process.on('unhandledRejection', onUnhandled);
    try {
      createHandler();
      await flushMicrotasks();

      player.emit('loadedmetadata');
      await flushMicrotasks();
      expect(mockTrackSessionStart).toHaveBeenCalledTimes(1);

      // Simulate alloy rejecting events because the session is unavailable.
      mockTrackEvent.mockRejectedValue(new Error('Session ID is not available for playerId'));
      emitQualityChanged();
      await flushMicrotasks();

      expect(mockTrackEvent).toHaveBeenCalledTimes(1);
      expect(onUnhandled).not.toHaveBeenCalled();
    } finally {
      process.off('unhandledRejection', onUnhandled);
    }
  });

  it('reports the custom metadata on retried session starts', async () => {
    jest.useFakeTimers();
    mockTrackSessionStart.mockResolvedValueOnce({}).mockResolvedValue({ sessionId: 'session-4' });
    const handler = createHandler();
    handler.updateMetadata({ friendlyName: 'Custom Title', name: 'custom-name', season: '2' } as any);
    await flushMicrotasks();

    player.emit('loadedmetadata');
    await flushMicrotasks();

    await jest.advanceTimersByTimeAsync(1000);
    expect(mockTrackSessionStart).toHaveBeenCalledTimes(2);

    const retryCall = mockTrackSessionStart.mock.calls[1] as unknown as unknown[];
    expect(retryCall[1]).toEqual({ friendlyName: 'Custom Title', name: 'custom-name', season: '2' });
    const retryMediaObject = mockMedia.createMediaObject.mock.calls[1] as unknown as unknown[];
    expect(retryMediaObject[0]).toBe('Custom Title');
    expect(retryMediaObject[1]).toBe('custom-name');
  });

  it('completes a session that was confirmed after playback ended', async () => {
    const start = deferred<{ sessionId?: string }>();
    mockTrackSessionStart.mockReturnValue(start.promise);
    createHandler();
    await flushMicrotasks();

    player.emit('loadedmetadata');
    expect(mockTrackSessionStart).toHaveBeenCalledTimes(1);

    // Playback ends before the edge network confirms the session.
    player.emit('ended');

    start.resolve({ sessionId: 'late-session' });
    await flushMicrotasks();
    expect(mockTracker.trackComplete).toHaveBeenCalledTimes(1);
    expect(mockTracker.trackSessionEnd).toHaveBeenCalledTimes(1);
  });

  it('closes a session that was confirmed after a sourcechange ended it', async () => {
    const start = deferred<{ sessionId?: string }>();
    mockTrackSessionStart.mockReturnValue(start.promise);
    createHandler();
    await flushMicrotasks();

    player.emit('loadedmetadata');
    expect(mockTrackSessionStart).toHaveBeenCalledTimes(1);

    // Source changes while the session start is still in flight.
    player.source = undefined;
    player.emit('sourcechange');

    // The in-flight start is confirmed afterwards: the orphaned session must be ended.
    start.resolve({ sessionId: 'orphan-session' });
    await flushMicrotasks();
    expect(mockTracker.trackSessionEnd).toHaveBeenCalledTimes(1);

    // A subsequent quality change must not be dispatched.
    emitQualityChanged();
    await flushMicrotasks();
    expect(mockTrackEvent).not.toHaveBeenCalled();
  });
});
