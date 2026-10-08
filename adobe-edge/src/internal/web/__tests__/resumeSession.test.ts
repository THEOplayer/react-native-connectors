jest.mock('@adobe/alloy', () => ({
  createInstance: jest.fn(() => mockAlloyClient),
}));

import { AdobeEdgeHandler } from '../AdobeEdgeHandler';
import { createMockTracker, mockAlloyClient, mockMedia, setupAlloyMocks } from './mocks/alloy';
import { makePlayer } from './mocks/player';
import { EventEmitter } from './utils/EventEmitter';

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
  const promise = new Promise<T>((done) => (resolve = done));
  return { promise, resolve };
}

describe('AdobeEdgeHandler resume guard', () => {
  let player: ReturnType<typeof makePlayer>['player'];
  let lifecycle: EventEmitter & { visibilityState: string };
  let windowEvents: EventEmitter;
  let handler: AdobeEdgeHandler;
  let oldTracker: ReturnType<typeof createMockTracker>;
  let newTracker: ReturnType<typeof createMockTracker>;

  beforeEach(() => {
    jest.useFakeTimers();
    setupAlloyMocks();
    lifecycle = Object.assign(new EventEmitter(), { visibilityState: 'visible' });
    windowEvents = new EventEmitter();
    global.document = lifecycle as unknown as Document;
    global.window = windowEvents as unknown as Window & typeof globalThis;
    ({ player } = makePlayer());
    player.source = { metadata: { title: 'Game' } };
    player.duration = Infinity;
    player.paused = false;
    oldTracker = createMockTracker();
    newTracker = createMockTracker();
    mockMedia.getInstance
      .mockReset()
      .mockReturnValueOnce(oldTracker as unknown as ReturnType<typeof mockMedia.getInstance>)
      .mockReturnValue(newTracker as unknown as ReturnType<typeof mockMedia.getInstance>);
  });

  afterEach(async () => {
    handler?.destroy();
    await flushMicrotasks();
    jest.useRealTimers();
    Reflect.deleteProperty(global, 'document');
  });

  function createHandler() {
    handler = new AdobeEdgeHandler(player, { datastreamId: 'resume-test', orgId: 'org', edgeBasePath: 'ee' });
  }

  function visibility(state: string) {
    lifecycle.visibilityState = state;
    lifecycle.emit('visibilitychange');
  }

  function longGap() {
    jest.setSystemTime(Date.now() + 11 * 60 * 1000);
  }

  it('destroys stale tracker before creating one replacement with retained metadata', async () => {
    createHandler();
    handler.updateMetadata({ friendlyName: 'Live Game', season: '2' });
    await flushMicrotasks();
    visibility('hidden');
    longGap();
    visibility('visible');
    windowEvents.emit('pageshow');
    await flushMicrotasks();
    expect(oldTracker.destroy).toHaveBeenCalledTimes(1);
    expect(oldTracker.trackSessionEnd).not.toHaveBeenCalled();
    expect(newTracker.trackSessionStart).toHaveBeenCalledTimes(1);
    expect(newTracker.trackSessionStart.mock.calls[0][1]).toEqual({ friendlyName: 'Live Game', season: '2' });
    expect(newTracker.trackPlay).toHaveBeenCalledTimes(1);
    expect(newTracker.updatePlayhead).toHaveBeenCalled();
    expect(oldTracker.destroy.mock.invocationCallOrder[0]).toBeLessThan(newTracker.trackSessionStart.mock.invocationCallOrder[0]);
  });

  it('reuses a fresh session after a short suspension', async () => {
    createHandler();
    await flushMicrotasks();
    visibility('hidden');
    jest.setSystemTime(Date.now() + 60_000);
    visibility('visible');
    await flushMicrotasks();
    expect(oldTracker.destroy).not.toHaveBeenCalled();
    expect(newTracker.trackSessionStart).not.toHaveBeenCalled();
  });

  it('guards the first playback event when resume notification is missing', async () => {
    createHandler();
    await flushMicrotasks();
    longGap();
    player.emit('playing');
    await flushMicrotasks();
    expect(oldTracker.trackPlay).not.toHaveBeenCalled();
    expect(newTracker.trackPlay).toHaveBeenCalledTimes(1);
  });

  it('waits for playback when resuming paused or mid-ad', async () => {
    createHandler();
    await flushMicrotasks();
    windowEvents.emit('pagehide');
    longGap();
    player.paused = true;
    windowEvents.emit('pageshow');
    player.emit('pause');
    await flushMicrotasks();
    expect(newTracker.trackSessionStart).not.toHaveBeenCalled();
    expect(oldTracker.trackPause).not.toHaveBeenCalled();
    player.paused = false;
    player.ads = Object.assign(new EventEmitter(), { playing: true });
    player.emit('timeupdate');
    expect(newTracker.trackSessionStart).not.toHaveBeenCalled();
    player.ads.playing = false;
    player.emit('playing');
    await flushMicrotasks();
    expect(newTracker.trackSessionStart).toHaveBeenCalledTimes(1);
    expect(newTracker.trackEvent).not.toHaveBeenCalled();
  });

  it('drops old queued events and ignores late confirmation of an invalidated start', async () => {
    const start = deferred<{ sessionId: string }>();
    oldTracker.trackSessionStart.mockReturnValue(start.promise);
    createHandler();
    await flushMicrotasks();
    player.emit('waiting');
    visibility('hidden');
    longGap();
    visibility('visible');
    await flushMicrotasks();
    start.resolve({ sessionId: 'old-session' });
    await flushMicrotasks();
    expect(oldTracker.destroy).toHaveBeenCalledTimes(1);
    expect(oldTracker.trackEvent).not.toHaveBeenCalled();
    expect(oldTracker.trackSessionEnd).not.toHaveBeenCalled();
    expect(newTracker.trackEvent).not.toHaveBeenCalled();
    expect(newTracker.trackPlay).toHaveBeenCalledTimes(1);
  });

  it('does not wait for a hung old request to retire its tracker', async () => {
    createHandler();
    await flushMicrotasks();
    oldTracker.trackEvent.mockReturnValue(new Promise(() => {}));
    player.emit('waiting');
    visibility('hidden');
    longGap();
    visibility('visible');
    await flushMicrotasks();
    expect(oldTracker.destroy).toHaveBeenCalledTimes(1);
    expect(newTracker.trackSessionStart).toHaveBeenCalledTimes(1);
  });

  it('does not reuse retired metadata after a source change', async () => {
    createHandler();
    handler.updateMetadata({ friendlyName: 'Old Game' });
    await flushMicrotasks();
    visibility('hidden');
    longGap();
    player.paused = true;
    visibility('visible');
    player.emit('sourcechange');
    player.source = { metadata: { title: 'New Game' } };
    player.emit('loadedmetadata');
    await flushMicrotasks();
    expect(newTracker.trackSessionStart.mock.calls[0][1]).toEqual({});
  });

  it('keeps replacement retries bounded and does not retry while suspended', async () => {
    createHandler();
    await flushMicrotasks();
    newTracker.trackSessionStart.mockRejectedValue(new Error('offline'));
    visibility('hidden');
    longGap();
    visibility('visible');
    await jest.advanceTimersByTimeAsync(10_000);
    player.emit('playing');
    expect(newTracker.trackSessionStart).toHaveBeenCalledTimes(3);
    visibility('hidden');
    await jest.advanceTimersByTimeAsync(10_000);
    expect(newTracker.trackSessionStart).toHaveBeenCalledTimes(3);
  });

  it('does not start or flush tracking while hidden', async () => {
    visibility('hidden');
    createHandler();
    await flushMicrotasks();
    player.emit('playing');
    expect(oldTracker.trackSessionStart).not.toHaveBeenCalled();
    visibility('visible');
    await flushMicrotasks();
    expect(oldTracker.trackSessionStart).toHaveBeenCalledTimes(1);
    expect(oldTracker.trackPlay).toHaveBeenCalledTimes(1);
  });

  it('holds queued events when a fresh start confirms during suspension', async () => {
    const start = deferred<{ sessionId: string }>();
    oldTracker.trackSessionStart.mockReturnValue(start.promise);
    createHandler();
    await flushMicrotasks();
    player.emit('playing');
    visibility('hidden');
    start.resolve({ sessionId: 'session-1' });
    await flushMicrotasks();
    expect(oldTracker.trackPlay).not.toHaveBeenCalled();
    longGap();
    visibility('visible');
    await flushMicrotasks();
    expect(oldTracker.trackPlay).not.toHaveBeenCalled();
    expect(newTracker.trackPlay).toHaveBeenCalledTimes(1);
  });

  it('rolls over a day-long session despite ongoing player activity', async () => {
    createHandler();
    await flushMicrotasks();
    for (let i = 0; i < 24 * 60; i++) {
      jest.setSystemTime(Date.now() + 60_000);
      player.emit('timeupdate');
      await flushMicrotasks();
    }
    expect(newTracker.trackSessionStart).toHaveBeenCalledTimes(1);
    expect(oldTracker.destroy).toHaveBeenCalledTimes(1);
  });

  it('does not restart destroyed or ended playback on resume', async () => {
    createHandler();
    await flushMicrotasks();
    player.ended = true;
    player.emit('ended');
    lifecycle.emit('freeze');
    longGap();
    lifecycle.emit('resume');
    handler.destroy();
    lifecycle.emit('visibilitychange');
    await flushMicrotasks();
    expect(newTracker.trackSessionStart).not.toHaveBeenCalled();
  });
});
