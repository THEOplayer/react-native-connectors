import { EventEmitter } from '../utils/EventEmitter';

/**
 * Creates a minimal player mock that satisfies the shape expected by
 * AdobeEdgeHandler.
 */
export function makePlayer() {
  const player = new EventEmitter() as any;

  const videoTrack = new EventEmitter() as any;
  const videoTracks = new EventEmitter() as any;
  videoTracks._tracks = [videoTrack];

  const textTracks = new EventEmitter() as any;

  player.currentTime = 10;
  player.duration = 3600;
  player.paused = true;
  player.source = undefined;
  player.textTracks = textTracks;
  player.videoTracks = videoTracks;
  player.ads = undefined;

  return { player, videoTrack, videoTracks };
}
