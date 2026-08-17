// jest.mock is hoisted by babel-jest before any imports are evaluated.
jest.mock('@adobe/alloy', () => ({
  createInstance: jest.fn(() => mockAlloyClient),
}));

import { AdobeEdgeHandler } from '../AdobeEdgeHandler';
import { AdobeEdgeWebConfig } from '../../../api/AdobeEdgeWebConfig';
import { createMockTracker, mockAlloyClient, mockMedia, mockTracker, mockTrackEvent, mockTrackSessionStart, setupAlloyMocks } from './mocks/alloy';
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

  it('does not start a session when the media tracker resolves after destroy', async () => {
    const trackerDeferred = deferred<any>();
    mockAlloyClient.mockImplementation((command: string) => {
      if (command === 'getMediaAnalyticsTracker') return trackerDeferred.promise;
      return Promise.resolve();
    });
    const handler = createHandler();

    player.emit('loadedmetadata');
    handler.destroy();

    trackerDeferred.resolve(mockMedia);
    await flushMicrotasks();
    expect(mockTrackSessionStart).not.toHaveBeenCalled();
  });

  it('catches a rejected media tracker promise', async () => {
    const onUnhandled = jest.fn();
    process.on('unhandledRejection', onUnhandled);
    try {
      mockAlloyClient.mockImplementation((command: string): any => {
        if (command === 'getMediaAnalyticsTracker') return Promise.reject(new Error('tracker unavailable'));
        return Promise.resolve();
      });
      createHandler();
      await flushMicrotasks();

      player.emit('loadedmetadata');
      await flushMicrotasks();
      expect(mockTrackSessionStart).not.toHaveBeenCalled();
      expect(onUnhandled).not.toHaveBeenCalled();
    } finally {
      process.off('unhandledRejection', onUnhandled);
    }
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

  it('reports the custom metadata again after an abandoned session start', async () => {
    jest.useFakeTimers();
    mockTrackSessionStart.mockResolvedValue({});
    const handler = createHandler();
    handler.updateMetadata({ friendlyName: 'Custom Title', name: 'custom-name' } as any);
    await flushMicrotasks();

    player.emit('loadedmetadata');
    await jest.advanceTimersByTimeAsync(10_000);
    expect(mockTrackSessionStart).toHaveBeenCalledTimes(3);

    // A new session start after giving up must still report the metadata.
    mockTrackSessionStart.mockResolvedValue({ sessionId: 'session-6' });
    player.emit('sourcechange');
    player.emit('loadedmetadata');
    await flushMicrotasks();

    const newCall = mockTrackSessionStart.mock.calls[3] as unknown as unknown[];
    expect(newCall[1]).toEqual({ friendlyName: 'Custom Title', name: 'custom-name' });
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

  it('caps the number of events queued while the session start is in flight', async () => {
    const start = deferred<{ sessionId?: string }>();
    mockTrackSessionStart.mockReturnValue(start.promise);
    createHandler();
    await flushMicrotasks();

    player.emit('loadedmetadata');
    for (let i = 0; i < 600; i++) {
      emitQualityChanged(i);
    }

    start.resolve({ sessionId: 'session-5' });
    await flushMicrotasks();

    // Only the 500 most recent events are kept, the oldest ones are dropped.
    expect(mockTrackEvent).toHaveBeenCalledTimes(500);
    expect((mockTrackEvent.mock.calls[0][1] as any).qoeDataDetails.bitrate).toBe(100);
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

  it('closes a late-confirmed session on its own tracker when a new session already started', async () => {
    // Each session gets its own tracker instance, as alloy's media.getInstance() does.
    const trackers = [createMockTracker(), createMockTracker()];
    mockMedia.getInstance.mockImplementation((() => trackers.shift() ?? createMockTracker()) as any);
    const [trackerA, trackerB] = trackers;
    const startA = deferred<{ sessionId?: string }>();
    trackerA.trackSessionStart.mockReturnValue(startA.promise);
    createHandler();
    await flushMicrotasks();

    player.emit('loadedmetadata');
    expect(trackerA.trackSessionStart).toHaveBeenCalledTimes(1);

    // The viewer switches source before the first session start is confirmed, and the new source
    // already starts a second session.
    player.emit('sourcechange');
    player.source = { metadata: { title: 'Second Title' } };
    player.emit('loadedmetadata');
    await flushMicrotasks();
    expect(trackerB.trackSessionStart).toHaveBeenCalledTimes(1);

    // The first session is confirmed afterwards: it must be ended on its own tracker, leaving the
    // second session untouched.
    startA.resolve({ sessionId: 'orphan-session' });
    await flushMicrotasks();
    expect(trackerA.trackSessionEnd).toHaveBeenCalledTimes(1);
    expect(trackerA.destroy).toHaveBeenCalledTimes(1);
    expect(trackerB.trackSessionEnd).not.toHaveBeenCalled();
    expect(trackerB.destroy).not.toHaveBeenCalled();

    // Events keep going to the second session.
    emitQualityChanged();
    await flushMicrotasks();
    expect(trackerB.trackEvent).toHaveBeenCalledTimes(1);
    expect(trackerA.trackEvent).not.toHaveBeenCalled();
  });

  it('retries when the session start throws synchronously', async () => {
    jest.useFakeTimers();
    mockTrackSessionStart.mockImplementationOnce(() => {
      throw new Error('alloy blew up');
    });
    createHandler();
    await flushMicrotasks();

    player.emit('loadedmetadata');
    await flushMicrotasks();
    expect(mockTrackSessionStart).toHaveBeenCalledTimes(1);

    // The handler is not stuck in 'starting': the start is retried and can succeed.
    await jest.advanceTimersByTimeAsync(1000);
    expect(mockTrackSessionStart).toHaveBeenCalledTimes(2);

    emitQualityChanged();
    await flushMicrotasks();
    expect(mockTrackEvent).toHaveBeenCalledTimes(1);
  });

  it('completes only the session whose playback ended, not another late-confirmed one', async () => {
    // Each session gets its own tracker instance, as alloy's media.getInstance() does.
    const trackers = [createMockTracker(), createMockTracker()];
    mockMedia.getInstance.mockImplementation((() => trackers.shift() ?? createMockTracker()) as any);
    const [trackerA, trackerB] = trackers;
    const startA = deferred<{ sessionId?: string }>();
    const startB = deferred<{ sessionId?: string }>();
    trackerA.trackSessionStart.mockReturnValue(startA.promise);
    trackerB.trackSessionStart.mockReturnValue(startB.promise);
    createHandler();
    await flushMicrotasks();

    // Session A is superseded by a new source before it is confirmed: it never finished playback.
    player.emit('loadedmetadata');
    player.emit('sourcechange');
    player.source = { metadata: { title: 'Second Title' } };
    player.emit('loadedmetadata');
    await flushMicrotasks();
    expect(trackerB.trackSessionStart).toHaveBeenCalledTimes(1);

    // Playback of session B reaches the end while its start is still in flight.
    player.emit('ended');

    startA.resolve({ sessionId: 'session-a' });
    await flushMicrotasks();
    expect(trackerA.trackSessionEnd).toHaveBeenCalledTimes(1);
    expect(trackerA.trackComplete).not.toHaveBeenCalled();

    startB.resolve({ sessionId: 'session-b' });
    await flushMicrotasks();
    expect(trackerB.trackComplete).toHaveBeenCalledTimes(1);
    expect(trackerB.trackSessionEnd).toHaveBeenCalledTimes(1);
  });

  it('destroys the tracker only after the session end event was dispatched', async () => {
    const tracker = createMockTracker();
    mockMedia.getInstance.mockImplementation((() => tracker) as any);
    const sessionEnd = deferred<unknown>();
    tracker.trackSessionEnd.mockReturnValue(sessionEnd.promise);
    createHandler();
    await flushMicrotasks();

    player.emit('loadedmetadata');
    await flushMicrotasks();

    player.emit('sourcechange');
    await flushMicrotasks();
    expect(tracker.trackSessionEnd).toHaveBeenCalledTimes(1);
    // Destroying resets the tracker state the pending event still needs.
    expect(tracker.destroy).not.toHaveBeenCalled();

    sessionEnd.resolve({});
    await flushMicrotasks();
    expect(tracker.destroy).toHaveBeenCalledTimes(1);
  });
});
